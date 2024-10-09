
const express = require("express");
const path = require("path");

const app = express();
const port = 5000;

// Servir archivos estáticos desde la carpeta "public" dentro del "frontend"
app.use(express.static(path.join(__dirname, "../public")));

// Ruta para servir el archivo HTML principal (index.html)
const pathFile = path.join(__dirname, "../public/index.html");
console.log(pathFile);
/* app.get('/', (req, res) => {
    res.sendFile(pathFile);
}); */

// Escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor del frontend escuchando en http://localhost:${port}`);
});
