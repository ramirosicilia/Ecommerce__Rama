

import { actualizarValorTotal } from "./ActualizarOverlay.js"; 
import { activarBoton } from './ActivarBotones.js'; 


let carrito = document.getElementById('carrito__compras');

export let datos

function crearBotones() {
    let boton = document.createElement('button');
    boton.innerHTML = 'Agregar';
    boton.classList.add('botones__agregar');
    return boton;
}

 async function crearCarrito() {

   try{ 

    const response= await fetch('http://localhost:3000/carrito/productos',{
        method:'GET',
        headers:{
         "Content-Type":"application/json"
        }

    })  

    if (!response.ok) {
        throw new Error('Error en la petición: ' + response.status);
    }

       datos= await response.json() 


    let carrito = document.getElementById('carrito-compras');
    let botones;

    for (let i = 0; i < datos.length; i++) {
        const contenedorDiv = document.createElement('div');
        contenedorDiv.classList.add('tarjeta');
        let color = document.createElement('p');
        let precio = document.createElement('p');

        contenedorDiv.innerHTML += `
            <h2 class="titulo__tarjeta">${datos[i].nombre}</h2>
            <img class="imagenes__tarjeta" src="${datos[i].imagen}" alt="">
        `;
        color.textContent = 'Color: ' + datos[i].color;
        precio.textContent = '$' + datos[i].precio;
        color.classList.add('color__tarjeta');
        precio.classList.add('precio');
        
        botones = crearBotones();
        botones.dataset.id = datos[i].id;
        contenedorDiv.appendChild(color);
        contenedorDiv.appendChild(precio);
        contenedorDiv.appendChild(botones);
        
        carrito.append(contenedorDiv);
    }  

    
    console.log(datos)

   
    actualizarValorTotal(); 
    activarBoton()

   } 

   catch(err){ 
    console.log("error al recibir la respuesta del backend",err.message)
 
   } 

}




document.addEventListener("DOMContentLoaded", async () => {
    await crearCarrito();
}); 

