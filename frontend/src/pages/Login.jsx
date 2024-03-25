import React, { useRef, useState } from 'react';
import { Alert, Button, FormControl, Grid, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Login = () => {
    const ruta_AWS = 'http://localhost:8000';
    const [error, setError] = useState(null);
    const [user, setUser] = useState({
        usuario: '',
        password: ''
    });

    const navigate = useNavigate();
    const cookies = new Cookies();

    const handleNavigate = () => {
        navigate('/profile')
    //     const usuario_logeado = cookies.get('session');
    //     if (usuario_logeado.usuario_logeado.user_type === '0') {
    //         navigate('/inicioAdmin');
    //     } else if (usuario_logeado.usuario_logeado.user_type === '1') {
    //         navigate('/inicioRecep');
    //     } else if (usuario_logeado.usuario_logeado.user_type === '2') {
    //         navigate('/inicio');
    //     }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            user: user.usuario,
            password: user.password
        };

        const endpoint = await fetch(`${ruta_AWS}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Indica que estás enviando datos en formato JSON
            },
            body: JSON.stringify(data) // Convierte el objeto a JSON
        });

        const resp = await endpoint.json();
        if (endpoint.status === 400) {
            setError(resp.message);
        } else {
            setError(null);
            cookies.set('session', resp);
            console.log("REsP , ", resp)
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
                                <img src="https://bit.ly/31pHqJb" alt="" />
                            </div>
                                
                            </Grid>
                            <Grid item>
                                <div className="header">Ingresa tus datos</div>
                            </Grid>
                            <Grid item>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Username"
                                        variant="outlined"
                                        onChange={(e) => setUser({ ...user, usuario: e.target.value })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl fullWidth>
                                    <TextField
                                        type="password"
                                        label="Password"
                                        variant="outlined"
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Login
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

export default Login;