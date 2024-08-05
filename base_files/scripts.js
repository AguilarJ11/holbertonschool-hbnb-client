/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

document.addEventListener("DOMContentLoaded", () => {
  fetchCountries();
  checkAuthentication();
  const loginForm = document.getElementById("login-form");
  document
    .getElementById("country-filter")
    .addEventListener("change", (event) => {
      const all_places = document.querySelectorAll(".place-card");
      const select_country = event.target.value;

      for (const place of all_places) {
        if (place.dataset.country === select_country) {
          place.style.display = "block";
        } else {
          place.style.display = "none";
        }
      }
    });

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      loginUser(email, password);
    });
  }
});

function checkAuthentication() {
  const token = getCookie("token");
  const loginLink = document.getElementById("login-link");

  if (!token) {
    loginLink.style.display = "block";
  } else {
    loginLink.style.display = "none";
    fetchPlaces(token);
  }
}

function getCookie(name) {
  const cookies = document.cookie;
  const cookie = cookies.split("; ");
  for (const cuki of cookie) {
    if (cuki.includes(name)) {
      const [cuki_name, cuki_value] = cuki.split("=");
      return cuki_value;
    }
  }
  console.log("Cookie not found");
  return null;
}

async function fetchPlaces(token) {
  const response = await fetch("http://127.0.0.1:5000/data_place", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const places = await response.json();
    return displayPlaces(places);
  } else {
    alert("Loading places failed: " + response.statusText);
  }
}

function displayPlaces(places) {
  const places_list = document.querySelector("#places-list");
  places_list.innerHTML = "";

  for (const place of places) {
    const place_card = document.createElement("div");
    place_card.className = "place-card";
    place_card.dataset.country = place.country_name;
    const place_img = document.createElement("img");
    place_img.src = "/base_files/icons/Jakarta_slumhome_2.jpg";
    place_img.className = "place-image";
    const place_name = document.createElement("h2");
    place_name.textContent = place.id;
    const place_price = document.createElement("p");
    place_price.textContent = `Price per night: $${place.price_per_night}`;
    const place_location = document.createElement("p");
    place_location.textContent = `Location: ${place.city_name}, ${place.country_name}`;
    const view_button = document.createElement("button");
    view_button.className = "details-button";
    view_button.textContent = "View Details";

    places_list.appendChild(place_card);
    place_card.appendChild(place_img);
    place_card.appendChild(place_name);
    place_card.appendChild(place_price);
    place_card.appendChild(place_location);
    place_card.appendChild(view_button);
  }
}

async function loginUser(email, password) {
  const response = await fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (response.ok) {
    const data = await response.json();
    document.cookie = `token=${data.access_token}; path=/`;
    window.location.href = "/places";
  } else {
    alert("Login failed: " + response.statusText);
  }
}
async function fetchCountries() {
  const response = await fetch("http://127.0.0.1:5000/countries");
  if (response.ok) {
    const countries = await response.json();
    return addCountries(countries);
  } else {
    alert("Loading countries failed: " + response.statusText);
  }
}

function addCountries(countries) {
  const countries_options = document.querySelector("#country-filter");

  for (const country of countries) {
    const country_name = document.createElement("option");
    country_name.value = country.name;
    country_name.textContent = country.name;
    countries_options.appendChild(country_name);
  }
}
