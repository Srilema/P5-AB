async function getArticles() {
  var articlesCatch = await fetch("http://localhost:3000/api/products")
  return await articlesCatch.json();
};

//localStorage.clear();

fillArticles();
async function fillArticles(){
let articles = await getArticles()
.then(function(articles){
  console.table(articles);
  for (let i = 0; i<articles.length; i++){
    //creation of link
    var articleLink = document.createElement("a");

    //add link
    document.getElementById("items").appendChild(articleLink);
    let articleLinkBase = "./product.html?id=";
    let articleId = articles[i]._id;
    console.log("add "+ articleId);
    articleLink.href= articleLinkBase + articleId;
  
    //add div
    var articleArticle = document.createElement("article");
    articleLink.appendChild(articleArticle);
    
    //add Img of the articles to div + src + alt
    var articleImg = document.createElement("img");
    articleArticle.appendChild(articleImg);
    articleImg.src = articles[i].imageUrl;
    articleImg.alt = articles[i].altTxt;
    
    //Add Name of the article to the div
    var articleName = document.createElement("h3");
    articleArticle.appendChild(articleName);
    articleName.innerText = articles[i].name;
    
    //Add description of the article to the div through Paragraph
    var articleSummary = document.createElement("p");
    articleArticle.appendChild(articleSummary);
    articleSummary.innerText = articles[i].description;
    ;};});};



/*function saveClientCart{
  onclick
}*/

/*for (article of articles){
  //creation du lien
  var articleLink = document.createElement("a");
  articleLink.href="http://localhost:3000/$(_id)";
  //add link
  document.getElementById("items").appendChild(articleLink);


  var articleDiv = document.createElement("div");
  articleLink.appendChild(articleDiv);

  var articleImg = document.createElement("img");
  articleImg.href="$(imageUrl)";

  var articlesName = document.getElementById("items").getElementsByClassName("articlesLink").getElementByClass("articlesDiv").createElement("h3");
  document.getElementById("items").getElementsByClassName("articlesLink").getElementByClass("articlesDiv").getElementByClass("articlesName").createNewTextNode("$(name)");

  var articlesSummary = document.getElementById("items").getElementsByClassName("articlesLink").getElementByClass("articlesDiv").createElement("p");
  document.getElementById("items").getElementsByClassName("articlesLink").getElementByClass("articlesDiv").getElementByClass("articlesSummary").createNewTextNode("$(description)");
};*/



