//Si ya existe un carrito, crearlo a partir de los datos viejos
const CART = JSON.parse(sessionStorage.getItem("cart")) != null ? new Cart(JSON.parse(sessionStorage.getItem("cart")).products) : new Cart();

//Variables y constantes que utilizaremos
let PRODUCTS;
let pages = [];
let lastPage = 1;
const PAGE_INDEX = document.getElementById("page-index");
let maxProducts = 12;

//Agregamos eventos a los botones de páginas
$("#previous").click(()=> {
    if(parseInt(PAGE_INDEX.value) - 1 >= parseInt(PAGE_INDEX.getAttribute("min"))){
        PAGE_INDEX.value--;
        loadPage();
    }
        
})
$("#next").click(()=> {
    if(parseInt(PAGE_INDEX.value) + 1 <= parseInt(PAGE_INDEX.getAttribute("max"))){
        PAGE_INDEX.value++;
        loadPage();
    }
})
PAGE_INDEX.addEventListener("input", loadPage)

//Le pedimos la lista de productos al json
$.getJSON("../json/products.json", (data) => {
    $("#product-container").html("<p class='text-center c-light'>Cargando productos. Por favor espere.</p>")
    //Ordenamos los productos alfabeticamente
    PRODUCTS = data.products.sort((a, b)=> {
        if(a.name < b.name) return -1;
        return 1;
    });
    loadProducts(PRODUCTS)
});

//Populamos las páginas de a 15 productos cada una, para luego cargarlas rapidamente
//Minimizando las cantidades de veces que pedimos datos y armamos arrays grandes
function loadProducts(products){
    pages = [];
    let page = 1; lastPage = 1;
    pages[page] = [];
    for (const product of products) {
        //Nos fijamos si es necesario pasar a la siguiente página
        if(pages[page].length >= maxProducts){
           page++;
           pages[page] = []; 
           lastPage = page;
        } 

        //Armamos el innerHTML
        let tagHtml = '<ul class="list-group list-group-flush">';
        for (const tag of product.tags) {
            tagHtml += `<li class="card-item alpha-background list-group-item">${tag}</li>`;
        }
        tagHtml += "</ul>";

        pages[page].push(`<div data-id="${product.id}" class="card background-gradient col-12 col-sm-5 col-md-3">
        <img src="../images/${product.image}" class="card-img-top" alt="Midermus crema de ordeñe" loading="lazy">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.desc}</p>
        </div>
        <div class="d-flex justify-content-center align-items-center"><p>Precio: $${product.price}</p></div>
        ${tagHtml}
        <div class="card-to-cart">
            <input class="card-product-amount" type="number" value="1">
            <button class="card-add-button d-flex align-items-center justify-content-center">
                <img src="../images/add-to-cart.png" alt="Agregar al carrito">
            </button>
        </div>
        </div>`)
    }

    //Actualizamos la interfaz del usuario
    PAGE_INDEX.value = 1;
    PAGE_INDEX.setAttribute("max", lastPage)

    $("#last-page").text("/ " + lastPage);

    loadPage()
}

//Cargamos la página solicitada
function loadPage(){
    let page = parseInt(PAGE_INDEX.value);

    $("#product-container").html("")
    try {
        for (const product of pages[page]) {
            $("#product-container").append(product)
        }
    }//Si accedemos a una página inexistente del array, atrapamos el error y le avisamos al usuario que la página es invalida
    catch (error) {
        $("#product-container").html("<p class='text-center c-light'>Esta página está vacía</p>")
        Notification.error("La página ingresada está vacía")
    }

    //Le volvemos a agregar los eventos a los botones del carrito ya que fueron eliminados
    addCardEvents();
}

//Función que prepara los eventos dentro de las cards, ya que estas seran agregadas y eliminadas dinamicamente
function addCardEvents(){
    for (const card of $(".card")) {
        let addButton = $(card).find(".card-add-button");
        addButton.click(() => {
            let name = $(card).find(".card-title").text();
            let productId = $(card).attr("data-id");
            let amount = parseInt($(card).find(".card-product-amount").val())
            if(amount >= 1){
                Notification.success(`${name} X ${amount} ha sido agregado al carrito!`, 2500);

                $.getJSON("../json/products.json", (data) => {
                    let name = data.products[productId].name;
                    let image = data.products[productId].image;
                    let price = parseFloat(data.products[productId].price);
                    console.log(name, image, price)
                    CART.addProduct(new CartElement(productId, amount, name, image, price));
                })
            }
            else{
                Notification.warning(`${name} no agregado al carrito.\n
                la cantidad (${amount}) es menor a 1.`
                , 2500);
                return;
            }
        })
    }
}