// server.js
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const app = express();



// Conectar a la base de datos
connectDB();

app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

//servir archivos estaticos desde la carpeta public
app.use(express.static('public'));


// Definir rutas
app.use('/api/restaurantes', require('./routes/restaurantes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
