import mysql.connector
from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
import base64
import boto3
from datetime import datetime
import hashlib
from fastapi.middleware.cors import CORSMiddleware

from models.models import Register, Login, id, Profile, Editalbum, Editprofile, uploadphoto, Createalbum

app = FastAPI()
# uvicorn main:app --reload

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir acceso desde cualquier origen
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    # allow_headers=["Authorization", "Content-Type"],
)

config = {
    'user': 'admin',
    'password': 'G13-semi1',
    'host': 'semi1album.cp6ci0o0mhlv.us-east-1.rds.amazonaws.com',
    'database': 'semi1album',
    'port':'3306',
    'raise_on_warnings': True,
}

    
# Datos de AWS
AWS_ACCESS = ''
AWS_SECRET = ''
BUCKET_NAME = ''
region_name = ''



# Instancia de rekognition
# rekognition_client = boto3.client('rekognition', region_name=region_name, aws_access_key_id=AWS_ACCESS, aws_secret_access_key=AWS_SECRET)

s3_client = boto3.client("s3", aws_access_key_id=AWS_ACCESS, aws_secret_access_key=AWS_SECRET)



class Item(BaseModel):
    name: str
    gender: str
    multiplayer: int


# cnx = mysql.connector.connect(**config)
def execute_query(query, params= None):
    try:
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        if params is None:
            cursor.execute(query)
        else:
            cursor.execute(query, params)
        if cursor.with_rows:
            return cursor.fetchall()
        else:
            connection.commit()
            cursor.close()
            connection.close()        
            # print("ENTRO TRYE DB", response)
            return True
    except Exception as e:
        print("ENTRO EXCEPT", e)
        return False
    

@app.post("/register")
async def registeruser(photo: UploadFile = File(...), user: str = Form(...), name: str = Form(...), password: str = Form(...), confpass: str = Form(...)):
    # Confirmar Contraseñas
    if password != confpass:
        return {'Error':'Las contraseñas con coinciden'}
    # Confirmar si ya existe el usuario
    exists_sql = f"SELECT EXISTS (SELECT 1 FROM user WHERE user = %s) AS user_exists"
    params = (user,)
    response = execute_query(exists_sql, params)
    if response[0] == 1:
        return {'Error':'El nombre de usuario ya existe '}

    # Subir a S3
    file_contents = await photo.read()
    actual_date = datetime.now()
    key = 'Fotos_Perfil/'+user+";"+photo.filename+str(actual_date)
    user = key.split(";")[0].split("/")[-1]
    print("ENCONTRO EL USER",user)
    s3_client.put_object(Bucket=BUCKET_NAME, Key=key, Body=file_contents)
    link = s3_client.generate_presigned_url('get_object', Params={'Bucket':BUCKET_NAME, 'Key':key, }, ExpiresIn=None);

    passwordcode = hashlib.md5(password.encode()).hexdigest()
    print(password)
    print(passwordcode)
    # Aquí puedes procesar el archivo (file_contents) o guardarlos en S3, etc.
    insert_sql = f"INSERT INTO user (user, name, password, photo) VALUES (%s, %s, %s, %s)"
    params = (user, name, passwordcode, link)
    response = execute_query(insert_sql, params)
    if not response :
        return {"Error":"Usuario no insertado"}
    
    insert_sql_photo = f"INSERT INTO photoprofile (name, photo, user) VALUES (%s, %s, %s)"
    params = (name, link, user)
    response = execute_query(insert_sql_photo, params)
    if response :
        return {"mensaje":"Usuario insertado con éxito"}
    else:
        return {"Error":"Usuario no insertado"}


@app.post("/login")
async def loginuser(item: Login):
    sql = f"SELECT COUNT(*) AS exist FROM user WHERE user = %s AND password = %s"
    passwordcode = hashlib.md5(item.password.encode()).hexdigest()
    params = (item.user, passwordcode)
    response = execute_query(sql, params)
    print(response)
    print("RERERE",response[0])
    if response[0][0] == 0:
        return {"Error": "El usuario o la contraseña no coinciden"}
    sql = f"SELECT user, name, photo, id FROM user WHERE user = %s"
    params = (item.user,)
    response = execute_query(sql, params)

    # print("RESPONSE LOGIN", response[0])
    toreturn = {"user":response[0][0],
            "name":response[0][1],
            "photo":response[0][2],
            "id":response[0][3]
    }
    return toreturn
    # return {"mensaje": "Contraseña confirmada",
    #         "user" : item.user}

# @app.get("/profile")
# async def seeprofile(item: id):

@app.post("/editprofile")
async def edituserprofile(photo: UploadFile = File(None), name: str = Form(...), password: str = Form(...), newuser: str = Form(...), id: int = Form(...)):
    print("ENTRE", photo )
    sql = f"SELECT COUNT(*) AS exist FROM user WHERE id = %s AND password = %s"
    print("PASS", password )
    print("USER", id )
    passwordcode = hashlib.md5(password.encode()).hexdigest()
    print("PASSCODE", passwordcode )
    params = (id, passwordcode)
    response = execute_query(sql, params)

    if response[0] == 0:
        return {"Error": "El usuario o la contraseña no coinciden"},400

    sql = ""
    params = ()
    lastuser = ""
    insert_sql_photo =""
    params_phot = ()
    link = ""
    if photo == None:
        print("ENTRE NO PHOT", photo )
        sql = f"UPDATE user SET user=%S, name = %s FROM user WHERE id = %s"
        params = (newuser, name, id)
    else:
        print("ENTRE SI HOTO", photo )
        # Subir a S3
        file_contents = await photo.read()
        actual_date = datetime.now()
        key = 'Fotos_Perfil/'+str(id)+";"+photo.filename+str(actual_date)
        user = key.split(";")[0].split("/")[-1]
        s3_client.put_object(Bucket=BUCKET_NAME, Key=key, Body=file_contents)
        link = s3_client.generate_presigned_url('get_object', Params={'Bucket':BUCKET_NAME, 'Key':key, }, ExpiresIn=None);

        insert_sql_photo = f"INSERT INTO photoprofile (name, photo, user_id) VALUES (%s, %s, %s)"
        params_phot = (name, link, id)
        response = execute_query(insert_sql_photo, params_phot)
        sql = f"UPDATE user SET user=%s, name = %s , photo = %s WHERE id = %s"
        params = (newuser, name, link, id)

    response = execute_query(sql, params)
    print("FINAL", photo )
    if response :
        toreturn = {"user":newuser,
            "name":name,
            "photo":link,
            "id":id
        }
        return toreturn
    else:
        return {"Error":"No se ha podido editar al usuario"},400


@app.post("/createalbum")
async def editalbum(item: Createalbum):
    insert_sql = f"INSERT INTO album (user_id, name) VALUES (%s, %s)"
    params = (item.id, item.album)
    response = execute_query(insert_sql, params)
    print(response)
    if response :
        return {"mensaje":"Álbum creado correctamente"}
    else:
        return {"Error":"No se ha podido crear el álbum"}

@app.post("/justalbums")
async def seealbum(item: id):
    sql = f"SELECT * FROM album WHERE user_id= %s"
    sss = str(item.user)
    params = (sss,)
    response = execute_query(sql, params)
    print(response)
    albumes = []
    for dato in response:
        albumes.append({"title": dato[1].capitalize(), "id": dato[0]})
    print(albumes)
    return albumes

@app.post("/editalbum")
async def editalbum(item: Editalbum):
    sql = f"UPDATE album SET name = %s WHERE id = %s AND user_id = %s"
    params = (item.newalbum, item.id_album, item.id)
    response = execute_query(sql, params)
    if response :
        return {"mensaje":"Álbum editado correctamente"}
    else:
        return {"Error":"No se ha podido editar al álbum"}

@app.post("/deletealbum")
async def deletealbum(item: id):
    entero = int(item.user)
    sql = f"DELETE FROM album WHERE id = %s"
    params = (item.user,)
    response = execute_query(sql, params)
    print(item)
    if response :
        return {"mensaje":"Álbum eliminado correctamente"}
    else:
        return {"Error":"No se ha podido eliminar al álbum"}


@app.post("/upload")
async def uploadimage(photo: UploadFile = File(...), album: str = Form(...), name: str = Form(...), id: str = Form(...)):
    # Subir a S3
    file_contents = await photo.read()
    actual_date = datetime.now()
    key = 'Fotos_Publicadas/'+id+";"+photo.filename+str(actual_date)
    user = key.split(";")[0].split("/")[-1]
    print("ENCONTRO EL USER",user)
    s3_client.put_object(Bucket=BUCKET_NAME, Key=key, Body=file_contents)
    link = s3_client.generate_presigned_url('get_object', Params={'Bucket':BUCKET_NAME, 'Key':key, }, ExpiresIn=None);


    insert_sql = f"INSERT INTO photoalbum (photo, album_id, name ) VALUES (%s, %s, %s)"
    params = (link, album, name)
    response = execute_query(insert_sql, params)
    if response :
        return {"mensaje":"Foto subida correctamente"}
    else:
        return {"Error":"No se ha podido subir la foto"}

@app.post("/albums")
async def seealbum(item: id):
    sql = f"SELECT a.id AS ID_ALBUM, pa.photo AS photo_album, a.name AS album_name, pa.name AS photo_name, pa.id AS ID_PHOTO FROM user u JOIN album a ON u.id = a.user_id JOIN photoalbum pa ON a.id = pa.album_id WHERE u.id = %s"
    params = (item.user,)
    response = execute_query(sql, params)
    print("RESPONSE 1: ",response)

    albums = {}
    for album_id, photo_album, album_name, photo_name, photo_id in response:
        # Si el álbum ya está en el diccionario, agregamos la imagen al álbum existente
        if album_id in albums:
            albums[album_id]["fotos"].append({"id": photo_id, "url": photo_album, "descripcion": photo_name})
        # Si no, creamos un nuevo álbum y agregamos la imagen al álbum
        else:
            albums[album_id] = {"id": album_id, "nombre": album_name, "fotos": [{"id": photo_id, "url": photo_album, "descripcion": photo_name}]}

    formatted_data = list(albums.values())

    sql = f"SELECT pp.photo AS photo_profile, pp.name AS photo_name FROM user u JOIN photoprofile pp ON u.id = pp.user_id WHERE u.id = %s"
    response2 = execute_query(sql, params)
    print("-------------------- ")
    print("RESPONSE2, ",response2)

    formatted_data2 = [{"url": item[0], "usuario": item[1]} for item in response2]
    # formatted_data.append(formatted_data2)
    arreglo = [formatted_data]
    arreglo.append(formatted_data2)
    return arreglo

@app.get("/albumsprofile")
async def seealbum(item: id):
    sql = f"SELECT a.name AS Album_name, p.name AS Photo_name, p.photo AS Link FROM album a , photoalbum p, user u WHERE a.id = p.album_id AND a.user = %s"
    params = (item.user,)
    response = execute_query(sql, params)
    print(response)
    album = ""
    for i in response[0]:
        print("I",i)
    toreturn = {"user":response[0],
            "name":response[1],
            "photo":response[2]
    }
    return toreturn




# @app.get("/")
# def get_main():
#     cursor = cnx.cursor()
#     query = "SELECT * FROM games"
#     cursor.execute(query)
#     users = cursor.fetchall()
#     cursor.close()
#     print("juegos",users)
#     return {"juegos":users}


# @app.get("/users")
# def get_users():
#     cursor = cnx.cursor()
#     query = "SELECT * FROM users"
#     cursor.execute(query)
#     users = cursor.fetchall()
#     cursor.close()
#     return {"users": users}

# @app.get("/dbtest")
# def test_db_connection():
#     cursor = cnx.cursor()
#     cursor.execute("SELECT VERSION()")
#     result = cursor.fetchone()
#     cursor.close()
#     return {"db_version": result[0]}

