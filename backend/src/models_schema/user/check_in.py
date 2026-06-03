from datetime import datetime
from typing import TYPE_CHECKING, Annotated

from sqlalchemy import UniqueConstraint
from sqlmodel import (
    Column,
    Date,
    DateTime,
    Field,
    Index,
    Relationship,
    SQLModel,
    cast,
    column,
    func,
)

if TYPE_CHECKING:
    from backend.src.models_schema.user.user import User


class CheckIn(SQLModel, table=True):
    __tablename__ = "check_in"  # type: ignore

    id: Annotated[int | None, Field(primary_key=True, nullable=False)] = None
    user_id: Annotated[int | None, Field(foreign_key="user.id", nullable=False)] = None

    time: Annotated[
        datetime,
        Field(
            sa_column=Column(DateTime(timezone=True)),
        ),
    ]

    user: "User" = Relationship(back_populates="check_ins")

    __table_args__ = (
        Index(
            "UQ_USER_DATE",
            "user_id",
            cast(func.timezone("UTC", column("time")), Date),
            unique=True,
        ),
    )
