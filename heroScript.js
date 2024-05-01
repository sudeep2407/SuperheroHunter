let superhero = JSON.parse(localStorage.getItem("superhero"));
let heroImage = document.getElementById("hero-image");
heroImage.src = superhero.thumbnail.path + "." + superhero.thumbnail.extension;

let heroName = document.getElementById("item-heading");
heroName.textContent = superhero.name + "    ";

let favIconSpan = document.createElement("span");
let favIcon = document.createElement("i");
favIcon.setAttribute("class", "favourites fa-regular fa-heart");
favIcon.setAttribute("id", superhero.id);
favIconSpan.appendChild(favIcon);
heroName.appendChild(favIconSpan);

let storedFavourites = localStorage.getItem("favourites");
let favourites = null;
if(null != storedFavourites) {
    favourites = JSON.parse(storedFavourites);
    favourites.forEach(hero => {
        if(superhero.id == hero.id) {
            favIcon.classList.add("fa-solid");
        }
    });
}
favIconSpan.addEventListener("click", function() {
    addToFavourites(superhero);
})


let heroDescription = document.getElementById("hero-description");
let descriptionElement = document.createElement("p");
descriptionElement.textContent = superhero.description;
heroDescription.insertAdjacentElement("afterend", descriptionElement);

let seriesHeading = document.getElementById("series-heading");
let series = superhero.series.items;
series.forEach(element => {
    let seriesElement = document.createElement("p");
    seriesElement.textContent = element.name;
    seriesHeading.insertAdjacentElement("afterend", seriesElement);
});

let storiesHeading = document.getElementById("stories-heading");
let stories = superhero.stories.items;
stories.forEach(element => {
    let storiesElement = document.createElement("p");
    storiesElement.textContent = element.name;
    storiesHeading.insertAdjacentElement("afterend", storiesElement);
});


// add/remove from fav

async function addToFavourites(superhero) {
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