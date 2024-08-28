import { cargarCarrito ,convertirAProductoCarrito,esconderCarrito,totalCarrito} from "./funciones.js";
document.addEventListener('DOMContentLoaded', () => {

    //cargamos el carrito y verificamos si existe algo dentro del carrito
    let carrito = convertirAProductoCarrito(JSON.parse(localStorage.getItem('carrito')));
    if(carrito === null || carrito.length < 1){
        esconderCarrito();
    }else{
        cargarCarrito(carrito);

    }

    const botonCompra = document.getElementById("boton-confirmar-compra");
    botonCompra.addEventListener("click",()=>{
        //cargamos los datos de nuevo en carrito x si sufre alguna modificacion antes de la compra( por la linea 22 )
        carrito = convertirAProductoCarrito(JSON.parse(localStorage.getItem('carrito')));
        Swal.fire({
            title: "Estas a punto de comprar",
            text: `¿Deseas confirmar la compra por $${totalCarrito(carrito)}?`,
            icon: "warning",
            background: "#1a1a1a",
            color:"#AAFAAA",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            confirmButtonColor: "#254336",
            cancelButtonText: `Cancelar`,
            cancelButtonColor:"#AA5A55"
          }).then((result) => {
                if(result.isConfirmed){
                    Swal.fire({
                        title: "Gracias por su compra🥰",
                        icon: "success",
                        background: "#1a1a1a",
                        color:"#AAFAAA",
                        confirmButtonText: `<i class="fa fa-thumbs-down"><a href="index.html" id="botonAlerta">Volver</a></i> `,
                        confirmButtonColor: "#254336"

                    });
                    localStorage.setItem('carrito',[]);
                    cargarCarrito([]);
                }
          });
        
    })


})


