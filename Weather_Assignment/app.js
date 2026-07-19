const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const weatherContainer = document.getElementById("weatherContainer");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");

const API_KEY = "8837392056984cac23467ccebb45ed62";

function showLoading() {
  loadingIndicator.classList.remove("hidden");
  weatherContainer.innerHTML = "";
  errorMessage.classList.add("hidden");
}

function hideLoading() {
  loadingIndicator.classList.add("hidden");
}

function showError(message) {
  hideLoading();

  errorMessage.textContent = message;

  errorMessage.classList.remove("hidden");
}

function renderWeather(data) {
  hideLoading();

  weatherContainer.innerHTML = "";

  const card = document.createElement("div");

  card.className = "weather-card";

  card.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>

        <img
        src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
        alt="weather icon">

        <p><strong>Weather:</strong> ${data.weather[0].description}</p>

        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>

        <p><strong>Feels Like:</strong> ${data.main.feels_like} °C</p>

        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>

        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;

  weatherContainer.appendChild(card);
}

async function fetchWeather(city) {
  showLoading();

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    console.log(data);

    renderWeather(data);
  } catch (error) {
    console.log(error);

    showError("Failed to fetch weather data");
  }
}

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();

  if (city) {
    fetchWeather(city);
  }
});

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const city = searchInput.value.trim();

    if (city) {
      fetchWeather(city);
    }
  }
});
