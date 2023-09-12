// MODAL
const formModal = document.querySelector(".modalForm");
const modal = document.querySelector(".modal");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnOpenModal = document.querySelector(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
};

const closeModal = function (e) {
  modal.classList.add("hidden");
};

btnOpenModal.addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "escape") {
    closeModal();
  }
});

// FILTERS
function populateFilterTitle() {
  const titleSelect = document.getElementById("title");

  fetch("http://localhost:6263/api/movies")
    .then((response) => response.json())
    .then((result) => {
      titleSelect.innerHTML =
        '<option value="all" class="movie__form__option smalltext">Select a title</option>';

      result.movies.forEach((titles) => {
        titleSelect.insertAdjacentHTML(
          "beforeend",
          `<option value="${titles._id}" class="movie__form__option smalltext">${titles.title}</option>`
        );
      });
    })
    .catch((error) => console.log("Error title: ", error));
};

populateFilterTitle();

function populateFilterGenres() {
  const genresSelect = document.getElementById("genres");

  fetch("http://localhost:6263/api/movies")
    .then((response) => response.json())
    .then((result) => {
      genresSelect.innerHTML =
        '<option value="all" class="movie__form__option smalltext">Select a genre</option>';

      // Create an empty Set to store unique genres
      const uniqueGenres = new Set();
      // Iterate through movies and extract genres
      result.movies.forEach((movie) => {
        movie.genres.forEach((genre) => {
          uniqueGenres.add(genre);
        });
      });
      // Populate the select element
      uniqueGenres.forEach((genre) => {
        genresSelect.insertAdjacentHTML(
          "beforeend",
          `<option value="${genre}" class="movie__form__option smalltext">${genre}</option>`
        );
      });
    })
    .catch((error) => console.log("Error genres: ", error));
};

populateFilterGenres();

// CARDS
function createMovieCards(movie) {

  return `<div class="col-4">
  <div class="movie__cards">
    <div class="movie__cards__description">
      <h5 class="text">${movie.title}</h5>
      <p class="smalltext">${movie.releaseDate}</p>
      <a class="smalltext" href="${movie.trailerLink}">See the trailer</a>
    </div>
    <div class="movie__cards__poster">
      <img class="movie__cards__poster__img" src="${movie.posterUrl}">
    </div>
    <div class="movie__cards__footer">
      <p class="smalltext">Genres: ${movie.genres}</p>
    </div>
  </div>`;
};

// BUTTON filters
function handleFilterBtnClick() {
  const title = document.getElementById("title").value;

  const queryParams = new URLSearchParams({ title }).toString();

  const url = `http://localhost:6263/api/movies/?${queryParams}`;

  const accessToken = localStorage.getItem("accessToken");
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);

  fetch(url, { headers })
    .then((response) => response.json())
    .then((data) => {
      const cardContainer = document.getElementById("movie__cards");
      cardContainer.innerHTML = "";

      data.movies.forEach((movie) => {
        const movieElement = createMovieCards(movie);
        cardContainer.innerHTML += movieElement;
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
};

handleFilterBtnClick();

// LOGIN
async function login(email, password) {
  try {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    const response = await fetch("http://localhost:6263/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password})
    });

    if(!response.ok) {
      alert("Login failed");

      const loginModal = document.getElementById("idModal");
      loginModal.hide();
    } else {
      const data = await response.json();

      if(data.accessToken && data.user) {
        const { accessToken, user } = data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);

        handleLoginSucess();

        const loginModal = document.getElementById("idModal");
        loginModal.hide();
      }
    }

  } catch (error) {
    console.log(error);
  }
};

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async(event) =>{
  event.preventDefault();

  const email = document.getElementById("emailModal").value;
  const password = document.getElementById("passwordModal").value;

  try {
    await login(email, password);
    
    console.log("Logged in successfully");
  } catch (error) {
    console.error("Login failed:", error);
  }
});