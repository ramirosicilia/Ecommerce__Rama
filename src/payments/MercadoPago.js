const express=require("express") 
const cors=require("cors")  
const morgan=require("morgan") 
require('dotenv').config();


// SDK de Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Agrega credenciales
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN, 
    options: { timeout: 40000 }
});



const app = express() 
app.use(morgan("short"))
const port = 2000

app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {

    res.send('soy el server')
})

const preference = new Preference(client)

app.get("/receive_payment", async (req, res) => {
    try {
      const query_params = req.query;
      res.status(200).json({ query_params });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


app.post('/create_preference', async (req, res) => {
    try {
        const { items } = req.body;

        // Crear la preferencia de pago usando los productos
        const body = {
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                picture_url: `http://localhost:2000/create_preference${item.imagen}`  // Añadir la URL completa de la imagen desde localhost

            })),  
            notification_url: "http://localhost:2000/receive_payment",
            back_urls: {
                success:"https://personaldegastronomia.com/",
                failure:"https://personaldegastronomia.com/",
                pending:"https://personaldegastronomia.com/",
            },
            auto_return: "approved"
        };

        const result = await preference.create({ body });
        res.json({
            id: result.id
        });

    } catch (error) {
        console.log("Error al crear la preferencia", error);
        res.status(500).json({ error: error.message });
    }
});



app.listen(port, () => {

    console.log(`estoy escuchando el puerto ${port}`)

})








