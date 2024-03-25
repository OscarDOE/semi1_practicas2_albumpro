import React, { useState, useEffect } from "react";
import { Alert, Grid, Paper, TextField, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ShowPhotos = () => {
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
    const [albums, setAlbums] = useState([]);
    const [albumsdos, setAlbumsDos] = useState([]);

    useEffect(() => {getPhotos()}, [] );

    const getPhotos = async (e) => {

        const data = {
            user:usuario_logeado?.id
        };

        const endpoint = await fetch(`${ruta_AWS}/albums`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Indica que estás enviando datos en formato JSON
            },
            body: JSON.stringify(data) // Convierte el objeto a JSON
        });

        const resp = await endpoint.json();
        console.log(resp);
        if (endpoint.status === 400) {
            setError(resp.mensaje);
        } else {
            setAlbums(resp[0])
            setAlbumsDos(resp[1])
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
                        <h1>Fotos</h1>
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

            <div style={{ maxWidth: "85%", margin: "0 auto" }}>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    rowSpacing={1}
                    style={{ marginTop: "20px" }}
                >
                    {/* Mostrar los álbumes y las fotos */}

                    <Grid item>
                        <Item>
                            <h2>Perfil</h2>
                            <Grid container justifyContent="center" spacing={2}>
                                {/* Mostrar cada foto dentro del álbum */}
                                {albumsdos.map((foto) => (
                                    <Grid xs={2}  item>
                                        <Item>
                                            <img
                                                src={foto.url}
                                                style={{ width: "100%" }}
                                            />
                                        </Item>
                                    </Grid>
                                ))}
                            </Grid>
                        </Item>
                    </Grid>



                    {albums.map((album) => (
                        <Grid item>
                            <Item>
                                <h2>{album.nombre}</h2>
                                <Grid container justifyContent="center" spacing={2}>
                                    {/* Mostrar cada foto dentro del álbum */}
                                    {album.fotos.map((foto) => (
                                        <Grid xs={2} item>
                                            <Item>
                                                <img
                                                    src={foto.url}
                                                    style={{ width: "100%"  }}
                                                />
                                            </Item>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Item>
                        </Grid>
                    ))}

                   

                </Grid>
            </div>

            {error && <Alert severity="error">{error}</Alert>}
        </Box>
    );
};

export default ShowPhotos;
