from sqlmodel import Session, create_engine, select

from app import crud
from app.content_defaults import get_default_content_blocks, get_default_pages
from app.core.config import settings
from app.models import (
    ContentBlock,
    ContentBlockCreate,
    Page,
    PageCreate,
    PageSection,
    PageSectionCreate,
    User,
    UserCreate,
)

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.create_user(session=session, user_create=user_in)

    existing_blocks = {
        (block.scope, block.slug)
        for block in session.exec(select(ContentBlock)).all()
    }
    for block_data in get_default_content_blocks():
        block_key = (block_data["scope"], block_data["slug"])
        if block_key in existing_blocks:
            continue
        block = ContentBlock.model_validate(ContentBlockCreate(**block_data))
        session.add(block)

    existing_pages = {page.slug: page for page in session.exec(select(Page)).all()}
    for page_definition in get_default_pages():
        page_data = {key: value for key, value in page_definition.items() if key != "sections"}
        sections_data = page_definition["sections"]
        page = existing_pages.get(page_data["slug"])
        if not page:
            page = Page.model_validate(PageCreate(**page_data))
            session.add(page)
            session.flush()

        existing_section_titles = {
            section.title
            for section in session.exec(
                select(PageSection).where(PageSection.page_id == page.id)
            ).all()
        }
        for section_data in sections_data:
            if section_data["title"] in existing_section_titles:
                continue
            section = PageSection.model_validate(
                PageSectionCreate(**section_data),
                update={"page_id": page.id},
            )
            session.add(section)

    session.commit()
