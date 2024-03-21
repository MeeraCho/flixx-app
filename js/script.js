const global = {
    currentPage: window.location.pathname,
    search: {
        term: '', //empty string to begin with
        type: '',
        page: 1,
        totalPages: 1
    },
    api: {
        // Only use this for development or very small projects. You should store your key and make requests from a server.
        apiKEY : 'ee71c49c9ede0d3c13c83a295fa3c70c',
        apiURL : 'https://api.themoviedb.org/3'
    }
}

//-----------Display 20 most popular Movies--------------
async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular')
    // console.log(results);

    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                ${movie.poster_path
                    ? `
                    <img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="${movie.title}"
                    />` : `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${movie.title}"
                    />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>`
        document.querySelector('#popular-movies').appendChild(div);
    });
}

//-----------Display 20 most popular TV Shows--------------
async function displayPopularShows() {
    const { results } = await fetchAPIData('tv/popular')
    // console.log(results);

    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
            ${show.poster_path
                ? ` 
                <img
                    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                    class="card-img-top"
                    alt="${show.name}"
                    />` : `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${show.name}"
                />`
            }
        </a>
        <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
            <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
        </div>`
        document.querySelector('#popular-shows').appendChild(div);
    });
}

//-----------Display Movie Details--------------
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1]; //?id=792307
    const movie = await fetchAPIDataWithAuth(`movie/${movieId}`);
    console.log(movie);

    //Overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path);

    const div = document.createElement('div');

    div.innerHTML = `
        <div class="details-top">
            <div>
                ${movie.poster_path? `
                    <img
                        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                        class="card-img-top"
                        alt="${movie.title}"
                    />` : 
                    `<img
                        src="images/no-image.jpg"
                        class="card-img-top"
                        alt="${movie.title}"
                    />`}
            </div>
            <div>
                <h2>${movie.title}</h2>
                <p>
                    <i class="fas fa-star text-primary"></i>
                    ${movie.vote_average.toFixed(1)} / 10
                </p>
                <p class="text-muted">Release Date: ${movie.release_date}</p>
                <p>${movie.overview}</p>
                <h5>Genres</h5>
                <ul class="list-group">
                    ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
                </ul>
                <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
        </div>
        <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
                <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
                <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
                <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
                <li><span class="text-secondary">Status:</span> ${movie.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join('')}</div>
        </div>
    `
    document.querySelector('#movie-details').appendChild(div);
}

//-----------Display Show Details--------------
async function displayShowDetails() {
    const showId = window.location.search.split('=')[1]; //?id=792307
    const show = await fetchAPIDataWithAuth(`tv/${showId}`);
    console.log(show);

    //Overlay for background image
    displayBackgroundImage('show', show.backdrop_path);

    const div = document.createElement('div');

    div.innerHTML = `
        <div class="details-top">
            <div>
                ${show.poster_path? `
                    <img
                        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                        class="card-img-top"
                        alt="${show.name}"
                    />` : 
                    `<img
                        src="images/no-image.jpg"
                        class="card-img-top"
                        alt="${show.name}"
                    />`}
            </div>
            <div>
                <h2>${show.name}</h2>
                <p>
                    <i class="fas fa-star text-primary"></i>
                    ${show.vote_average.toFixed(1)} / 10
                </p>
                <p class="text-muted">First Air Date: ${show.first_air_date}</p>
                <p>${show.overview}</p>
                <h5>Genres</h5>
                <ul class="list-group">
                    ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
                </ul>
                <a href="${show.homepage}" target="_blank" class="btn">Visit show Homepage</a>
            </div>
        </div>
        <div class="details-bottom">
            <h2>Show Info</h2>
            <ul>
                <li><span class="text-secondary">Number of Episodes</span> $${show.number_of_episodes}</li>
                <li><span class="text-secondary">Last Episode To Air:</span> $${show.last_episode_to_air}</li>
                <li><span class="text-secondary">Status:</span> ${show.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${show.production_companies.map((company) => `<span>${company.name}</span>`).join('')}</div>
        </div>
    `
    document.querySelector('#show-details').appendChild(div);
}


//----------Display Backdrop on Details Pages----------
function displayBackgroundImage(type, backgroundPath){
    const overlayDiv = document.createElement('div')
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backgroundPath})`
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.5';

    if (type === 'movie'){
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

//-----------Search Movies/Shows--------------
async function search(){
    const queryString = window.location.search; //?type=movie&search-term=parasite - search창에 내용입력하면 나옴 
    const urlParams = new URLSearchParams(queryString);
    // console.log(urlParams)

    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');
    
    if(global.search.term !== '' && global.search.term !== null){
        const { results, total_pages, page } = await searchAPIData();

        if (results.length === 0) {
            showAlert('No results found');
            return;
        }

        displaySearchResults(results);

        document.querySelector('#search-term').value = '';
        
    } else {
        showAlert('Please enter a search term', 'error');
    }
}

function displaySearchResults(results) {
    results.forEach(result => {
        console.log(result)
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="movie-details.html?id=${result.id}">
                ${result.poster_path
                    ? `
                    <img
                        src="https://image.tmdb.org/t/p/w500${result.poster_path}"
                        class="card-img-top"
                        alt="${global.search.type === "movie" ? result.title: result.name}"
                    />` : `<img
                        src="images/no-image.jpg"
                        class="card-img-top"
                        alt="${global.search.type === "movie" ? result.title: result.name}"
                    />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${global.search.type === "movie" ? result.title: result.name}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${global.search.type === "movie" ? result.release_date: result.first_air_date}</small>
                </p>
            </div>`
        document.querySelector('#search-results').appendChild(div);
    });
}

//-----------Display Slider Movies--------------
async function displaySlider(){
    const { results } = await fetchAPIData('movie/now_playing');
    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');

        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
                <i class="fas fa-star text-secondary"></i> 
                ${movie.vote_average.toFixed(1)} / 10
            </h4>
        `
        document.querySelector('.swiper-wrapper').appendChild(div);

        initSwiper();
    })
}

function initSwiper(){
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1, 
        spaceBetween: 30, 
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 1000,
            disableOnIneraction: false
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            },
        }
    })
}


//-----------Fetch data from TMDB API--------------
//url 'https://api.themoviedb.org/3/movie/11?api_key=ee71c49c9ede0d3c13c83a295fa3c70c'
async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKEY;
    const API_URL = global.api.apiURL;

    showSpinner();

    const response = await fetch(`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`)

    const data = await response.json();

    hideSpinner();

    return data;
}

async function fetchAPIDataWithAuth(endpoint) {
    const API_KEY = global.api.apiKEY;
    const API_URL = global.api.apiURL;
    const API_Full_URL = `${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`

    // console.log(API_Full_URL);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZTcxYzQ5YzllZGUwZDNjMTNjODNhMjk1ZmEzYzcwYyIsInN1YiI6IjY1ZjIwNWQxMmZkZWM2MDE3MDIxM2I3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eOeJOvWLYwxurh5C4AyEunSobRnkq0LfHFcCNT70RZU'
        }
    };

    showSpinner();

    const response = await fetch(API_Full_URL, options)

    const data = await response.json();

    hideSpinner();

    return data;
}

async function searchAPIData() {
    const API_KEY = global.api.apiKEY;
    const API_URL = global.api.apiURL;
    //'https://api.themoviedb.org/3/search/movie?query=parasite&include_adult=false&language=en-US&page=1'
    const API_Full_URL = `${API_URL}/search/${global.search.type}?api_key=${API_KEY}&query=${global.search.term}&include_adult=false&language=en-US`

    // console.log(API_Full_URL);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    showSpinner();

    const response = await fetch(API_Full_URL, options)

    const data = await response.json();

    hideSpinner();

    return data;
}



//-----------------Show Spinner-------------------
function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

//-----------Hightlight Active Link--------------
function HightlightActiveLink() {
    const links = document.querySelectorAll('.nav-link')
    links.forEach((link) => {
        //check if the link is equal to the page 
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    })
}

//-----------------Show Alert--------------------
function showAlert(message, className = 'error') {
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className);
    alertEl.appendChild(document.createTextNode(message))
    document.querySelector('#alert').appendChild(alertEl);

    setTimeout(() => alertEl.remove(), 3000)
}

//-------------Add Commas to Number---------------
function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


//-------------Init App, Router-----------------
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displaySlider();
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularShows()
            break;
        case '/movie-details.html':
            displayMovieDetails()
            break;
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            search();
            break;
    }

    HightlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init);