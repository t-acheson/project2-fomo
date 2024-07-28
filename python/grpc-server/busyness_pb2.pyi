from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class BusynessRequest(_message.Message):
    __slots__ = ("locationid",)
    LOCATIONID_FIELD_NUMBER: _ClassVar[int]
    locationid: int
    def __init__(self, locationid: _Optional[int] = ...) -> None: ...

class BusynessReply(_message.Message):
    __slots__ = ("busyness",)
    BUSYNESS_FIELD_NUMBER: _ClassVar[int]
    busyness: float
    def __init__(self, busyness: _Optional[float] = ...) -> None: ...
