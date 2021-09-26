class StringHelper{
    //Si el string no es nulo, reemplazar los carácteres 
    //con tilde por contrapartes más fáciles de procesar
    static toASCII(str){
        if(typeof str != "string") return "";

        let out = str.toLowerCase();
        out = out.replace("á", "a");
        out = out.replace("é", "e");
        out = out.replace("í", "i");
        out = out.replace("ó", "o");
        out = out.replace("ú", "u");

        return out;
    }
}

class Cart{
    constructor(products){
        this.products = [];
        
        //Si el parametro no es válido haremos un carrito vacío
        if(typeof products != typeof []){
            this.total = 0;
            return;
        }
        
        //Forzar a que los elementos recibidos sean del tipo CartElement para poder usar sus metodos
        for(const product of products){
            this.products.push(new CartElement(product.id, product.amount, product.name, product.image, product.price));
        }
        
        this.updateTotal();
    }
    
    //Agregar un producto al carrito
    addProduct(cartElem){
        if(cartElem.amount <= 0)//Si no tiene un valor válido no haremos nada
            return;

        for (const product of this.products) { //Si el elemento existe, agregaremos su valor a la cantidad
            if(product.id == cartElem.id){
                product.amount += cartElem.amount;
                sessionStorage.setItem("cart", JSON.stringify(this));
                this.updateTotal();
                return;
            }
        }

        //Sino lo agregamos a la lista de productos
        this.products.push(cartElem);
        
        this.updateTotal();
        sessionStorage.setItem("cart", JSON.stringify(this));
    }

    //Remover producto según ID
    removeProduct(id){
        let newProducts = []; //Crear array vacío para almacenar los productos
        for (const product of this.products) {
            //Si el id no coincide, lo agregamos ya que no es el que queremos eliminar
            if(product.id != id){
                newProducts.push(product);
            }
        }

        this.products = newProducts;
        this.updateTotal();
        sessionStorage.setItem("cart", JSON.stringify(this));
    }

    //Actualizar valor total del carrito
    updateTotal(){
        let total = 0;
        for (const product of this.products) {
            total += product.price * product.amount;
        }
        this.total = total;
    }

    //Simular una compra del carrito
    buy(callback){
        if(this.products.length > 0){
            $.ajax({
                //Enviar al servidor todos los productos del carrito para realizar la compra
                method: "POST",
                url: "https://jsonplaceholder.typicode.com/posts",
                data: { price: this.total },
                success: (response) => {
                    //Si hubo éxito, formamos un mensaje con los productos y se lo mostramos al usuario
                    let productText = "PRODUCTOS:<br>";
    
                    for (const product of this.products) {
                        productText += product.name + " X " + product.amount + ", Precio por cantidad $" + product.price * product.amount + "<br>"; 
                    }
    
                    Notification.success(`Compra realizada!<br> TOTAL: $${parseFloat(response.price)}<br> ${productText}`)
                    
                    //Vaciamos el carrito y lo actualizamos
                    this.products = [];
                    this.updateTotal();
                    sessionStorage.setItem("cart", JSON.stringify(this));

                    if(typeof callback == "function") callback();
                }
            });
        }
    }
}

//Clase puramente semantica. Solo guarda variables necesarias para poblar el carrito y metodos de ayuda
class CartElement{ 
    constructor(id, amount, name, image, price){
        this.id = parseInt(id);
        this.amount = parseInt(amount);
        this.name = name;
        this.image = image;
        this.price = price;
    }
}

//Clase semántica para crear notificaciones para el usuario menos invasivas que un alert
//Luego de mostrarlas, las borramos para que no se acumulen, ocupando memoria
class Notification{
    static success(message, time){
        time = time || 10000;
        //Borramos cualquier posible mensaje existente
        $("#notification-popup").remove();
        //Creamos el nuevo
        $("body").append('<div id="notification-popup"><button type="button" class="notification-close" value="X">X</button><p class="notification-text"></p></div>')
        $("#notification-popup .notification-text").html(message);
        let popup = $("#notification-popup");
        $("#notification-popup .notification-close").click(() => {popup.remove()});
        popup.css("border", "3px green solid");
        popup.fadeIn(300).delay(time).fadeOut(300, () => {popup.remove()});
    }
    static warning(message, time){
        time = time || 10000;
        //Borramos cualquier posible mensaje existente
        $("#notification-popup").remove();
        //Creamos el nuevo
        $("body").append('<div id="notification-popup"><button type="button" class="notification-close" value="X">X</button><p class="notification-text"></p></div>')
        $("#notification-popup .notification-text").html(message);
        let popup = $("#notification-popup");
        $("#notification-popup .notification-close").click(() => {popup.remove()});
        popup.css("border", "3px yellow solid");
        popup.fadeIn(300).delay(time).fadeOut(300, () => {popup.remove()});
    }
    static error(message, time){
        time = time || 10000;
        //Borramos cualquier posible mensaje existente
        $("#notification-popup").remove();
        //Creamos el nuevo
        $("body").append('<div id="notification-popup"><button type="button" class="notification-close" value="X">X</button><p class="notification-text"></p></div>')
        $("#notification-popup .notification-text").html(message);
        let popup = $("#notification-popup");
        $("#notification-popup .notification-close").click(() => {popup.remove()});
        popup.css("border", "3px red solid");
        popup.fadeIn(300).delay(time).fadeOut(300, () => {popup.remove()});
    }
}