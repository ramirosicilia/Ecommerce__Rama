const express = require("express");
const path = require("path");
const fs = require("fs").promises; // Usamos la versión de promesas de fs
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const port = 3000;

app.use(cors({
    origin: "http://localhost:5000"
}));

const PATH_FILE_PRODUCTOS = path.join(__dirname, "../frontend/public/js/carrito.json");
async function obtenerProductos() {
    const productos = JSON.parse(
        await fs.readFile(PATH_FILE_PRODUCTOS, "utf-8")
    );
    return productos;
}

// Función para recargar el stock de los productos a su cantidad inicial
// Recargar stock solo si algún producto lo necesita
async function recargarStock() {
    let productos = await obtenerProductos();
    let stockRecargado = false;

    productos.forEach(producto => {
        if (producto.stock === 0 && producto.stockInicial && producto.stock !== producto.stockInicial) {
            producto.stock = producto.stockInicial; // Restablecer al valor inicial
            stockRecargado = true;
        }
    });

    // Guardar solo si se hizo algún cambio
    if (stockRecargado) {
        await fs.writeFile(PATH_FILE_PRODUCTOS, JSON.stringify(productos, null, 2));
    }
}

//app.use(express.static(path.join(__dirname, "../frontend")));

// Ruta para obtener la página principal

// Obtener todos los productos
app.get("/carrito/productos", async (req, res) => {
    try {
        await recargarStock(); // Recargar stock antes de enviar los productos
        const productos = await obtenerProductos();
        res.json(productos);
    } catch (error) {
        console.error("Error al leer los productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// Agregar producto al carrito
app.post("/carrito/productos", async (req, res) => {
    try {
        const { id, cantidad, stock } = req.body;

        let productos = await obtenerProductos();
        const productoExistente = productos.find(p => p.id === id);

        if (!productoExistente) {
            // Almacenar también el valor inicial del stock
            const nuevoProducto = { id, cantidad, stock, stockInicial: stock };
            productos.push(nuevoProducto);

            await fs.writeFile(PATH_FILE_PRODUCTOS, JSON.stringify(productos, null, 2));

            res.status(201).json({ mensaje: "Producto agregado correctamente", producto: nuevoProducto });
        } else {
            res.status(400).json({ error: "El producto ya existe" });
        }
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

// Actualizar un producto existente en el carrito
app.put("/carrito/productos/:id", async (req, res) => {
    try {
        const idProducto = parseInt(req.params.id);
        const { cantidad, stock } = req.body;

        let productos = await obtenerProductos();
        const producto = productos.find(p => p.id === idProducto);

        if (producto) {
            producto.cantidad = cantidad;
            producto.stock = stock;

            // Guardar los productos actualizados en el archivo JSON
            await fs.writeFile(PATH_FILE_PRODUCTOS, JSON.stringify(productos, null, 2));

            res.json({ mensaje: "Producto actualizado correctamente", producto });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

// Eliminar un producto del carrito (solo si el usuario explícitamente desea eliminarlo)
app.delete("/carrito/productos/:id", async (req, res) => {
    try {
        const idProducto = parseInt(req.params.id);
        let productos = await obtenerProductos();
        const indiceProducto = productos.findIndex(p => p.id === idProducto);

        if (indiceProducto !== -1) {
            // Aquí eliminamos el producto solo si el usuario explícitamente lo quiere fuera del carrito
            productos.splice(indiceProducto, 1);

            await fs.writeFile(PATH_FILE_PRODUCTOS, JSON.stringify(productos, null, 2));

            res.json({ mensaje: "Producto eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

app.listen(port, () => {
    console.log(`Se está escuchando en el puerto: ${port}`);
});
