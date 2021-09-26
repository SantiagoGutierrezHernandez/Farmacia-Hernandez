//Si ya existe un carrito, crearlo a partir de los datos viejos
const CART = JSON.parse(sessionStorage.getItem("cart")) != null ? new Cart(JSON.parse(sessionStorage.getItem("cart")).products) : new Cart();

let cartRows = $("#cart-products");
let cartTotal = $("#cart-total");
let cartBuy = $("#cart-buy");

cartBuy.hide()

function calculateCartTotal() {
    if(CART.products.length == 0){
        cartTotal.text("No hay productos en el carrito.");
        cartBuy.hide();
        return;
    }

    cartBuy.show();
    cartTotal.text(`TOTAL: ${CART.total}`);
}

//Al finalizar por completo la carga de la página, agregamos todos los productos a la lista
//por si el usuario desea eliminar alguno o revisar antes de la compra
$(window).on("load", ()=>{
    CART.updateTotal()
    for (const product of CART.products) {
        let newRow = $(`<tr class='cart-row d-flex justify-content-evenly align-items-center' style='height: 10rem; border-bottom: 2px solid grey;'>
            <td class="h-100 d-flex justify-content-center align-items-center" style="width:10rem; height:15rem;">
                <img src="../images/${product.image}" class="h-100">
            </td>
            <td class="h-100 d-flex justify-content-evenly align-items-center" style="width: 15rem;">
                <p class="text-center" style="width: 10rem;">${product.name}</p>
            </td>
            <td class="h-100 d-flex justify-content-evenly align-items-center" style="width: 15rem;">
                <p>${product.amount}</p>
            </td>
            <td class="h-100 d-flex justify-content-evenly align-items-center" style="width: 15rem;">
                <p>${product.price}</p>
            </td>
            <td class="h-100 d-flex justify-content-evenly align-items-center" style="width: 15rem;">
                <p>${product.price * product.amount}</p>
            </td>
        </tr>`);
    
        let removeButton = $("<td><button class='btn-danger' style='width: 10rem; height: 3rem; font-size: 1.6rem;'>REMOVER</button></td>");
        
        //Al remover un producto, mostramos una notificacion y lo eliminamos de la lista y del carrito
        removeButton.click(() => {
            Notification.warning(`${product.name} ha sido eliminado del carrito.`, 5000);
            CART.removeProduct(product.id); 
            newRow.remove();
            calculateCartTotal();
        });
    
        newRow.append(removeButton);
    
        cartRows.append(newRow);
    }
    
    //Recalculamos el total para mostrarselo al usuario
    calculateCartTotal();
    
    //Le agregamos el evento al boton de compra
    cartBuy.click(() => {
        CART.buy(calculateCartTotal)
        let rows = $(".cart-row");
        for(let i = rows.length - 1; i >= 0; i--){
            rows[i].remove();
        }
    });
})