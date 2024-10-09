import {  actualizarValorTotal,iconCart } from "./ActualizarOverlay.js"; 
import { actualizarOverlay } from "./ActualizarOverlay.js";
import {actualizarBoton} from "./ActualizarBoton.js" 


export let productosActualizados = localStorage.getItem('Productos-Actualizados') ? JSON.parse(localStorage.getItem('Productos-Actualizados')) : []; 
 let carritoID = []; 

   async function obtenerID(){ 

    try{ 
       let response= await fetch(`http://localhost:3000/carrito/productos`,{
        method:'GET',
        headers:{
          "Content-Type":"application/json"
        }
       }) 

       let data=await response.json()  

       carritoID=data

      
    } 

    catch(err){
      console.log(`no se obtuvieron los productos`,err.message)
    }

   } 






export async function activarBoton() {  
  await obtenerID()
  let botones = document.querySelectorAll('.botones__agregar'); 


  botones.forEach((button) => {
    // Eliminar event listeners anteriores
    button.removeEventListener('click', botonesActivados);
    
    // Agregar nuevo event listener
    button.addEventListener('click', botonesActivados);
  });
}

async function botonesActivados(e) {  
  let botonClickeado = Number(e.target.dataset.id);
  let productoSeleccionado = carritoID.find(elemento => elemento.id == botonClickeado); 
  let productoExistente = productosActualizados.find(el => el.id === botonClickeado); 

  if (productoSeleccionado && productoSeleccionado.stock > 0) { 
      if (productoExistente) { 
          // Solo permitir incrementar si no se supera el stock inicial
          if (productoExistente.cantidad < 10000 && productoSeleccionado.stock > 0) {
              productoExistente.cantidad++;
              productoSeleccionado.stock--; 
              productoExistente.stock = productoSeleccionado.stock; 
          }
      } else {
          // Si no existe en el carrito, añadirlo y reducir el stock
          productosActualizados.push({ ...productoSeleccionado, cantidad: 1 });
          productoSeleccionado.stock--; 
      }

      // Actualizamos el stock en el backend
      try {
          let response = await fetch(`http://localhost:3000/carrito/productos/${productoSeleccionado.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  cantidad: productoExistente ? productoExistente.cantidad : 1,
                  stock: productoSeleccionado.stock
              })
          });
          if (!response.ok) throw new Error("No se pudo actualizar el producto.");
      } catch (err) {
          console.error("Error al actualizar el producto en el backend", err.message);
      }

      // Actualizamos el localStorage y la UI
      localStorage.setItem('Productos-Actualizados', JSON.stringify(productosActualizados));
      actualizarValorTotal();
      actualizarOverlay();

      if (productoSeleccionado.stock === 0) { 
          actualizarBoton(productoSeleccionado);
      }
  }
}
window.addEventListener('load', () => {
  if (localStorage.getItem('Productos-Actualizados')) {
    let productos = JSON.parse(localStorage.getItem('Productos-Actualizados'));

    productos.forEach(producto => {
      if (producto.stock === 0 && producto.stockInicial) {
        producto.stock = producto.stockInicial; // Restablecer el stock
      }
    });

    // Guardar el estado actualizado en localStorage
    localStorage.setItem('Productos-Actualizados', JSON.stringify(productos));
  }
});
