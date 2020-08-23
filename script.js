const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes(page){
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    console.log('Current array', page, currentArray)
    currentArray.forEach((result) => {
        //Card
        const card = document.createElement('div');
        card.classList.add('card');
        //Anchor tags
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        //Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        //Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        //Card Text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        //Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        //Copyright 
        const copyrighResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrighResult}`;
        //Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText,footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);   
    });
}

function updateDOM(page){
  //Get favorites from localStorage
  if (localStorage.getItem('nasaFavorites')){
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    console.log('favorites Local', favorites);
  }
  imagesContainer.textContent = '';
  createDOMNodes(page);
}

// Get 10 images from NASA API

async function getNasaPictures() {
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('favorites');
    } catch(error) {
        //catch error here
    }
}

//Add result to Favorites
function saveFavorite(itemUrl){
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            //Show Save confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            //Set favorites in local storage
            localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        }
    });
}

//Remove item from Favorites
function removeFavorite(itemUrl){
    if (favorites[itemUrl]){
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

//On load
getNasaPictures();