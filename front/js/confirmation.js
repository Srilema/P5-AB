const articleUrl = window.location.href;
console.log(articleUrl);
const splitUrlString = articleUrl.split('=');
const orderId = splitUrlString.at(-1);
document.getElementById("orderId").innerText = orderId;