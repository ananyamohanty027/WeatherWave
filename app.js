const apiKey = "2243618f45e024a907aea7bf9e505eb5";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const voiceBtn = document.getElementById("mic-btn");
const weatherIcon = document.querySelector(".weather-icon");
const videoElement = document.getElementById('background-video'); // Video element reference

// Function to check weather
async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    
        // Change weather icon and background video based on the weather condition
        let weatherCondition = data.weather[0].main;
        let videoSource = '';

        if (weatherCondition === "Clouds") {
            weatherIcon.src = "clouds.png";
            videoSource = "cloudy.mp4";  // Set the background video for clouds
        } else if (weatherCondition === "Clear") {
            weatherIcon.src = "clear.png";
            videoSource = "clear.mp4";  // Set the background video for clear/sunny weather
        } else if (weatherCondition === "Rain") {
            weatherIcon.src = "rain.png";
            videoSource = "rain.mp4";  // Set the background video for rain
        } else if (weatherCondition === "Drizzle") {
            weatherIcon.src = "drizzle.png";
            videoSource = "drizzle.mp4";  // Set the background video for drizzle
        } else if (weatherCondition === "Mist") {
            weatherIcon.src = "mist.png";
            videoSource = "mist.mp4";  // Set the background video for mist
        }

        // Update video source
        const sourceElement = document.createElement('source');
        sourceElement.src = videoSource;
        sourceElement.type = 'video/mp4';
        videoElement.innerHTML = ''; // Clear existing sources
        videoElement.appendChild(sourceElement);
        videoElement.load(); // Load the new video source
        videoElement.play(); // Play the video

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

// Event listener for the search button
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Event listener for "Enter" key press in the input field
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});
voiceBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const city = event.results[0][0].transcript;
        searchBox.value = city;
        checkWeather(city);
    };

    recognition.onerror = (event) => {
        alert("Voice recognition error: " + event.error);
    };

    recognition.start();
});