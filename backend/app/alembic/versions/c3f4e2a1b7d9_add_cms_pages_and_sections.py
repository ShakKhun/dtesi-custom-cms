"""Add CMS pages and sections

Revision ID: c3f4e2a1b7d9
Revises: b0d9f6c3a421
Create Date: 2026-04-20 14:30:00.000000

"""

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = "c3f4e2a1b7d9"
down_revision = "b0d9f6c3a421"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "page",
        sa.Column("slug", sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
        sa.Column("title", sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column(
            "navigation_title",
            sqlmodel.sql.sqltypes.AutoString(length=255),
            nullable=False,
        ),
        sa.Column("show_in_navigation", sa.Boolean(), nullable=False),
        sa.Column("navigation_order", sa.Integer(), nullable=False),
        sa.Column("is_home", sa.Boolean(), nullable=False),
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug", name="uq_page_slug"),
    )
    op.create_index(op.f("ix_page_slug"), "page", ["slug"], unique=False)

    op.create_table(
        "pagesection",
        sa.Column("kind", sqlmodel.sql.sqltypes.AutoString(length=50), nullable=False),
        sa.Column("title", sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("content", sa.JSON(), nullable=False),
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("page_id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["page_id"], ["page.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_pagesection_page_id"), "pagesection", ["page_id"], unique=False)


def downgrade():
    op.drop_index(op.f("ix_pagesection_page_id"), table_name="pagesection")
    op.drop_table("pagesection")
    op.drop_index(op.f("ix_page_slug"), table_name="page")
    op.drop_table("page")
