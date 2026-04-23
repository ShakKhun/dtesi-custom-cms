import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import col, func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    CmsAdminPublic,
    CmsPagePublic,
    ContentBlock,
    ContentBlockPublic,
    ContentBlocksPublic,
    ContentBlockUpdate,
    ContentBundlePublic,
    Message,
    Page,
    PageCreate,
    PagePublic,
    PageSection,
    PageSectionCreate,
    PageSectionPublic,
    PageSectionUpdate,
    PagesPublic,
    PageUpdate,
)

router = APIRouter(prefix="/content-blocks", tags=["content-blocks"])


def _require_superuser(current_user: CurrentUser) -> None:
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")


def _navigation_query():
    return (
        select(Page)
        .where(Page.show_in_navigation)
        .order_by(col(Page.navigation_order), col(Page.title))
    )


def _shared_blocks_query():
    return (
        select(ContentBlock)
        .where(ContentBlock.scope == "shared", ContentBlock.slug != "navigation")
        .order_by(col(ContentBlock.slug))
    )


def _page_sections_query(page_id: uuid.UUID):
    return (
        select(PageSection)
        .where(PageSection.page_id == page_id)
        .order_by(col(PageSection.position), col(PageSection.created_at))
    )


@router.get("/", response_model=ContentBlocksPublic)
def read_content_blocks(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve shared content blocks for the admin editor.
    """
    _require_superuser(current_user)
    count = session.exec(
        select(func.count())
        .select_from(ContentBlock)
        .where(ContentBlock.scope == "shared", ContentBlock.slug != "navigation")
    ).one()
    statement = _shared_blocks_query().offset(skip).limit(limit)
    blocks = session.exec(statement).all()
    return ContentBlocksPublic(
        data=[ContentBlockPublic.model_validate(block) for block in blocks],
        count=count,
    )


@router.get("/admin", response_model=CmsAdminPublic)
def read_cms_admin_data(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Retrieve the CMS dashboard payload for the admin editor.
    """
    _require_superuser(current_user)
    shared_blocks = session.exec(_shared_blocks_query()).all()
    pages = session.exec(
        select(Page).order_by(col(Page.navigation_order), col(Page.created_at))
    ).all()

    return CmsAdminPublic(
        shared=[ContentBlockPublic.model_validate(block) for block in shared_blocks],
        pages=[
            CmsPagePublic(
                **PagePublic.model_validate(page).model_dump(),
                sections=[
                    PageSectionPublic.model_validate(section)
                    for section in session.exec(_page_sections_query(page.id)).all()
                ],
            )
            for page in pages
        ],
    )


@router.get("/pages", response_model=PagesPublic)
def read_pages(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Retrieve pages for the admin editor.
    """
    _require_superuser(current_user)
    pages = session.exec(
        select(Page).order_by(col(Page.navigation_order), col(Page.created_at))
    ).all()
    return PagesPublic(
        data=[PagePublic.model_validate(page) for page in pages],
        count=len(pages),
    )


@router.post("/pages", response_model=PagePublic)
def create_page(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    page_in: PageCreate,
) -> Any:
    """
    Create a new CMS page.
    """
    _require_superuser(current_user)
    existing_page = session.exec(select(Page).where(Page.slug == page_in.slug)).first()
    if existing_page:
        raise HTTPException(status_code=400, detail="Page slug already exists")

    if page_in.is_home:
        for page in session.exec(select(Page).where(Page.is_home)).all():
            page.is_home = False
            page.updated_at = datetime.now(timezone.utc)
            session.add(page)

    page = Page.model_validate(page_in)
    session.add(page)
    session.commit()
    session.refresh(page)
    return page


@router.put("/pages/{page_id}", response_model=PagePublic)
def update_page(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    page_id: uuid.UUID,
    page_in: PageUpdate,
) -> Any:
    """
    Update a CMS page.
    """
    _require_superuser(current_user)
    page = session.get(Page, page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    update_data = page_in.model_dump(exclude_unset=True)
    if "slug" in update_data:
        existing_page = session.exec(
            select(Page).where(Page.slug == update_data["slug"], Page.id != page_id)
        ).first()
        if existing_page:
            raise HTTPException(status_code=400, detail="Page slug already exists")

    if update_data.get("is_home"):
        for other_page in session.exec(select(Page).where(Page.is_home, Page.id != page.id)).all():
            other_page.is_home = False
            other_page.updated_at = datetime.now(timezone.utc)
            session.add(other_page)

    update_data["updated_at"] = datetime.now(timezone.utc)
    page.sqlmodel_update(update_data)
    session.add(page)
    session.commit()
    session.refresh(page)
    return page


@router.post("/pages/{page_id}/sections", response_model=PageSectionPublic)
def create_page_section(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    page_id: uuid.UUID,
    section_in: PageSectionCreate,
) -> Any:
    """
    Create a new page section for a CMS page.
    """
    _require_superuser(current_user)
    page = session.get(Page, page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    section = PageSection.model_validate(section_in, update={"page_id": page_id})
    session.add(section)
    session.commit()
    session.refresh(section)
    return section


@router.put("/sections/{section_id}", response_model=PageSectionPublic)
def update_page_section(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    section_id: uuid.UUID,
    section_in: PageSectionUpdate,
) -> Any:
    """
    Update a CMS page section.
    """
    _require_superuser(current_user)
    section = session.get(PageSection, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Page section not found")

    update_data = section_in.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    section.sqlmodel_update(update_data)
    session.add(section)
    session.commit()
    session.refresh(section)
    return section


@router.delete("/sections/{section_id}", response_model=Message)
def delete_page_section(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    section_id: uuid.UUID,
) -> Any:
    """
    Delete a CMS page section.
    """
    _require_superuser(current_user)
    section = session.get(PageSection, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Page section not found")

    session.delete(section)
    session.commit()
    return Message(message="Page section deleted successfully")


@router.get("/bundle/{page_slug}", response_model=ContentBundlePublic)
def read_content_bundle(session: SessionDep, page_slug: str) -> Any:
    """
    Retrieve the public content bundle for a page plus shared blocks.
    """
    shared_blocks = session.exec(_shared_blocks_query()).all()
    navigation_pages = session.exec(_navigation_query()).all()
    page = session.exec(select(Page).where(Page.slug == page_slug)).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    page_sections = session.exec(_page_sections_query(page.id)).all()
    return ContentBundlePublic(
        page=PagePublic.model_validate(page),
        shared=[ContentBlockPublic.model_validate(block) for block in shared_blocks],
        navigation=[PagePublic.model_validate(nav_page) for nav_page in navigation_pages],
        sections=[PageSectionPublic.model_validate(section) for section in page_sections],
    )


@router.put("/{block_id}", response_model=ContentBlockPublic)
def update_content_block(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    block_id: uuid.UUID,
    block_in: ContentBlockUpdate,
) -> Any:
    """
    Update a shared content block.
    """
    _require_superuser(current_user)
    block = session.get(ContentBlock, block_id)
    if not block or block.scope != "shared":
        raise HTTPException(status_code=404, detail="Content block not found")

    update_data = block_in.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    block.sqlmodel_update(update_data)
    session.add(block)
    session.commit()
    session.refresh(block)
    return block
