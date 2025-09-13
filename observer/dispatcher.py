from typing import Callable, Dict, List, Optional
from threading import RLock
from .events import Event

ObserverCallback = Callable[[Event], None]


class Dispatcher:
    """Thread-safe, minimal event dispatcher / registry (singleton-like)."""

    _instance: Optional["Dispatcher"] = None
    _registry: Dict[str, List[ObserverCallback]]
    _lock: RLock

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._registry = {}
            cls._instance._lock = RLock()
        return cls._instance

    def subscribe(self, event_name: str, callback: ObserverCallback) -> None:
        """Subscribe a callback to an event name."""
        with self._lock:
            self._registry.setdefault(event_name, []).append(callback)

    def unsubscribe(self, event_name: str, callback: ObserverCallback) -> None:
        """Unsubscribe a callback from an event name."""
        with self._lock:
            handlers = self._registry.get(event_name)
            if handlers and callback in handlers:
                handlers.remove(callback)
                if not handlers:
                    self._registry.pop(event_name, None)

    def publish(self, event: Event) -> None:
        """Publish an Event to all subscribed callbacks (synchronous)."""
        handlers = []
        with self._lock:
            handlers = list(self._registry.get(event.name, []))
        for cb in handlers:
            try:
                cb(event)
            except Exception:
                continue

dispatcher = Dispatcher()
