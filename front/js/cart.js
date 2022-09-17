let cart = JSON.parse(localStorage.getItem('cart'));
console.table(cart);
if (cart == null) {
    var emptyCart = document.createElement("h2");
    document.getElementById("cart__items").appendChild(emptyCart);
    emptyCart.innerText = "Votre panier est vide, vous ne pouvez pas commander.";
    document.getElementById("order").disabled = true;
};

//function to calculate sum of cart, used in fillcart()
function sumOfItems() {
    var sumItems = 0;
    for (let i = 0; i < cart.length; i++) {
        sumItems += cart[i].quantity;
    }
    console.log(sumItems);
    document.getElementById("totalQuantity").innerText = sumItems;
};
sumOfItems();

function sumOfCart() {
    var sumPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        fetch("http://localhost:3000/api/products/" + cart[i]._id)
            .then((response) => response.json())
            .then((data) => {
                sumPrice += (cart[i].quantity * data.price);
                console.log(sumPrice);
                document.getElementById("totalPrice").innerText = sumPrice;
            }
            )
    };
}
sumOfCart();

//function to display content of cart and alter it
async function fillCart() {
    for (let i = 0; i < cart.length; i++) {
        //get article info
        fetch("http://localhost:3000/api/products/" + cart[i]._id)
            .then((response) => response.json())
            .then((data) => {
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
                cartImg.src = data.imageUrl;
                cartImg.alt = data.altTxt;

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
                cartTitle.innerText = data.name;
                var cartColor = document.createElement("p");
                cartDivContentTitle.appendChild(cartColor);
                cartColor.innerText = cart[i].color;
                var cartPrice = document.createElement("p");
                cartDivContentTitle.appendChild(cartPrice);
                cartPrice.innerText = data.price + "€";

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
            });
    };
};
fillCart();

// add regex pattern to form
document.getElementById("firstName").pattern = "(?![ -&(-,.-@[-`{-}]*[\-]{1,})^[a-zA-ZÁ-þ\-\']{2,30}$";
document.getElementById("lastName").pattern = "(?![ -&(-,.-@[-`{-}]*[\-]{2,})^[a-zA-ZÁ-þ\-\']{2,30}$";
document.getElementById("address").pattern = "(?![!-&(-+.-@[-`{-}]*[\-]{2,})^[a-zA-ZÁ-þ0-9\-\'/ ]{3,50}$";
document.getElementById("city").pattern = "(?![ -&(-,.-@[-`{-}]*[\-]{2,})^[a-zA-ZÁ-þ0-9\-\']{3,50}$";
document.getElementById("email").pattern = "^[a-zA-ZÁ-þ0-9.-_]+[@]{1}[a-zA-ZÁ-þ0-9.-_]+[.]{1}[a-z]{2,10}$";

//put regex in variable to create test
let firstNamePattern = document.getElementById("firstName").pattern;
let lastNamePattern = document.getElementById("lastName").pattern;
let addressPattern = document.getElementById("address").pattern;
let cityPattern = document.getElementById("city").pattern;
let emailPattern = document.getElementById("email").pattern;

//create regex test with variable
var firstNameReg = new RegExp(firstNamePattern);
var lastNameReg = new RegExp(lastNamePattern);
var addressReg = new RegExp(addressPattern);
var cityReg = new RegExp(cityPattern);
var emailReg = new RegExp(emailPattern);

//create array of ID
var products = [];
function fillProducts() {
    for (let i = 0; i < cart.length; i++) {
        products.push(cart[i]._id);
    }
};
fillProducts();
console.table(products);

document.getElementById("order").addEventListener('click', function (event) {
    //create client profile as an object
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;
    let contact = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email,
    };
    let order = {
        contact,
        products
    };
    //Creation Post request
    const options = {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "content-type": "application/json"
        },
        body: JSON.stringify(order),
    };
    //check data are correct
    if (firstName == '' || lastName == '' || address == '' || city == '' || email == '') {
        console.log("error client parameters");
        return;
    };
    if (firstNameReg.test(firstName)||lastNameReg.test(lastName)||addressReg.test(address)||cityReg.test(city)||emailReg.test(email)===false){
        return;
    }
    //checkPattern();
    //Post to server client+cart
    fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
            console.log("voici le retour de data");
            //localStorage.clear();
            document.location.href = "confirmation.html" + "?orderId=" + data.orderId;
        })
        .catch((err) => {
            alert("problème avec fetch" + err.message);
        })
});