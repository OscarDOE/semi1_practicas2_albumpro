const express = require('express');
const multer = require('multer');
const fs = require('fs');
const mysql = require('mysql2');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Configuración de AWS
const s3 = new AWS.S3({

});
const BUCKET_NAME = 'practica1-g13-imagenes-sa';

// Configuración de MySQL
const dbConfig = {

};
const pool = mysql.createPool(dbConfig);

// Middleware para manejar la carga de archivos
const upload = multer({ dest: 'uploads/' });

// Middleware para parsear el body como JSON
app.use(express.json());

// Función para ejecutar consultas SQL
const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error)
        reject(error);
      resolve(results);
    });
  });
};

// Ruta para el registro de usuario
app.post('/register', upload.single('photo'), async (req, res) => {
  const { user, name, password, confpass } = req.body;
  const file = req.file;

  // Confirmar Contraseñas
  if (password !== confpass) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }

  // Confirmar si ya existe el usuario
  try {
    const [userExists] = await executeQuery('SELECT COUNT(*) AS user_exists FROM user WHERE user = ?', [user]);
    if (userExists.user_exists) {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }

    // Subir a S3
    const fileContents = fs.readFileSync(file.path);
    const key = `Fotos_Perfil/${user}-${file.originalname}-${uuidv4()}`;
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContents
    };
    await s3.upload(params).promise();
    const link = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

    const passwordHash = crypto.createHash('md5').update(password).digest('hex');

    // Insertar usuario en la base de datos
    await executeQuery('INSERT INTO user (user, name, password, photo) VALUES (?, ?, ?, ?)', [user, name, passwordHash, link]);
    await executeQuery('INSERT INTO photoprofile (name, photo, user) VALUES (?, ?, ?)', [name, link, user]);

    res.json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint de inicio de sesión de usuario
app.post('/login', async (req, res) => {
	const { user, password } = req.body;

	const passwordHash = crypto.createHash('md5').update(password).digest('hex');

	const loginQuery = 'SELECT COUNT(*) AS userCount FROM user WHERE user = ? AND password = ?';
	const userCount = await executeQuery(loginQuery, [user, passwordHash]);

	if (userCount[0].userCount === 0) {
			return res.status(400).json({ error: 'El usuario o la contraseña no coinciden' });
	}
	return res.status(200).json({ mensaje: 'Inicio de sesión exitoso' });
});

// Endpoint para ver el perfil de un usuario
app.get('/profile/:user', async (req, res) => {
	const user = req.params.user;

	const profileQuery = 'SELECT user, name, photo FROM user WHERE user = ?';
	const userProfile = await executeQuery(profileQuery, [user]);

	if (userProfile.length === 0) {
			return res.json({ error: 'El usuario no existe' });
	}

	const { user: username, name, photo } = userProfile[0];
	return res.json({ user: username, name, photo });
});

app.put('/editprofile/:user', upload.single('photo'), async (req, res) => {
	const { user: currentUser } = req.params;
	const { user, name, password, newuser } = req.body;
	const photo = req.file;

	// Verificar contraseña
	const passwordHash = crypto.createHash('md5').update(password).digest('hex');

	const checkPasswordQuery = 'SELECT COUNT(*) AS userCount FROM user WHERE user = ? AND password = ?';
	const userCount = await executeQuery(checkPasswordQuery, [currentUser, passwordHash]);

	if (userCount[0].userCount === 0) {
			return res.json({ error: 'La contraseña no es válida' });
	}

	// Actualizar perfil de usuario
	let updateProfileQuery = 'UPDATE user SET user = ?, name = ?';
	const updateProfileParams = [user, name];

	if (photo) {
		const fileContents = fs.readFileSync(photo.path);
    const key = `Fotos_Perfil/${user}-${photo.originalname}-${uuidv4()}`;
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContents
    };
    await s3.upload(params).promise();
    const link = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

			updateProfileQuery += ', photo = ?';
			updateProfileParams.push(link);
	}

	updateProfileQuery += ' WHERE user = ?';
	updateProfileParams.push(currentUser);

	await executeQuery(updateProfileQuery, updateProfileParams);

	// Si el nombre de usuario ha cambiado, actualizar otras tablas
	if (currentUser !== newuser) {
			const updateAlbumQuery = 'UPDATE album SET user = ? WHERE user = ?';
			await executeQuery(updateAlbumQuery, [newuser, currentUser]);

			const updatePhotoProfileQuery = 'UPDATE photoprofile SET user = ? WHERE user = ?';
			await executeQuery(updatePhotoProfileQuery, [newuser, currentUser]);
	}

	return res.json({ mensaje: 'Perfil actualizado exitosamente' });
});

// Endpoint para crear un álbum
app.post('/createalbum', async (req, res) => {
	const { user, album, name } = req.body;

	const createAlbumQuery = 'INSERT INTO album (user, album, name) VALUES (?, ?, ?)';
	await executeQuery(createAlbumQuery, [user, album, name]);

	return res.status(200).json({ mensaje: 'Álbum creado exitosamente' });
});

app.put('/editalbum/:id', async (req, res) => {
	const { id: albumId } = req.params;
	const { user, album, name } = req.body;

	const editAlbumQuery = 'UPDATE album SET album = ?, name = ? WHERE id = ? AND user = ?';
	await executeQuery(editAlbumQuery, [album, name, albumId, user]);

	return res.status(200).json({ mensaje: 'Álbum editado exitosamente' });
});

// Endpoint para ver los álbumes de un usuario específico
app.get('/justalbums/:user', async (req, res) => {
	const { user } = req.params;

	const seeAlbumQuery = 'SELECT * FROM album WHERE user = ?';
	const albums = await executeQuery(seeAlbumQuery, [user]);

	return res.json(albums);
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
