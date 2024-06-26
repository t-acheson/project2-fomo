from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class RecommendationRequest(_message.Message):
    __slots__ = ("datetime", "category")
    DATETIME_FIELD_NUMBER: _ClassVar[int]
    CATEGORY_FIELD_NUMBER: _ClassVar[int]
    datetime: str
    category: str
    def __init__(self, datetime: _Optional[str] = ..., category: _Optional[str] = ...) -> None: ...

class RecommendationReply(_message.Message):
    __slots__ = ("name", "id", "lat", "lng")
    NAME_FIELD_NUMBER: _ClassVar[int]
    ID_FIELD_NUMBER: _ClassVar[int]
    LAT_FIELD_NUMBER: _ClassVar[int]
    LNG_FIELD_NUMBER: _ClassVar[int]
    name: str
    id: int
    lat: float
    lng: float
    def __init__(self, name: _Optional[str] = ..., id: _Optional[int] = ..., lat: _Optional[float] = ..., lng: _Optional[float] = ...) -> None: ...
