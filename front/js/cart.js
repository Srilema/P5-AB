let cart = JSON.parse(localStorage.getItem('cart'));
console.table(cart);

//function to calculate sum of cart, used in fillcart()
function sumOfItems() {
    var sumItems = 0;
    for (let y = 0; y < cart.length; y++) {
        sumItems += cart[y].quantity;
    }
    console.log(sumItems);
    document.getElementById("totalQuantity").innerText = sumItems;
};
sumOfItems();

function sumOfCart() {
    var sumPrice = 0;
    for (let y = 0; y < cart.length; y++) {
        sumPrice += (cart[y].price * cart[y].quantity);
    }
    console.log(sumPrice);
    document.getElementById("totalPrice").innerText = sumPrice;
}
sumOfCart();

//function to display content of cart and alter it
async function fillCart() {
    for (let i = 0; i < cart.length; i++) {
        //add article
        var cartArticle = document.createElement("article");
        cartArticle.classList.add('cart__item');
        document.getElementById("cart__items").appendChild(cartArticle);

        //create div with img
        var cartDivImg = document.createElement("div");
        cartDivImg.classList.add('cart__item__img');
        cartArticle.appendChild(cartDivImg);
        var cartImg = document.createElement("img");
        cartDivImg.appendChild(cartImg);
        cartImg.src = cart[i].imageUrl;
        cartImg.alt = cart[i].altTxt;

        //create div with content
        var cartDivContent = document.createElement("div");
        cartDivContent.classList.add('cart__item__content');
        cartArticle.appendChild(cartDivContent);

        //create sub-div with title, price, color
        var cartDivContentTitle = document.createElement("div");
        cartDivContentTitle.classList.add('cart__item__content__description');
        cartDivContent.appendChild(cartDivContentTitle);
        var cartTitle = document.createElement("h2");
        cartDivContentTitle.appendChild(cartTitle);
        cartTitle.innerText = cart[i].title;
        var cartColor = document.createElement("p");
        cartDivContentTitle.appendChild(cartColor);
        cartColor.innerText = cart[i].color;
        var cartPrice = document.createElement("p");
        cartDivContentTitle.appendChild(cartPrice);
        cartPrice.innerText = cart[i].price + "€";

        //div setting - sub-div of Content
        var cartDivSetting = document.createElement("div");
        cartDivSetting.classList.add('cart__item__content__settings');
        cartDivContent.appendChild(cartDivSetting);
        var cartDivSettingQuantity = document.createElement("div");
        cartDivSettingQuantity.classList.add('cart__item__content__settings__quantity');
        cartDivSetting.appendChild(cartDivSettingQuantity);
        var cartSettingQuantityP = document.createElement("p");
        cartDivSettingQuantity.appendChild(cartSettingQuantityP)
        cartSettingQuantityP.innerText = "Qté:";
        //Setting Input
        var cartSettingQuantityInput = document.createElement("input");
        cartSettingQuantityInput.classList.add("itemQuantity");
        cartDivSetting.appendChild(cartSettingQuantityInput);
        cartSettingQuantityInput.type = "number";
        cartSettingQuantityInput.min = 1;
        cartSettingQuantityInput.max = 100;
        cartSettingQuantityInput.value = cart[i].quantity;
        cartSettingQuantityInput.addEventListener('change', function (event) {
            cart[i].quantity = parseInt(this.value);
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(cart);
            sumOfItems();
            sumOfCart();
        })

        //Delete div
        var cartSettingDelete = document.createElement("div");
        cartSettingDelete.classList.add("cart__item__content__settings__delete");
        cartDivSetting.appendChild(cartSettingDelete);
        var cartSettingDeleteP = document.createElement("p");
        cartSettingDeleteP.classList.add("deleteItem")
        cartSettingDelete.appendChild(cartSettingDeleteP);
        cartSettingDeleteP.innerText = "Supprimer";
        cartSettingDelete.addEventListener('click', function deleteCartItem(event) {
            cart.splice(i, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        });
    };
};
fillCart();

// add regex pattern to form
document.getElementById("firstName").pattern = "(?![ -&(-,.-@[-`{-}]*[\-]{1,})^[a-zA-ZÁ-þ\-\']{2,30}$";
document.getElementById("lastName").pattern = "(?![ -&(-,.-@[-`{-}]*[\-]{2,})^[a-zA-ZÁ-þ\-\']{2,30}$";
document.getElementById("address").pattern = "(?![!-&(-+.-@[-`{-}]*[\-]{2,})^[a-zA-ZÁ-þ0-9\-\'/ ]{3,50}$";
document.getElementById("city").pattern = "(?![ -&(-,.-@[-`{-}]*[\-]{2,})^[a-zA-ZÁ-þ0-9\-\']{3,50}$";

//create array of ID
var products = [];
function fillProducts() {
    for (let i = 0; i < cart.length; i++) {
        products.push(cart[i]._id);
    }
};
fillProducts();
console.table(products);

//Creation Post request
const options = {
    method: 'POST',
    header: {
        'accept': 'application/json',
        "content-type": "application/json"
    },
    body: JSON.stringify(order),
};

document.getElementById("order").addEventListener('click', function (event) {
    //create client profile as an object
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;
    let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email:document.getElementById("email").value,
    };
    let order= {
        contact,
        products,
    };
    /*new client (firstName, lastName, address, city, email);
    console.log(order);
    /*if (firstName||lastName||address||city||email ==null){
        console.log("error client parameters");
        return;
    }
    else{*/
    //Post to server client+cart
    fetch("http://localhost:3000/api/products/order", options)
    .then((response)=>response.json())
    .then((data)=>{
        console.log("voici le retour de data");
        console.log(data);
        //localStorage.clear();
        localStorage.setItem("orderId", data.orderId);
        document.location.href="confirmation.html";
    })
    .catch((err)=>{
        alert ("problème avec fetch"+err.message);
    })//}
});