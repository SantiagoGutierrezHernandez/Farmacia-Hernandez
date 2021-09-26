//Guardar el cartel que sale cuando no hay coincidencias
let noResultsSign = $("#no-results");
//Hacer que al presionar submit se realice la busqueda y no se reinicie la página
$("#filter-form").submit(search);

//Funciones de busqueda por criterios específicos
function searchByName(query, array) {
    let results = [];
    
    for(const card of array){
        if(StringHelper.toASCII(card.name).includes(query))
            results.push(card);
    }
    return results;
}

function searchByTag(tagQuery, array) {
    let results = [];

    for(const card of array){
        for(const tag of card.tags){
            if(StringHelper.toASCII(tag).includes(tagQuery)){
                results.push(card);
                break;
            }
        }
    }
    return results;
}

//Función que elimina las cards que no estan en los resultados y las agrega al DOM en forma de JSON
function showResults(results) {
    console.log("COINCIDENCIAS: ", results);
    if(results.length == 0){
        noResultsSign.show();
    }
    else
        noResultsSign.hide();
    loadProducts(results);
}

//Función general de búsqueda que delega según la entreda a las busquedas más específicas
function search(e) {
    e.preventDefault();

    let query = StringHelper.toASCII($("#filter-text").val());

    let results = Array.from(PRODUCTS);

    results = searchByName(query, results);

    let tag = StringHelper.toASCII($("#filter-tags").val());

    if(tag != "todos")
        results = searchByTag(tag, results);
    
    showResults(results)
}