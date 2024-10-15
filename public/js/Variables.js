 export let BACKEND='http://localhost:3000' 
 export let MERCADO_PAGO_PUBLIC_KEY='' 
  export let PAYMENT='http://localhost:2000' 
 
 async function endPpoint() { 

   const response= await fetch("/config") 

   if(!response.ok){
    console.log('hubo error al recibir')
   } 
   else{ 

   let data= await response.json()  
   BACKEND=data.BACKEND 
   MERCADO_PAGO_PUBLIC_KEY=data.MERCADO_PAGO_PUBLIC_KEY 
   PAYMENT=data.PAYMENT

   }
    
} 

await endPpoint()