from pydantic import BaseModel
from typing import Optional, List, Any
from enum import Enum


class ResponseStatus(str, Enum):
    SUCCESS = "success"
    ERROR = "error"
    VALIDATION_ERROR = "validation_error"


class ApiResponse(BaseModel):
    status: ResponseStatus
    data: Optional[Any] = None  
    message: Optional[str] = None 
    errors: Optional[List[str]] = None 
    
    class Config:
        use_enum_values = True
