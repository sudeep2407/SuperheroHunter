let apiKey = "63e3c8ff422f64eebbfd25fdfdea3703";
let privateKey = "08f5974e89cad741f4fd9238347f152fe952a555";
let ts = "qwertyuiopasdfghjklzxcvbnmqwerty"

let hash = CryptoJS.MD5(ts+privateKey+apiKey);

let total = 0;
const limit = 20;
let pageNumber = 0;
let offset = 0;
let url = 'https://gateway.marvel.com/v1/public/characters?ts='+ts+'&apikey='+apiKey+'&hash='+hash+'&limit='+limit+'&offset='+offset;
let superheroData = null;
let storedData = null;
async function getSuperheroData(fetchurl) {
    try {
        storedData = localStorage.getItem("superheroData");
        if(null == storedData) {
            let response = await fetch(fetchurl);
            let responseJson = await response.json();
            total = responseJson.data.total;
            superheroData = responseJson.data.results;
            let dataString = JSON.stringify(superheroData);
            localStorage.setItem("superheroData", dataString);
        }
        else {
            superheroData = JSON.parse(storedData);
        } 
        displayCarousel(superheroData);
        displaySuperheroList(superheroData);
    }
    catch (err) {
        console.log(err);
    }
}

//display carousel content
function displayCarousel(superheroData) {
    let carouselElement = document.getElementById("carousel");
    carouselElement.textContent = '';
    let previous = document.createElement("div");
    previous.setAttribute("id", "previous");
    let previousIcon = document.createElement("i");
    previousIcon.setAttribute("class", "fa-solid fa-angle-left");
    previous.appendChild(previousIcon);
    carouselElement.appendChild(previous);
    
    superheroData.forEach(superhero => {
        let imageDiv = document.createElement("div");
        imageDiv.setAttribute("class", "images");

        let imageElement = document.createElement("img");
        imageElement.src = superhero.thumbnail.path + "." + superhero.thumbnail.extension;

        let nameElement = document.createElement("h5");
        nameElement.setAttribute("class", "image-caption");
        nameElement.textContent = superhero.name;

        imageDiv.appendChild(imageElement);
        imageDiv.appendChild(nameElement);
        carouselElement.appendChild(imageDiv);

        imageDiv.addEventListener("click", function() {
            viewHeroDetails(superhero)
        })        
    });

    let next = document.createElement("div");
    next.setAttribute("id", "next");
    let nextIcon = document.createElement("i");
    nextIcon.setAttribute("class", "fa-solid fa-angle-right");
    next.appendChild(nextIcon);
    carouselElement.appendChild(next);
    implementCarouselTraversal();
}

//display main page content
function displaySuperheroList(superheroData) {
    let heroCards = document.getElementById("heroCards");
    heroCards.textContent = '';
    superheroData.forEach(superhero => {
        let cardCol = document.createElement("div");
        cardCol.setAttribute("class", "cardDiv col");

        let cardBody = document.createElement("div");
        cardBody.setAttribute("class", "heroDiv border-0 text-bg-dark card h-100");

        let heroImage = document.createElement("img");
        heroImage.setAttribute("class", "card-img-top");
        heroImage.src = superhero.thumbnail.path + "." + superhero.thumbnail.extension;

        cardBody.appendChild(heroImage);

        let cardContent = document.createElement("div");
        cardContent.setAttribute("class", "card-body");

        let heroName = document.createElement("h5");
        heroName.setAttribute("class", "card-title");
        heroName.textContent = superhero.name + "    ";
        let favIconSpan = document.createElement("span");
        
        let favIcon = document.createElement("i");
        favIcon.setAttribute("class", "favourites fa-regular fa-heart");

        let storedFavourites = localStorage.getItem("favourites");
        let favourites = null;
        if(null != storedFavourites) {
            favourites = JSON.parse(storedFavourites);
            favourites.forEach(hero => {
                if(hero.id == superhero.id) {
                    favIcon.classList.add("fa-solid");
                }
            });
        }

        favIcon.setAttribute("id", superhero.id);
        favIconSpan.appendChild(favIcon);
        heroName.appendChild(favIconSpan);

        favIconSpan.addEventListener("click", function() {
            addToFavourites(superhero);
        })

        let viewDetails = document.createElement("a");
        viewDetails.setAttribute("class", "btn btn-info")
        viewDetails.textContent = "View Details";

        cardContent.appendChild(heroName);
        cardContent.appendChild(viewDetails);

        cardBody.appendChild(cardContent);
        cardCol.appendChild(cardBody);
        heroCards.appendChild(cardCol);

        viewDetails.addEventListener("click", function() {
            viewHeroDetails(superhero);
        })
        
    });
}

// add/ remove to favourites list
let favourites = [];
let storedFavourites = localStorage.getItem("favourites");
if(null!=storedFavourites){
    favourites = JSON.parse(storedFavourites); 
}
function addToFavourites(superhero) {
    let favIcon = document.getElementById(superhero.id);
    if(favIcon.classList.contains("fa-solid")) {
        favIcon.classList.remove("fa-solid");
        favourites.forEach(hero => {
            if(hero.id == superhero.id) {
                console.log("deleting"+ hero.name);
                favourites.splice(favourites.indexOf(hero),1);
            }
        })
        console.log("favourites1 : "+favourites);
    }
    else {
        favourites.push(superhero);
        favIcon.classList.add("fa-solid");
    }
    
    console.log("favourites 2 : "+favourites);
    let jsonString = JSON.stringify(favourites);
    localStorage.setItem("favourites", jsonString);
}

// Superhero Page
function viewHeroDetails(superhero){
    window.location.href = "./hero.html";
    localStorage.setItem("superhero", JSON.stringify(superhero));
}

// search Bar 
let heroSearch = document.getElementById("heroSearch");
let selectOption = document.getElementById("selectOption");
heroSearch.addEventListener("keyup", ()=>{
    selectOption.textContent = '';
    selectOption.style.display = "flex";
    let storedData = localStorage.getItem("superheroData");
    let superheroData = JSON.parse(storedData);
    let searchResults = [];
    superheroData.forEach(superhero => {
        if(superhero.name.toUpperCase().match(heroSearch.value.toUpperCase())) {
            searchResults.push(superhero);
        }
    });

    searchResults.forEach(option => {
        let options = document.createElement("a");
        options.classList.add("search-result")
        options.textContent = option.name;
        options.setAttribute("id", option.id);
        selectOption.appendChild(options);    

        options.addEventListener("mousedown", function() {
            viewHeroDetails(option);
        })
    })
})

heroSearch.addEventListener("blur", ()=> {
    selectOption.style.display = "none";
})

// Carousel Traversal

let counter = 0;
let images = document.getElementsByClassName("images");
function implementCarouselTraversal (){
    
    let next = document.getElementById("next");
    next.addEventListener("click", ()=>{
        if(counter <14) {
            counter++;
            let slide = 300*counter;
            for(let i = 0; i<images.length; i++)
            {
                images.item(i).style.transform = `translateX(-${slide}px)`;
            }
        }
    });

    previous.addEventListener("click", ()=>{
        counter--;
        if(counter<=0) {
            counter = 0;
        }
        let slide = 300*counter;
        for(let i = 0; i<images.length; i++)
        {
            images.item(i).style.transform = `translateX(-${slide}px)`;
        }
    });
}

window.onload = function () {
    const startSlide = setInterval(slideShow, 1800);    
    function slideShow () {   
        counter++;
        let slide = 300*counter;
        for(let i = 0; i<images.length; i++)
        {
            images.item(i).style.transform = `translateX(-${slide}px)`;
        }
        if(counter == 14) {
            counter = -1;
        }
    }
    
}

// pagination
function getData(page) {
    localStorage.removeItem("superheroData");

    if(page > 0) {
        pageNumber++;
        offset = offset+20;
    }

    if(page == 0) {
        offset = 0;
    }

    if(page < 0) {
        offset = offset-20;
    }

    if(pageNumber>0) {
        document.getElementById("previousPage").classList.remove("disabled");
    }
    else {
        document.getElementById("previousPage").classList.add("disabled");
    }

    url = 'https://gateway.marvel.com/v1/public/characters?ts='+ts+'&apikey='+apiKey+'&hash='+hash+'&limit='+limit+'&offset='+offset;
    getSuperheroData(url);
}

// push next and previous up/down buttons on navbar collapse/show 
let navbarToggler = document.getElementById("navbarToggler");
navbarToggler.addEventListener("click", ()=> {
    if(navbarToggler.classList.contains("collapsed")) {
        document.getElementById("next").style.top = "180px";
        document.getElementById("previous").style.top = "180px";
    }
    else {
        document.getElementById("next").style.top = "320px";
        document.getElementById("previous").style.top = "320px";
    }
})


getSuperheroData(url);   



