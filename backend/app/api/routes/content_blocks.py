import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import col, func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    ContentBlock,
    ContentBlockPublic,
    ContentBlocksPublic,
    ContentBlockUpdate,
    ContentBundlePublic,
)

router = APIRouter(prefix="/content-blocks", tags=["content-blocks"])


def _require_superuser(current_user: CurrentUser) -> None:
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")


@router.get("/", response_model=ContentBlocksPublic)
def read_content_blocks(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve content blocks for the admin editor.
    """
    _require_superuser(current_user)
    count = session.exec(select(func.count()).select_from(ContentBlock)).one()
    statement = (
        select(ContentBlock)
        .order_by(col(ContentBlock.scope), col(ContentBlock.slug))
        .offset(skip)
        .limit(limit)
    )
    blocks = session.exec(statement).all()
    return ContentBlocksPublic(
        data=[ContentBlockPublic.model_validate(block) for block in blocks],
        count=count,
    )


@router.get("/bundle/{page_slug}", response_model=ContentBundlePublic)
def read_content_bundle(session: SessionDep, page_slug: str) -> Any:
    """
    Retrieve the public content bundle for a page plus shared blocks.
    """
    shared_blocks = session.exec(
        select(ContentBlock)
        .where(ContentBlock.scope == "shared")
        .order_by(col(ContentBlock.slug))
    ).all()
    page_block = session.exec(
        select(ContentBlock).where(
            ContentBlock.scope == "page",
            ContentBlock.slug == page_slug,
        )
    ).first()
    return ContentBundlePublic(
        page=ContentBlockPublic.model_validate(page_block) if page_block else None,
        shared=[ContentBlockPublic.model_validate(block) for block in shared_blocks],
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
    Update a content block.
    """
    _require_superuser(current_user)
    block = session.get(ContentBlock, block_id)
    if not block:
        raise HTTPException(status_code=404, detail="Content block not found")

    update_data = block_in.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    block.sqlmodel_update(update_data)
    session.add(block)
    session.commit()
    session.refresh(block)
    return block
