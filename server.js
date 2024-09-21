const express = require('express');
const connectDB = require('./db');
const path = require('path');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Servir archivos estáticos de la carpeta "public"
app.use(express.static('public'));

// Rutas
app.use('/api/restaurantes', require('./routes/restaurantes')); // Importa las rutas desde el archivo de rutas

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
