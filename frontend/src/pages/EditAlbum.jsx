import React, { useState, useEffect } from "react";
import {
  Alert,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditAlbum = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const ruta_AWS = "http://localhost:8000";
  const navigate = useNavigate();
  const cookies = new Cookies();
  const usuario_logeado = cookies.get("session");

  const [delAlbum, setDelAlbum] = useState(null);
  const [modAlbum, setModAlbum] = useState(null);
  const [newAlbum, setNewAlbum] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    nombre: "",
    usuario: "",
    foto_perfil: null,
  });

  useEffect(() => {
    getAlbums();
  }, []);

  const albumes = [
    { title: "Vacaciones 2022", id: 1 },
    { title: "Fotos de familia", id: 2 },
    { title: "Viaje a Europa", id: 3 },
    { title: "Fotos de naturaleza", id: 4 },
    { title: "Fotos de boda", id: 5 },
  ];

  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const formData = new FormData();
  //     formData.append('nombre', user.nombre);
  //     formData.append('usuario', user.usuario);
  //     formData.append('foto_perfil', user.foto_perfil);

  //     const endpoint = await fetch(`${ruta_AWS}/api/users/registro`, {
  //         method: 'POST',
  //         body: formData
  //     });

  //     const resp = await endpoint.json();
  //     if (endpoint.status === 400) {
  //         setError(resp.message);
  //     } else {
  //         setError(null);
  //     }
  // };

  const getAlbums = async (e) => {
    const data = {
      user: usuario_logeado?.id,
    };

    const endpoint = await fetch(`${ruta_AWS}/justalbums`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resp = await endpoint.json();
    console.log("resppppppppppp");
    console.log(resp);

    if (endpoint.status === 400) {
      setError(resp.message);
    } else {
      setAlbums(resp);
      setError(null);
    }
  };

  const createAlbum = async (e) => {
    e.preventDefault();
    const data = {
      id: usuario_logeado?.id,
      album: newAlbum,
    };

    const endpoint = await fetch(`${ruta_AWS}/createalbum`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indica que estás enviando datos en formato JSON
      },
      body: JSON.stringify(data), // Convierte el objeto a JSON
    });

    const resp = await endpoint.json();
    if (endpoint.status === 400) {
      setError(resp.message);
    } else {
      alert(resp.mensaje);
      setError(null);
      getAlbums();
    }
  };

  const deleteAlbum = async (e) => {
    const data = {
      user: delAlbum,
    };

    const endpoint = await fetch(`${ruta_AWS}/deletealbum`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resp = await endpoint.json();
    console.log("resppppppppppp");
    console.log(resp);

    if (endpoint.status === 400) {
      setError(resp.mensaje);
    } else {
      alert(resp.mensaje);
      getAlbums();
      setError(null);
    }
  };

  const modifyAlbum = async (e) => {
    e.preventDefault();

    const data = {
      id: usuario_logeado?.id,
      id_album: modAlbum,
      newalbum: user.nombre,
    };

    const endpoint = await fetch(`${ruta_AWS}/editalbum`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resp = await endpoint.json();
    if (endpoint.status === 400) {
      setError(resp.mensaje);
    } else {
    alert(resp.mensaje);
      getAlbums();
      setError(null);
    }
  };

  const volverPerfil = () => {
    navigate("/profile");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "20px" }}
      >
        <Grid item xs={6}>
          <Item>
            <h1>Editar Album</h1>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <Button onClick={volverPerfil} variant="contained">
              <ArrowBackIcon />
              Volver
            </Button>
          </Item>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "20px" }}
      >
        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <center>
              <h3>Nuevo album</h3>
            </center>
            <TextField
              fullWidth
              label="Nombre"
              id="nombre"
              name="nombre"
              onChange={(e) => setNewAlbum(e.target.value)}
              sx={{ marginBottom: "10px" }}
            />
            <center>
              <Button onClick={createAlbum} variant="contained" color="success">
                Crear
              </Button>
            </center>
          </Paper>

          <Paper elevation={3} style={{ padding: 20 }}>
            <center>
              <h3>Eliminar Album</h3>
            </center>
            <Autocomplete
              fullWidth
              options={albums}
              getOptionLabel={(option) => option.title}
              onChange={(event, newValue) => setDelAlbum(newValue?.id)}
              renderInput={(params) => <TextField {...params} label="Album" />}
              sx={{ marginBottom: "10px" }}
            />
            <center>
              <Button onClick={deleteAlbum} variant="contained" color="error">
                Eliminar
              </Button>
            </center>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <center>
              <h3>Modificar Album</h3>
            </center>
            <Autocomplete
              fullWidth
              options={albums}
              getOptionLabel={(option) => option.title}
              onChange={(event, newValue) => setModAlbum(newValue?.id)}
              renderInput={(params) => <TextField {...params} label="Album" />}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="Nuevo Nombre"
              id="nombre"
              name="nombre"
              onChange={(e) => setUser({ ...user, nombre: e.target.value })}
              sx={{ marginBottom: "10px" }}
            />
            <center>
              <Button onClick={modifyAlbum} variant="contained" color="primary">
                Guardar cambios
              </Button>
            </center>
          </Paper>
        </Grid>
      </Grid>
      {error ? (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      ) : (
        ""
      )}
    </Box>
  );
};

export default EditAlbum;
