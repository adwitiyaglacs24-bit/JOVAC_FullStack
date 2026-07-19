const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const weatherContainer = document.getElementById("weatherContainer");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");
const recentSearches = document.getElementById("recentSearches");
const forecastContainer = document.getElementById("forecastContainer");
const questionInput = document.getElementById("questionInput");
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const lastUpdated = document.getElementById("lastUpdated");
const aqiContainer = document.getElementById("aqiContainer");
let currentWeatherData = "";
let currentForecastData = "";
const aiInput = document.getElementById("aiInput");
const askAiBtn = document.getElementById("askAiBtn");
const aiResponse = document.getElementById("aiResponse");
const API_KEY = "xxxxxxxxxxxx";
const OPENROUTER_API_KEY =
  "cxxxxxxxxxxxxx";
let currentAQIData = null;
const newsContainer = document.getElementById("newsContainer");
const NEWS_API_KEY = "xxxxxxxxxxxxxxx";

function getRecentSearches() {
  return JSON.parse(localStorage.getItem("recentSearches") || "[]");
}

async function fetchNews(city) {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${city} AND (weather OR rainfall OR storm OR heatwave OR climate)&language=en&sortBy=publishedAt&pageSize=6&apiKey=${NEWS_API_KEY}`,
    );
    const data = await response.json();
    newsContainer.innerHTML = "";
    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = "<p>No news available.</p>";
      return;
    }
    data.articles.forEach((article) => {
      const card = document.createElement("div");
      card.className = "news-card";
      const date = new Date(article.publishedAt);
      card.innerHTML = `
        <div class="news-content">
          <small>${article.source.name}</small>
          <h3>${article.title}</h3>
          <span>${date.toLocaleDateString()}</span>
          <br><br>
          <a href="${article.url}" target="_blank">Read More →</a>
        </div>
      `;
      newsContainer.appendChild(card);
    });
  } catch (error) {
    console.log(error);
    newsContainer.innerHTML = "<p>Failed to load news.</p>";
  }
}

function saveSearch(city) {
  let searches = getRecentSearches();
  searches = [
    city,
    ...searches.filter((s) => s.toLowerCase() !== city.toLowerCase()),
  ];
  searches = searches.slice(0, 5);
  localStorage.setItem("recentSearches", JSON.stringify(searches));
  renderChips();
}

function renderChips() {
  recentSearches.innerHTML = "";
  const searches = getRecentSearches();
  searches.forEach((city) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = city;
    chip.addEventListener("click", () => {
      searchInput.value = city;
      fetchWeather(city);
    });
    recentSearches.appendChild(chip);
  });
}

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
  updateTime();
  hideLoading();
  weatherContainer.innerHTML = "";
  const weatherMain = data.weather[0].main;
  const card = document.createElement("div");
  card.className = "weather-card";
  card.innerHTML = `<p class="section-title">CURRENT WEATHER</p>
  <div class="weather-top">
  <div class="temp-box">
  <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
  <div>
  <h1>${Math.round(data.main.temp)}°C</h1>
  <h2>${data.name}, ${data.sys.country}</h2>
  <p>${data.weather[0].description}</p>
  </div>
  </div>
  </div>
  <div class="weather-stats">
  <div class="stat">
  <span>Humidity</span>
  <h3>${data.main.humidity}%</h3>
  </div>
  <div class="stat">
  <span>Wind</span>
  <h3>${data.wind.speed} km/h</h3>
  </div>
  </div>
  `;
  weatherContainer.appendChild(card);
}

function renderForecast(data) {
  forecastContainer.innerHTML = "";
  const forecast = [data.list[0], data.list[8], data.list[16]];
  forecast.forEach((day) => {
    const date = new Date(day.dt_txt);
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
    <h4>${DAYS[date.getDay()]}</h4>
    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
    <p>${Math.round(day.main.temp_max)}° / ${Math.round(day.main.temp_min)}°</p>
`;
    forecastContainer.appendChild(card);
  });
}

function updateTime() {
  const now = new Date();
  lastUpdated.textContent =
    "Updated: " +
    now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
    currentWeatherData = `
    City: ${data.name}
    Weather: ${data.weather[0].description}
    Temperature: ${data.main.temp}°C
    Humidity: ${data.main.humidity}%
    Wind Speed: ${data.wind.speed} m/s`;
    console.log(data);
    renderWeather(data);
    saveSearch(city);
    await fetchForecast(city);
    await fetchAQI(data.coord.lat, data.coord.lon);
    await fetchNews(city);
  } catch (error) {
    console.log(error);
    showError("Failed to fetch weather data");
  }
}

function renderAQI(data) {
  const level = data.list[0].main.aqi;
  const levels = {
    1: "😊 Good",
    2: "🙂 Fair",
    3: "😐 Moderate",
    4: "😷 Poor",
    5: "🤢 Very Poor",
  };
  aqiContainer.innerHTML = `
  <div class="aqi-card">
  <p class="section-title">AIR QUALITY</p>
  <h2>${levels[level]}</h2>
  <p>AQI Level : ${level}</p>
  </div>
  `;
  }

async function fetchAQI(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    );
    const data = await response.json();
    currentAQIData = data;
    renderAQI(data);
    console.log("AQI:", data);
  } catch (error) {
    console.log(error);
  }
}

async function fetchForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
    );
    const data = await response.json();
    currentForecastData = `
    Today: ${data.list[0].weather[0].description}
    Tomorrow: ${data.list[8].weather[0].description}
    Day After Tomorrow: ${data.list[16].weather[0].description}`;
    renderForecast(data);
    console.log(data.list[0]);
    console.log(data.list[8]);
    console.log(data.list[16]);
    console.log("Forecast Data:", data);
    console.log(data.list.length);
  } catch (error) {
    console.log(error);
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

askAiBtn.addEventListener("click", () => {
  const question = aiInput.value.trim();
  if (question) {
    askAI(question);
  }
});

async function askAI(question) {
  try {
    aiResponse.innerHTML = "<p>Thinking...</p>";
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "system",
              content: `
Current Weather:
${currentWeatherData}
Forecast:
${currentForecastData}
AQI:
${currentAQIData?.list?.[0]?.main?.aqi || "Not Available"}
AQI Scale:
1 = Good
2 = Fair
3 = Moderate
4 = Poor
5 = Very Poor
Answer weather-related questions using this data.
Do not use markdown symbols like **, ###, or bullet formatting.
Give clean, simple answers.
`,
            },
            {
              role: "user",
              content: question,
            },
          ],
        }),
      },
    );

    const data = await response.json();
    console.log("AI Response:", data);
    const reply =
      data?.choices?.[0]?.message?.content || "No response received.";
    aiResponse.innerHTML = `
      <div style="text-align:left; line-height:1.7;">
        ${reply.replace(/\n/g, "<br>")}
      </div>
    `;
  } catch (error) {
    console.log("AI Error:", error);
    aiResponse.innerHTML = `
      <p>Failed to contact AI.</p>
    `;
  }
}
renderChips();
fetchNews();
