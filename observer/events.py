from dataclasses import dataclass
from typing import Any

@dataclass(frozen=True)
class Event:
    """Base event. Concrete events should extend this."""
    name: str
    payload: dict[str, Any]
