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

  fetch("http://localhost:6362/api/movies")
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

  fetch("http://localhost:6362/api/movies")
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
function createMovieCards() {
  fetch("http://localhost:6362/api/movies")
    .then((response) => response.json())
    .then((result) => {
      const cardContainer = document.getElementById("movie__cards");
      cardContainer.innerHTML = "";

      result.movies.forEach((movie) => {
        cardContainer.innerHTML += (
          `<div class="col-4">
            <div class="movie__cards">
              <div class="movie__cards__description">
                <h5 class="mediumtext">${movie.title}</h5>
                <p class="smalltext">${movie.releaseDate}</p>
                <a href="${movie.trailerLink}" target="_blank">See the trailer</a>
              </div>
              <div class="movie__cards__poster">
                <img class="movie__cards__poster__img" src="${movie.posterUrl}">
              </div>
              <div class="movie__cards__footer">
                <p class="smalltext">Genres: ${movie.genres}</p>
              </div>
            </div>
          </div>`
          )
      })
    })

};

createMovieCards();

// BUTTON filters
function handleFilterBtnClick() {
  const id = document.getElementById("title").value;
  const genres = document.getElementById("genres").value;

  const filters = {
    id,
    genres,
  };

  // const queryParams = new URLSearchParams({ id, genres }).toString();
  const queryString = encodeURIComponent(JSON.stringify({ filters }));

  const url = `http://localhost:6362/api/movies/?filters=${queryString}`;

  const accessToken = localStorage.getItem("accessToken");
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);
  console.log(url);
  fetch(url, { headers })
    .then((response) => response.json())
    .then((data) => {
      const cardContainer = document.getElementById("movie__cards");
      cardContainer.innerHTML = "";

      data.movies.forEach((movie) => {
        const movieElement = createMovieCards(movie);
        cardContainer.insertAdjacentHTML("beforeend", movieElement);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
};

const filterBtn = document.getElementById("filter__btn");
filterBtn.addEventListener("click", handleFilterBtnClick);

// LOGIN
async function login(email, password) {
  try {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    const response = await fetch("http://localhost:6362/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password})
    });

    if(!response.ok) {
      alert("Login failed");

      const loginModal = document.getElementById("idModal");
      loginModal.classList.add("hidden");
    } else {
      const data = await response.json();

      if(data.accessToken && data.user) {
        const { accessToken, user } = data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);

        handleAfterLogin();

        const loginModal = document.getElementById("idModal");
        loginModal.classList.add("hidden");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// login submission
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async(event) =>{
  event.preventDefault();

  const email = document.getElementById("emailModal").value;
  const password = document.getElementById("passwordModal").value;

  try {
    await login(email, password);

    alert("Logged in successfully");
    modal.classList.add("hidden");
  } catch (error) {
    console.error("Login failed:", error);
  }
});

// after login
function handleAfterLogin() {
  const logoutContainer = document.getElementById("logout__container");
  logoutContainer.innerHTML = `<a href="#" id="logout__link" class="navbar__menu__list__item text">Logout</a>`;

  const loginContainer = document.getElementById("login__container");
  loginContainer.style.display = "none";

  const logoutLink = document.getElementById("logout__link");
  logoutLink.addEventListener("click", handleLogout());
};

  handleAfterLogin();

// handle logout
function handleLogout() {
  localStorage.removeItem("accessToken");

  const logoutContainer = document.getElementById("logout__container");
  logoutContainer.innerHTML = "";

  const loginContainer = document.getElementById("login__container");
  loginContainer.style.display = "block";
};

// function checkLoggedInStatus() {
//   const accessToken = localStorage.getItem("accessToken");
//   const loginContainer = document.getElementById("login__container");
//   const userProfile = document.getElementById("user__profile");

//   if (accessToken) {
//     loginContainer.style.display = "none";

//     const userName = localStorage.getItem("userName");
//     userProfile.innerHTML = `<a href="#" id="logout__link" class="navbar__menu__list__item text">Logout</a>`;

//     const logoutLink = document.getElementById("logout__link");
//     logoutLink.addEventListener("click", handleLogout);
//   } else {
//     userProfile.innerHTML = "";
//     loginContainer.style.display = "block";
//   }
// }

// checkLoggedInStatus();