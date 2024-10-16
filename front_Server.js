import express from 'express';
import { config } from 'dotenv'; // Cargar dotenv antes de usar process.env
import path from 'path';
import { fileURLToPath } from 'url'; 
import cors from 'cors'

// Cargar variables de entorno
config(); // Asegúrate de que esté ejecutándose correctamente

// Obtener las variables de entorno


// Convierte `import.meta.url` a la ruta absoluta del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtén el directorio actual del archivo
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000; 

app.use(cors())

// Servir archivos estáticos desde la carpeta "public" dentro del "frontend"
app.use(express.static(path.join(__dirname, "./public"))); 

// Agregar en el archivo donde tienes tu servidor Express
app.get('/config', (req, res) => {
    res.json({
      BACKEND: process.env.BACKEND,
      MERCADO_PAGO_PUBLIC_KEY: process.env.MERCADO_PAGO_PUBLIC_KEY,
      PAYMENT:process.env.PAYMENT

    });
  });
  
// Escuchar en el puerto especificado
app.listen(port, () => {
  // Esto debería imprimir la variable de entorno BACKEND
  console.log(`Servidor del frontend escuchando en http://localhost:${port}`);
});