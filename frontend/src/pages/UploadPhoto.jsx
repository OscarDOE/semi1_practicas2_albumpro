import React, { useState, useEffect } from 'react';
import { Alert, Grid, Paper, TextField, Button, Box, Autocomplete } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const UploadPhoto = () => {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));



    const ruta_AWS = 'http://localhost:8000';
    const navigate = useNavigate();
    const cookies = new Cookies();
    const usuario_logeado = cookies.get('session');

    useEffect(() => {getAlbums()}, [] );

    const albumes = [
        { title: 'Vacaciones 2022', id: 1 },
        { title: 'Fotos de familia', id: 2 },
        { title: 'Viaje a Europa', id: 3 },
        { title: 'Fotos de naturaleza', id: 4 },
        { title: 'Fotos de boda', id: 5 },
    ];
    


    const [albumelegido, setAlbumelegido] = useState(null);
    const [error, setError] = useState(null);
    const [albums, setAlbums] = useState(null);
    const [fotoinfo, setFotoinfo] = useState({
        nombre: '',
        album: '',
        foto: null
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', fotoinfo.nombre);
        formData.append('album', albumelegido);
        formData.append('photo', fotoinfo.foto);
        formData.append('id', usuario_logeado?.id);

        const endpoint = await fetch(`${ruta_AWS}/upload`, {
            method: 'POST',
            body: formData
        });

        const resp = await endpoint.json();
        if (endpoint.status === 400) {
            setError(resp.mensaje);
        } else {
            alert(resp.mensaje)
            setError(null);
        }
    };

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
        console.log(resp);
    
        if (endpoint.status === 400) {
          setError(resp.message);
        } else {
          setAlbums(resp);
          setError(null);
        }
      };



    const volverPerfil = () => {
        navigate("/profile");
    }



    return (
        <Box sx={{ flexGrow: 1 }}>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
                    <Grid item xs={6}>
                        <Item >
                            <h1>Subir Foto</h1>
                        </Item>
                    </Grid>
                    <Grid item xs={2}>
                        <Item>
                            <Button onClick={volverPerfil} variant="contained"><ArrowBackIcon />
                                Volver
                            </Button>

                        </Item>

                    </Grid>


                </Grid>

                <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
                    <Grid item xs={4}>
                        <Item >

                            <img src={usuario_logeado?.photo} alt="Foto" style={{ width: '100%', height: 'auto' }} />

                        </Item>

                        <Paper elevation={3} style={{ padding: 20 }}>
                            <input type="file" accept="image/*" onChange={(e) => setFotoinfo({ ...fotoinfo, foto: e.target.files[0] })} />
                        </Paper>

                    </Grid>
                    <Grid item xs={4} >
                        <Paper elevation={3} style={{ padding: 20 }}>
                            <TextField
                                fullWidth
                                label="Nombre de la foto"
                                id="nombre"
                                name="nombre"
                                onChange={(e) => setFotoinfo({ ...fotoinfo, nombre: e.target.value })}
                                sx={{ marginBottom: '10px' }}
                            />
                            <Autocomplete
                            fullWidth
                            options={albums}
                            getOptionLabel={(option) => option.title}
                            onChange={(event, newValue) => setAlbumelegido(newValue?.id)}
                            renderInput={(params) => <TextField {...params} label="Album" />}
                            sx={{ marginBottom: "10px" }}
                            />
                            <center>

                            <Button type="submit" variant="contained" color="success">
                                Subir Foto
                            </Button>

                            </center>
                        </Paper>
                    </Grid>
                </Grid>
            </form>
            {error ? <Alert variant="filled" severity="error">{error}</Alert> : ''}
        </Box>
    );
};

export default UploadPhoto;
