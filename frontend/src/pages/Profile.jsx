import React, { useState } from 'react';
import { Alert, Grid, Paper, TextField, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Profile = () => {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));



    const ruta_AWS = '';
    const navigate = useNavigate();
    const cookies = new Cookies();
    const usuario_logeado = cookies.get('session');



    const [error, setError] = useState(null);
    const [user, setUser] = useState({
        nombre: '',
        usuario: '',
        foto_perfil: null
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre', user.nombre);
        formData.append('usuario', user.usuario);
        formData.append('foto_perfil', user.foto_perfil);

        const endpoint = await fetch(`${ruta_AWS}/`, {
            method: 'POST',
            body: formData
        });

        const resp = await endpoint.json();
        if (endpoint.status === 400) {
            setError(resp.message);
        } else {
            setError(null);
        }
    };


    const verFotos = () => {
        navigate("/fotos");
    }

    const upFotos = () => {
        navigate("/subirfoto");
    }

    const editarAlbum = () => {
        navigate("/editalbum");
    }

    const editarPerfil = () => {
        navigate("/editprofile");
    }





    return (
        <Box sx={{ flexGrow: 1 }}>

            <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
                <Grid item xs={8}>
                    <Item >
                        <h1>Perfil</h1>
                    </Item>
                </Grid>
            </Grid>

            <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
                <Grid item xs={4}>
                    <Item >

                        <img src={usuario_logeado?.photo} alt="Foto de perfil" style={{ width: '100%', height: 'auto' }} />

                    </Item>

                </Grid>
                <Grid item xs={4} >
                    <Item sx={{ '& button': { m: 2 } }}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            id="nombre"
                            name="nombre"
                            value={usuario_logeado?.name}
                            onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                            sx={{ marginBottom: '10px' }}
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Username"
                            id="usuario"
                            name="usuario"
                            value={usuario_logeado?.user}
                            onChange={(e) => setUser({ ...user, usuario: e.target.value })}
                            sx={{ marginBottom: '10px' }}
                            disabled
                        />

                    </Item>
                </Grid>
            </Grid>


            <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
                <Grid item xs={8}>
                    <Item>
                        <Button onClick={verFotos} variant="contained" sx={{ mr: 3 }}>
                            Ver Fotos
                        </Button>
                        <Button onClick={upFotos} variant="contained" sx={{ mr: 3 }}>
                            Subir Fotos
                        </Button>
                        <Button onClick={editarAlbum} variant="contained" sx={{ mr: 3 }}>
                            Editar Álbum
                        </Button>
                        <Button onClick={editarPerfil} variant="contained">
                            Editar Perfil
                        </Button>
                    </Item>

                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
