

import { iconCart, actualizarOverlay, actualizarValorTotal, overlay } from "./ActualizarOverlay.js"; 
import { productosActualizados } from "./ActivarBotones.js";
import { botonReactivado } from './ReactivarBoton.js'; 
import { BACKEND } from "./Variables.js";



export function eliminarProducto() {
  let eliminarBoton = document.querySelectorAll('.eliminar__boton'); 

  eliminarBoton.forEach(botonEliminar => {
    botonEliminar.addEventListener('click', async (e) => { 
      e.stopPropagation();

      let idProducto = parseInt(botonEliminar.dataset.id);
      let producto = productosActualizados.find(p => p.id === idProducto); 
    
      if (producto) {
        // Disminuir cantidad o eliminar producto
        if (producto.cantidad > 1) {
          producto.cantidad--;
          producto.stock++;  
        } else {
          productosActualizados.splice(productosActualizados.findIndex(p => p.id === idProducto), 1); 
          botonReactivado(idProducto); 
          overlay.style.minHeight = '40%';
        }

        // Actualizar en el backend
        try {
          await fetch(`${BACKEND}/carrito/productos/${idProducto}`, {
            method: producto.stock > 0 ? "PUT" : "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cantidad: producto.cantidad,
              stock: producto.stock
            })
          });
        } catch (err) {
          console.log("Error al recibir la respuesta del backend:", err.message);
        }

        // Actualizar el ícono del carrito
       
        iconCart.innerHTML = productosActualizados.reduce((total, p) => total + p.cantidad, 0);
        
        if (iconCart.innerHTML === 0) {
          iconCart.innerHTML = '0';  // O cualquier otro valor para el ícono vacío
        }

        // Guardar en localStorage
        localStorage.setItem('Productos-Actualizados', JSON.stringify(productosActualizados));
        
        // Actualizar la interfaz
        actualizarOverlay();
        actualizarValorTotal();
      }
    });
  });
}
