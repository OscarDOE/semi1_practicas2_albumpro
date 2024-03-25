import React, { useState } from "react";
import {
  Alert,
  Grid,
  Paper,
  TextField,
  FormControl,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditProfile = () => {
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

  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    nombre: "",
    usuario: "",
    foto_perfil: null,
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", usuario_logeado?.id);
    formData.append("name", user.nombre);
    formData.append("photo", user.foto_perfil);
    formData.append("password", user.password);
    formData.append("newuser", user.usuario);

    const endpoint = await fetch(`${ruta_AWS}/editprofile`, {
      method: "POST",
      body: formData,
    });

    const resp = await endpoint.json();
    console.log("RESPUESTA DE " ,resp)
    console.log("sattus", endpoint.status)
    if (endpoint.status === 400 || endpoint.status === 500 || endpoint.status === 422) {
      setError(resp.mensaje);
    } else{

      cookies.remove("session");
      cookies.set('session', resp);
      cookies.update()
      alert(resp.mensaje)
      setError(null);
    }
  };

  const volverPerfil = () => {
    navigate("/profile");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: "20px" }}
        >
          <Grid item xs={6}>
            <Item>
              <h1>Editar Perfil</h1>
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
            <Item>
              <img
                src={usuario_logeado?.photo}
                alt="Foto de perfil"
                style={{ width: "100%", height: "auto" }}
              />
            </Item>
            <Paper elevation={3} style={{ padding: 20 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setUser({ ...user, foto_perfil: e.target.files[0] })
                }
              />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} style={{ padding: 20 }}>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label={"Nombre: " + usuario_logeado?.name}
                  variant="outlined"
                  name="nombre"
                  onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                  sx={{ marginBottom: "10px" }}
                />
                <TextField
                  fullWidth
                  label={"Usuario: " + usuario_logeado?.user}
                  variant="outlined"
                  name="usuario"
                  onChange={(e) =>
                    setUser({ ...user, usuario: e.target.value })
                  }
                  sx={{ marginBottom: "10px" }}
                />
                <TextField
                  fullWidth
                  label="Confirmar password"
                  variant="outlined"
                  name="password"
                  type="password"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  sx={{ marginBottom: "10px" }}
                />
                <br></br>
                <br></br>
                <center>
                  <Button type="submit" variant="contained" color="primary">
                    Guardar cambios
                  </Button>
                </center>
              </FormControl>
            </Paper>
          </Grid>
        </Grid>
      </form>
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

export default EditProfile;
