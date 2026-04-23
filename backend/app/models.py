import uuid
from datetime import datetime, timezone
from typing import Any

from pydantic import EmailStr
from sqlalchemy import JSON, Column, DateTime, UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore[assignment]
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime | None = None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore[assignment]


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime | None = None


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


class ContentBlockBase(SQLModel):
    scope: str = Field(min_length=1, max_length=50, index=True)
    slug: str = Field(min_length=1, max_length=100, index=True)
    title: str = Field(min_length=1, max_length=255)
    content: dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
    )


class ContentBlockCreate(ContentBlockBase):
    pass


class ContentBlockUpdate(SQLModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    content: dict[str, Any] | None = None


class ContentBlock(ContentBlockBase, table=True):
    __table_args__ = (UniqueConstraint("scope", "slug", name="uq_content_block_scope_slug"),)

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    updated_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )


class ContentBlockPublic(ContentBlockBase):
    id: uuid.UUID
    created_at: datetime | None = None
    updated_at: datetime | None = None


class ContentBlocksPublic(SQLModel):
    data: list[ContentBlockPublic]
    count: int


class PageBase(SQLModel):
    slug: str = Field(min_length=1, max_length=100, index=True)
    title: str = Field(min_length=1, max_length=255)
    navigation_title: str = Field(min_length=1, max_length=255)
    show_in_navigation: bool = True
    navigation_order: int = 0
    is_home: bool = False


class PageCreate(PageBase):
    pass


class PageUpdate(SQLModel):
    slug: str | None = Field(default=None, min_length=1, max_length=100)
    title: str | None = Field(default=None, min_length=1, max_length=255)
    navigation_title: str | None = Field(default=None, min_length=1, max_length=255)
    show_in_navigation: bool | None = None
    navigation_order: int | None = None
    is_home: bool | None = None


class Page(PageBase, table=True):
    __table_args__ = (UniqueConstraint("slug", name="uq_page_slug"),)

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    updated_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    sections: list["PageSection"] = Relationship(
        back_populates="page",
        cascade_delete=True,
    )


class PagePublic(PageBase):
    id: uuid.UUID
    created_at: datetime | None = None
    updated_at: datetime | None = None


class PagesPublic(SQLModel):
    data: list[PagePublic]
    count: int


class PageSectionBase(SQLModel):
    kind: str = Field(min_length=1, max_length=50)
    title: str = Field(min_length=1, max_length=255)
    position: int = 0
    content: dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
    )


class PageSectionCreate(PageSectionBase):
    pass


class PageSectionUpdate(SQLModel):
    kind: str | None = Field(default=None, min_length=1, max_length=50)
    title: str | None = Field(default=None, min_length=1, max_length=255)
    position: int | None = None
    content: dict[str, Any] | None = None


class PageSection(PageSectionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    page_id: uuid.UUID = Field(
        foreign_key="page.id",
        nullable=False,
        ondelete="CASCADE",
        index=True,
    )
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    updated_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    page: Page | None = Relationship(back_populates="sections")


class PageSectionPublic(PageSectionBase):
    id: uuid.UUID
    page_id: uuid.UUID
    created_at: datetime | None = None
    updated_at: datetime | None = None


class CmsPagePublic(PagePublic):
    sections: list["PageSectionPublic"] = Field(default_factory=list)


class CmsAdminPublic(SQLModel):
    shared: list[ContentBlockPublic] = Field(default_factory=list)
    pages: list[CmsPagePublic] = Field(default_factory=list)


class ContentBundlePublic(SQLModel):
    page: PagePublic | None = None
    shared: list[ContentBlockPublic] = Field(default_factory=list)
    navigation: list[PagePublic] = Field(default_factory=list)
    sections: list[PageSectionPublic] = Field(default_factory=list)


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)
