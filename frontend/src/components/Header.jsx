import React, { useContext, useState } from 'react'
import '../styles/sHeader.css'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useHistory } from 'react-router-dom';
import Cookies from "universal-cookie";
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';



const Header = () => {


    const cookies = new Cookies();
    const usuario_logeado = cookies.get('session');
    const navigate = useNavigate();
    const handleLogOut = () => {
        navigate("/");
        cookies.remove('session')
    };
    //console.log(usuario_logeado)

    return (

        <header>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        {/* {
                            usuario_logeado ? <Link to='/inicio'><IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                background="black"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton></Link> : <Link to='/'><IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                background="black"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton></Link>
                        } */}
                        
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {usuario_logeado ? "" : <Link to='/'>FAUNADEX</Link> }
                        </Typography>
                        

                        {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {usuario_logeado?.usuario_logeado.user_type === "2" ? 
                            <>
                            <Link to='/solispendientes'><Button color="inherit">Solicitudes pendientes</Button></Link>
                            </> 
                            : 
                            <></>}
                            {usuario_logeado?.usuario_logeado.user_type === "1" ? 
                            <>
                            <Link to='/inicio'><Button color="inherit">Admis. vuelos</Button></Link>
                            <Link to='/inicio'><Button color="inherit">Admis. autos</Button></Link>
                            </> 
                            : 
                            <></>}
                            {usuario_logeado?.usuario_logeado.user_type === "0" ? 
                            <>
                            <Link to='/admin/users'><Button color="inherit">Admis. usuarios</Button></Link>
                            <Link to='/admin/vuelos'><Button color="inherit">Admis. vuelos</Button></Link>
                            <Link to='/admin/autos'><Button color="inherit">Admis. autos</Button></Link>
                            <Link to='/admin/historial'><Button color="inherit">Hist. vuelos</Button></Link>
                            </> 
                            : 
                            <></>}
                        </Typography> */}
    
                        {usuario_logeado ? 
                        <>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to='/profile'>FAUNADEX</Link>    
                        </Typography>
                        <Button onClick={handleLogOut} color="inherit">Log out</Button>
                        
                        </> 
                        
                        : 
                        <>
                        <Link to='/login'><Button color="inherit">Login</Button></Link>
                        <Link to='/regis'><Button color="inherit">Registro</Button></Link>
                        </>}


                        
                    </Toolbar>
                </AppBar>
            </Box>
        </header>
    )
}




export default Header