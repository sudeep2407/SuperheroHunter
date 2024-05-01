

let favourites = JSON.parse(localStorage.getItem("favourites"));
if(null != favourites) {
    displaySuperheroList(favourites)
}
function displaySuperheroList(favourites) {
    favourites.forEach(superhero => {
        
        let cardCol = document.createElement("div");
        cardCol.setAttribute("class", "col");

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
        favIcon.classList.add("fa-solid");
        favIcon.setAttribute("id", superhero.id);
        favIconSpan.appendChild(favIcon);
        heroName.appendChild(favIconSpan);

        favIconSpan.addEventListener("click", function() {
            removeFromFavourites(superhero);
        })

        let viewDetails = document.createElement("a");
        viewDetails.setAttribute("class", "btn btn-primary")
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

//let favHeroSet = new Set();
function removeFromFavourites(superhero) {
    favourites.forEach(hero => {
        if(hero.id == superhero.id) {
            console.log("deleting"+ hero.name);
            favourites.splice(favourites.indexOf(hero),1);
        }
    })
    let jsonString = JSON.stringify(favourites);
    localStorage.setItem("favourites", jsonString);
    location.reload();
}

function viewHeroDetails(superhero){
    window.location.href = "./hero.html";
    localStorage.setItem("superhero", JSON.stringify(superhero));
}