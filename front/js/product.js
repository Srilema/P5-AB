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

        //hide imgUrl and altTxt
        let imgUrlHidden = document.createElement("p");
        imgUrlHidden.style.display = "none";
        imgUrlHidden.id = "imgUrl";
        document.getElementById("description").appendChild(imgUrlHidden);
        imgUrlHidden.innerText = article.imageUrl;
        let altTxtHidden = document.createElement("p");
        altTxtHidden.style.display = "none";
        altTxtHidden.id = "altTxt";
        document.getElementById("description").appendChild(altTxtHidden);
        altTxtHidden.innerText = article.altTxt;

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
    constructor(_id, color, quantity, price, imageUrl, altTxt, title){
        this._id = _id;
        this.color=color;
        this.quantity=quantity;
        this.price=price;
        this.imageUrl = imageUrl;
        this.altTxt = altTxt;
        this.title = title;
    }
};
console.log(cartItem);

//button add to cart + creation of cart and set into local storage
document.getElementById("addToCart").addEventListener('click', function buttonAddToCart(event){
    console.log('element clicked');
    let itemColor = document.getElementById("colors").value;
    let itemPriceText=document.getElementById("price").innerText;
    let itemPrice = parseInt(itemPriceText);
    let itemQuantity = parseInt(document.getElementById("quantity").value);
    let itemImage = document.getElementById("imgUrl").innerText;
    let itemAltTxt = document.getElementById("altTxt").innerText;
    let itemName = document.getElementById("title").innerText;
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
            let cartProduct = new cartItem(_id, itemColor, itemQuantity, itemPrice, itemImage, itemAltTxt, itemName);
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
                const resultFind = cartStored.find(el => el.id===id && el.color===itemColor);
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

