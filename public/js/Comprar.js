import { productosActualizados } from './ActivarBotones.js'; 
import { MERCADO_PAGO_PUBLIC_KEY,PAYMENT} from "./Variables.js";


const comprar = document.getElementById('comprar');
const mp = new MercadoPago(MERCADO_PAGO_PUBLIC_KEY, {
    locale: "es-AR"
});


// Variable para verificar si el botón ya ha sido creado
let isButtonInitialized = false;

// Define la función antes de ser utilizada
const handleClickBtnComprar= async (e) => {  

    e.stopPropagation()


    comprar.style.opacity='0'
    try {
        await postProduct(productosActualizados);
    } catch (error) {
        console.error("error->", error);
    }
}; 

const postProduct = async (productos) => { 


    try {
        // Convertir los productos a un formato adecuado para Mercado Pago
        const items = productos.map(producto => ({
            id: producto.id,
            name: producto.nombre,
            quantity: producto.cantidad,
            unit_price: producto.precio,
            imagen: producto.imagen  // Añadir la propiedad de imagen
        })); 

        
           // Añadir la propiedad de imagen
        ;

        

        // Enviar los productos al servidor para crear la preferencia
        const response = await fetch(`${PAYMENT}/create_preference`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items })
        });

        const data = await response.json();

        // Inicializar el botón solo si no ha sido creado
        if (!isButtonInitialized) {
            initializeMercadoPagoButton(data.id);
            isButtonInitialized = true; // Actualizar el estado a verdadero
        }
    } catch (error) {
        console.error("Error al crear la preferencia de pago ->", error);
    }
};

const initializeMercadoPagoButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();
    const renderButton = async () => {  
        if (window.initializeMercadoPagoButton) window.initializeMercadoPagoButton.unmount();
        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
        });
    };
    renderButton();
};

// Añade el event listener al botón "comprar"
comprar.addEventListener('click', handleClickBtnComprar);
