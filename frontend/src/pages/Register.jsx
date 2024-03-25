import React, { useRef, useState } from 'react';
import { Alert, Button, Checkbox, FormControlLabel, Grid, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Register = () => {
    const navigate = useNavigate();
    const ruta_AWS = 'http://localhost:8000';
    const [value, setValue] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({
        nombre: '',
        usuario: '',
        foto_perfil: null,
        password: '',
        pass_confirm: ''
    });

    const handleNavigate = () => {
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', user.nombre);
        formData.append('user', user.usuario);
        formData.append('photo', user.foto_perfil);
        formData.append('password', user.password);
        formData.append('confpass', user.pass_confirm);

        const endpoint = await fetch(`${ruta_AWS}/register`, {
            method: 'POST',
            body: formData
        });

        const resp = await endpoint.json();
        if (endpoint.status === 400) {
            setError(resp.message);
        } else {
            setError(null);
            alert('¡Registrado correctamente!');
            handleNavigate();
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Paper elevation={3} style={{ padding: 20 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <div className="avatar" style={{ textAlign: 'center' }}>
                                    <img
                                        src="https://yt3.ggpht.com/ytc/AKedOLTOxCzheuyu7Cw8Hsm1TvLlbekMeVVrE1c5zL6h=s900-c-k-c0x00ffffff-no-rj"
                                        alt=""
                                        style={{ width: '150px', height: 'auto' }}
                                    />
                                </div>
                            </Grid>
                            <Grid item>
                                <div className="header">Completa tu información</div>
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Nombre"
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Usuario"
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setUser({ ...user, usuario: e.target.value })}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    type="file"
                                    label=""
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setUser({ ...user, foto_perfil: e.target.files[0] })}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    type="password"
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    type="password"
                                    label="Confirmar Password"
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setUser({ ...user, pass_confirm: e.target.value })}
                                />
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Registrar
                                </Button>
                            </Grid>
                        </Grid>

                    </form>
                    {error ? <Alert variant="filled" severity="error">{error}</Alert> : ''}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Register;
