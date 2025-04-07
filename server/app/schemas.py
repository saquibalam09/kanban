from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, Literal

class TaskBase(BaseModel):
    title: str
    description: str
    status: Literal["TODO", "IN_PROGRESS", "DONE"] = "TODO"  # Default status

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)