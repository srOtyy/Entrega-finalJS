export class ProductoCarrito{
    constructor(producto,cantidad){
        this.producto = producto;
        this.cantidad = cantidad;
    }
    
    mostrarInfo(){
        return `
            <div class="nombre-producto">
                <small>Nombre</small> 
                <h4>${this.producto.nombre}</h4>
            </div>
            <div class="talle-producto">
                <small>Color</small> 
                <h4>${this.producto.color}</h4>
            </div>
            <div class="cantidad-producto">
                <small>Cantidad</small>
                <h4>${this.cantidad}</h4>
            </div>
            <div class="precio-producto">
                <small>Precio</small>
                <h4>$${this.producto.precio}</h4>
            </div>
            <div class="total-producto">
                <small>Total</small>
                <h4>$${this.obtenerPrecioTotal()}</h4>
            </div>
                `;
    }
    obtenerPrecioTotal() {
        return parseInt(this.producto.precio * this.cantidad);
    }

}
export class ProductoStorage{
        constructor(id){
            this.id = id;
            this.cantidad = 1;
        }
        asignarCantidad(cantidad){
            this.cantidad=cantidad;
        }
        incrementarCantidad(){
            this.cantidad++;
        }
        reducirCantidad(){
            if(this.cantidad > 0){
                this.cantidad--;
            }
            
        }
}
export const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#1a1a1a",
    color:"#AAFAAA",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
});
