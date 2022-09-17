//get product Id
const articleUrl = window.location.href;
console.log(articleUrl);
const splitUrlString = articleUrl.split('=');
const _id = splitUrlString.at(-1);
console.log(_id);

//get data of product
getOneArticle();
async function getOneArticle(){
    var articleCatch = await fetch("http://localhost:3000/api/products/"+_id)
    return await articleCatch.json();
};

fillArticle();
async function fillArticle(){
    let article = await getOneArticle()
    .then(function(article){
        console.table(article);

        //Change title in head
        articlePageName = article.name;
        document.title = articlePageName;

        //Add article data to template
        document.getElementById("title").innerText= article.name;
        document.getElementById("price").innerText = article.price;
        document.getElementById("description").innerText = article.description;

        //Put option in select
        for (let i=0; i<article.colors.length; i++){
            let addColorsOptions = document.createElement("option");
            document.getElementById("colors").appendChild(addColorsOptions);
            addColorsOptions.innerText= article.colors[i];
            addColorsOptions.value = article.colors[i];
        };
    });
};

//create class
class cartItem{
    constructor(_id, color, quantity){
        this._id = _id;
        this.color=color;
        this.quantity=quantity;
    }
};
console.log(cartItem);

//button add to cart + creation of cart and set into local storage
document.getElementById("addToCart").addEventListener('click', function buttonAddToCart(event){
    console.log('element clicked');
    let itemColor = document.getElementById("colors").value;
    let itemQuantity = parseInt(document.getElementById("quantity").value);
    if (itemQuantity<1 || itemQuantity>100){
        console.log('error: quantity invalid');
        return;
    }
    else{
        if(itemColor==''){
            console.log('error: null color');
            return;
        }
        else{
            let cartProduct = new cartItem(_id, itemColor, itemQuantity);
            console.log(cartProduct);
            var cartStored=JSON.parse(localStorage.getItem('cart'))
            console.log(cartStored);
            if(cartStored==null){
             let newCart = [];
             console.log(newCart);
             newCart.push(cartProduct);
             console.table(newCart);
             localStorage.setItem('cart', JSON.stringify(newCart));
             window.location.href = "../html/cart.html";
            }
            else{
                const resultFind = cartStored.find(el => el._id===_id && el.color===itemColor);
                if(resultFind){
                    let newQuantity= parseInt(itemQuantity)+parseInt(resultFind.quantity);
                    resultFind.quantity=newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cartStored));
                    window.location.href = "../html/cart.html";
                }
                else{
                    cartStored.push(cartProduct);
                    localStorage.setItem('cart', JSON.stringify(cartStored));
                    window.location.href = "../html/cart.html";
                }
            }
        }
    }
});

