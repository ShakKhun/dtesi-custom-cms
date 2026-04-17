from sqlmodel import Session, create_engine, select

from app import crud
from app.content_defaults import get_default_content_blocks
from app.core.config import settings
from app.models import ContentBlock, ContentBlockCreate, User, UserCreate

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

    session.commit()
