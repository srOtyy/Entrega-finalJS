import { convertirAproductoStorage,JsonAGaleria } from "./funciones.js";
import { Toast } from "./bbdd.js";
document.addEventListener('DOMContentLoaded', () => {
    
    //Creamos el array de carrito
    let carrito = []
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'));
        carrito = convertirAproductoStorage(carrito);

    }
    JsonAGaleria(carrito);


    const figures = document.querySelectorAll(".contenidoFigure");
    figures.forEach(figure =>{
        figure.addEventListener("click", ()=>{
            JsonAGaleria(carrito,figure.getAttribute("data-seccion"));
        })
    } )
    

    const contenedorGaleria = document.querySelector(".galeria");
    contenedorGaleria.addEventListener("click",(e)=>{
        const boton = e.target;
        if(boton.classList.contains("agregar")){
            Toast.fire({
                    icon: "success",
                    title: "Agregado al carrito",
              });
        }
    })


})


