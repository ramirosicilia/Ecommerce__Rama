import { agregarProducto } from './AgregarCarrito.js';
import { eliminarProducto } from './EliminarCarrito.js'; 
import { productosActualizados } from './ActivarBotones.js'; 
export let overlayContainer = document.querySelector('.overlay__container');
export const containerTotal = document.querySelector('.container__total');
export let vaciar = document.getElementById('vaciar'); 
export let iconCart = document.getElementById('icon-cart');
export const overlay = document.getElementById('overlay'); 


export async function actualizarOverlay() {
    overlayContainer.innerHTML = ''; // Limpiar el contenido del overlay antes de añadir los productos actualizados

    if (productosActualizados.length > 0) {
        for (const producto of productosActualizados) {  
            console.log(productosActualizados)
            overlayContainer.innerHTML += `
                <div class="overlay__flex" id="producto-${producto.id}">
                    <div class="overlay__tarjeta-1 ${producto.stock === 0 ? 'active' : ''}">
                        <h2 class="imagen__nombre">${producto.nombre}</h2>
                        <img class="imagen__producto" src="${producto.imagen}" alt="">
                        <p class="imagen__precio">Precio unitario: $${producto.precio}</p>
                        <span class="stock">Stock: ${producto.stock}</span>
                    </div>
                    <div class="overlay__tarjeta-2">
                        <span class="cantidad">Cantidad: ${producto.cantidad}</span>
                        <div class="contenedor__botonera">
                            <button type="button" class=${producto.stock>0?'agregar__boton':'boton__disabled'} data-id="${producto.id}" ${producto.stock === 0 ? 'disabled' : ''}>${producto.stock<1?'Sin stock':'Agregar'}</button>
                            <button type="button" class="eliminar__boton" data-id="${producto.id}">Eliminar</button>
                        </div>
                    </div>
                </div>
            `; 
        }

        // Reagregar los event listeners después de actualizar el overlay
        localStorage.setItem("Productos-Actualizados", JSON.stringify(productosActualizados));
       

        // Reproducir música cuando se abre el overlay solo si no se está reproduciendo ya
       
        // Desplazarse a la última tarjeta añadida
       let ultimaTarjeta=productosActualizados[productosActualizados.length-1] 
       let tarjetaID=document.getElementById(`producto-${ultimaTarjeta.id}`) 
       tarjetaID.scrollIntoView({
        behavior:'smooth',
        block:'center'
       })
       agregarProducto();
       eliminarProducto();
    } 
     else {
        overlayContainer.innerHTML = 'Carrito vacío ☹️'; 
        containerTotal.style.display = 'none';
    }

    overlay.classList.add('active');
}


export function actualizarValorTotal() {
    let total = productosActualizados.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    document.querySelector('.valor__total').textContent = `Valor total: $${total}`; 
    return total;
}

document.getElementById('icon-overlay').addEventListener('click', () => {
    overlay.classList.remove('active');
    // Detener la música cuando se cierra el overlay
  
});