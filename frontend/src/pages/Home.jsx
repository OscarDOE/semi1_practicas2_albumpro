import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Establece la altura de la caja al 100% del viewport
      }}
    >
      <Paper elevation={3} sx={{ padding: '20px' }}>
        <Typography variant="h3" gutterBottom>Bienvenido</Typography>
      </Paper>
      <Box mt={2}>
        <img
          src="https://myfujifilm.es/ips-repositories/operator/27936515/products/include/details/photobooks_upselling_fffr/img/format_carre.jpg"
          style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 50px)' }} // Ajusta el tamaño de la imagen
        />
      </Box>
    </Box>
  );
}

export default Home;
