// ================== CONFIG ==================
const apiKey = "444d8c931be54c1eda5dfac12cf82efa";

// ================== GET WEATHER BY CITY ==================
async function getWeather() {
    const city = document.getElementById("cityInput").value;

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        setLoading("Searching...");

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === "404") {
            alert("City not found ❌");
            return;
        }

        updateUI(data);

    } catch (error) {
        showError("Error fetching weather");
    }
}

// ================== GET LOCATION WEATHER ==================
function getLocationWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    setLoading("Getting location...");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        },
        () => {
            alert("Location access denied ❌");
        }
    );
}

// ================== FETCH USING COORDS ==================
async function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        updateUI(data);

    } catch (error) {
        showError("Error fetching location weather");
    }
}

// ================== UI UPDATE FUNCTION ==================
function updateUI(data) {
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temperature").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `${data.main.humidity}%`;
    document.getElementById("wind").innerText = `${data.wind.speed} km/h`;
}

// ================== LOADING STATE ==================
function setLoading(message) {
    document.getElementById("cityName").innerText = message;
    document.getElementById("temperature").innerText = "--";
    document.getElementById("description").innerText = "";
    document.getElementById("humidity").innerText = "";
    document.getElementById("wind").innerText = "";
}

// ================== ERROR HANDLING ==================
function showError(message) {
    alert(message);
    setLoading("Error ❌");
}

// ================== AUTO LOAD LOCATION ==================
window.onload = () => {
    getLocationWeather();
};
