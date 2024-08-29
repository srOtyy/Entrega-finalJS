import { ProductoCarrito,ProductoStorage } from "./bbdd.js";

function crearElemento(tag,html,clase){
    const newElement = document.createElement(tag);
    newElement.innerHTML = html;
    newElement.classList.add(clase);

    return newElement;
}

// Convierte un array a otro array de ProductosCarrito/ProductoStorage
function convertirAProductoCarrito(lista) {
    return lista.map(prod => new ProductoCarrito(prod.producto, prod.cantidad));
}
export function convertirAproductoStorage(lista){
    const listaStorage = []
    lista.forEach(prod => {
        const productoStorageAux = new ProductoStorage(prod.id);
        productoStorageAux.asignarCantidad(prod.cantidad);
        listaStorage.push(productoStorageAux);
    })
    console.log(listaStorage)
    return listaStorage;

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

//Funciones de articulos.html
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

    })
    agregarEventosBotonAgregar(carrito)

}
function agregarEventosBotonAgregar(carrito){
    const botones = document.querySelectorAll(".agregar");
    botones.forEach(boton => {
        boton.addEventListener("click",()=>{
            agregarAlCarrito( parseInt(boton.getAttribute("data-id")) ,carrito)
        })
    })  
}
function agregarAlCarrito(idProducto, carrito) {
    const productoExistente = carrito.find(item => item.id === idProducto);
    if (productoExistente) {
        productoExistente.incrementarCantidad();
    } else {
        carrito.push(new ProductoStorage(idProducto));
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));

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
export async function cargarCarrito(carritoLocalStorage){
    try{
        const bbdd = await extraerDatosJSON()
        const carrito = []
        carritoLocalStorage.forEach(producto => {
            carrito.push(new ProductoCarrito(bbdd.find(bdProd => bdProd.id === producto.id ), producto.cantidad))
        })
        cargarProdBotonInfoCarrito(carrito)
    }catch(err){
        console.log("error cargando el carrito.html" + err)
    }
    
}
export function esconderCarrito(){
    const mensaje = document.querySelector(".mensaje-carrito");
    const postcarrito = document.querySelector(".post-carrito");
    mensaje.classList.toggle("esconder");
    postcarrito.classList.toggle("esconder");
}
function cargarProdBotonInfoCarrito(carrito){
    // el carrito es una lista de ProductoCarrito
    cargarProductosCarrito(carrito);
    cargarBotonesEliminar(carrito);
    cargarInfoCarrito(carrito);
    if( carrito.length < 1){
        esconderCarrito();
    }  
}
function cargarProductosCarrito(lista){
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
function cargarBotonesEliminar(){
    const botones = document.querySelectorAll(".boton-eliminar");
    botones.forEach(boton => {
        boton.addEventListener("click",()=> {
            const idSolicitado = parseInt(boton.getAttribute("data-index"));
            editarCarritoStorage(idSolicitado)
        })
    })
}
function editarCarritoStorage(idProducto){
    const carrito = JSON.parse(localStorage.getItem('carrito'));
    const prodSolicitado = carrito.find(item => item.id === idProducto);
    
    if(prodSolicitado.cantidad > 1){
        prodSolicitado.cantidad--;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito(carrito);
    }else{
        const nuevoCarrito = carrito.filter(prod => prod.id != idProducto );
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        cargarCarrito(nuevoCarrito);
    }       

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
function totalCarrito(carrito) {
    const total = carrito.reduce((total, producto) => total + producto.obtenerPrecioTotal(), 0);
    localStorage.setItem('totalCarrito', total);
    return total;
}