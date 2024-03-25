from pydantic import BaseModel
from typing import Optional



class Register(BaseModel):
    user: str
    name: str
    password: str
    confpass: str
    photo: str

class Login(BaseModel):
    user: str
    password: str

class Profile(BaseModel):
    user: str
    name: str
    photo: str

class id(BaseModel):
    user: str

class Editprofile(BaseModel):
    user: str
    name: str
    photo: Optional[str] = None
    password: str
    newuser: str

class uploadphoto(BaseModel):
    album: str
    photo: str
    name: str
    id: str

class Createalbum(BaseModel):
    id: int
    album: str

class Editalbum(BaseModel):
    id: int
    id_album: int
    newalbum: str
