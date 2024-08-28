import { ProductoCarrito } from "./bbdd.js";

function crearElemento(tag,html,clase){
    const newElement = document.createElement(tag);
    newElement.innerHTML = html;
    newElement.classList.add(clase);

    return newElement;
}
//Convierte un array a otro array de ProductosCarrito
export function convertirAProductoCarrito(listaProductos) {
    return listaProductos.map(prod => new ProductoCarrito(prod.producto, prod.cantidad));
}

//Extraer datos de bbdd.json 
async function  extraerDatosJSON(){
    try{
        const response = await fetch('./js/bbdd.json');
        const data = await response.json(); 
        return data.productos;
    }catch(err){
        console.error(err);
    }   
}

//Funciones de Galeria.html
function cargarGaleria(lista,carrito){
    const galeria = document.querySelector(".galeria");
    //limpiamos galeria 
    galeria.innerHTML= '';
    lista.forEach( elemento => {
        const newFigure = crearElemento("figure",
            ` <img src="${elemento.img}">
            <div class="info">
                <p  class="nombre">${elemento.nombre}</p>
                <p  class="precio"> $${elemento.precio}</p>
                <button  class="agregar" data-id= ${elemento.id}>
                Agregar al carrito</button>
            </div>`,
            "figureGalery");
        galeria.appendChild(newFigure);

        //agregamos un evento a cada boton agregar del articulo
        const agregarButton = newFigure.querySelector(".agregar");
        agregarButton.addEventListener("click",()=>{
            agregarAlCarrito(elemento,carrito);
            //agregamos el carrito al localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
        })

    })
}
function agregarAlCarrito(producto, carrito) {
    const productoExistente = carrito.find(item => item.producto.id === producto.id);
    if (productoExistente) {
        productoExistente.incrementarCantidad();
    } else {
        carrito.push(new ProductoCarrito(producto,1));
    }
}
export async function JsonAGaleria(carrito,filtro){
    const lista =  await extraerDatosJSON();
    if(!filtro){
        cargarGaleria(lista,carrito);
    }else{
        const listaBuscada = lista.filter(prod => prod.seccion === filtro);
        cargarGaleria(listaBuscada,carrito);
    }
}

//Funciones de Carrito.html
export function cargarCarrito(carrito){
    localStorage.setItem('carrito',JSON.stringify(carrito));
    cargarProductosCarrito(carrito);
    cargarBotonesEliminar(carrito);
    cargarInfoCarrito(carrito);
    if(carrito.length < 1){
        esconderCarrito();
    }     
}
function cargarProductosCarrito(lista){
    //pasamos el localStorage a carritoRecuperado
    const carritoRecuperado = convertirAProductoCarrito(lista);
    const carrito = document.querySelector(".carrito_productos");
    carrito.innerHTML= '';
    carritoRecuperado.forEach(elemento => {
        const newProducto =  crearElemento("div",
                `
                    <div class="imagen-producto"> 
                        <img src="${elemento.producto.img}">
                    </div>
                    <div class="datos-producto">  
                        ${elemento.mostrarInfo()}
                    </div>
                    <img src="css/iconos/basura.svg" class="boton-eliminar" data-index = ${elemento.producto.id}>
            `     ,
            "producto");
        carrito.appendChild(newProducto);
    })
}
function cargarBotonesEliminar(carrito){
    const botones = document.querySelectorAll(".boton-eliminar");
    botones.forEach(boton => {
        boton.addEventListener("click",()=> {
            const idSolicitado = parseInt(boton.getAttribute("data-index"));
            const prodSolicitado = carrito.find(prod => prod.producto.id === idSolicitado);

            if(prodSolicitado.cantidad > 1){
                prodSolicitado.cantidad--;
                cargarCarrito(carrito);
            }else{
                const nuevoCarrito = carrito.filter(prod => prod.producto.id != idSolicitado );
                cargarCarrito(nuevoCarrito);   
            }       
        })
    })
}
export function esconderCarrito(){
    const mensaje = document.querySelector(".mensaje-carrito");
    const postcarrito = document.querySelector(".post-carrito");
    mensaje.classList.toggle("esconder");
    postcarrito.classList.toggle("esconder");
}
function cargarInfoCarrito(carrito){
    const divInfo = document.querySelector(".carrito_info");
    // limpiamos informacion
    divInfo.innerHTML= '';
    const cantidad = crearElemento("div", `<h3>Cantidad de prod.: </h3> <p>${totalProdCarrito(carrito)}</p>`, "total");
    const total = crearElemento("div",` <h3>Total: </h3> <p>$${totalCarrito(carrito)}</p> `, "cantidad");
    divInfo.append(cantidad,total);
}
function totalProdCarrito(carrito) {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
}
export function totalCarrito(carrito) {
    return carrito.reduce((total, producto) => total + producto.obtenerPrecioTotal(), 0);
}