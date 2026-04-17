"""Add content blocks

Revision ID: b0d9f6c3a421
Revises: fe56fa70289e
Create Date: 2026-04-17 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'b0d9f6c3a421'
down_revision = 'fe56fa70289e'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'contentblock',
        sa.Column('scope', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=False),
        sa.Column('slug', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('content', sa.JSON(), nullable=False),
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('scope', 'slug', name='uq_content_block_scope_slug'),
    )
    op.create_index(op.f('ix_contentblock_scope'), 'contentblock', ['scope'], unique=False)
    op.create_index(op.f('ix_contentblock_slug'), 'contentblock', ['slug'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_contentblock_slug'), table_name='contentblock')
    op.drop_index(op.f('ix_contentblock_scope'), table_name='contentblock')
    op.drop_table('contentblock')
