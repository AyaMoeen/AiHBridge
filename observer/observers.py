from typing import Protocol
from .events import Event

class Observer(Protocol):
    """Observer interface. Implement this or provide a callable(event)."""
    def __call__(self, event: Event) -> None:
        ...
