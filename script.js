console.log("Start Weather Watcher...");

const output = document.getElementById("app");

// ------------------------------------------------------------------------------------------------
// this is old way of doing async operations
// Simulate async fetches using callbacks
// the callback is a function that will be called after the async operation is complete
// hard to read and maintain
// cause of callback hell
function getCity(callback) {
  setTimeout(() => {
    console.log("Fetched city.");
    callback("Bangalore");
  }, 1000);
}

// the callback is a function that will be called after the async operation is complete
function getCoordinates(city, callback) {
  setTimeout(() => {
    console.log(`Got coordinates for ${city}.`);
    callback({ lat: 12.97, lon: 77.59 });
  }, 1000);
}

// the callback is a function that will be called after the async operation is complete
function getWeather(coords, callback) {
  setTimeout(() => {
    console.log(`Weather fetched for (${coords.lat}, ${coords.lon}).`);
    callback("🌤️ 28°C and sunny");
  }, 1000);
}

getCity((city) => {
  getCoordinates(city, (coords) => {
    getWeather(coords, (weather) => {
      console.log("\n\n callbacks");
      console.log(weather);
    });
  });
});
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// this is the new way of doing async operations
// using promises
function getCityPromise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Fetched city.");
      return resolve("Bangalore");
    }, 1000);
  });
}

// the callback is a function that will be called after the async operation is complete
function getCoordinatesPromise(city) {
  return new Promise((resolve, reject) => {
    if (!city) {
      return reject("City not found");
    }

    setTimeout(() => {
      console.log(`Got coordinates for ${city}.`);
      return resolve({ lat: 12.97, lon: 77.59 }); // or in failure reject({ error: "Failed to get coordinates" });
    }, 1000);
  });
}

// the callback is a function that will be called after the async operation is complete
function getWeatherPromise(coords) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Weather fetched for (${coords.lat}, ${coords.lon}).`);
      resolve("🌤️ 28°C and sunny");
    }, 1000);
  });
}

getCityPromise()
  .then((city) => {
    return getCoordinatesPromise(city);
  })
  .then((coords) => {
    return getWeatherPromise(coords);
  })
  .then((weather) => {
    console.log("\n\n promises");
    console.log(weather);
  })
  .catch((error) => {
    // in this case, the error is not being thrown, but we haven't
    // used reject in the above promises
    console.error("error", error);
  });

// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------

// now comes the synthetic sugar for promises
// async/await
async function getCityAsync() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Fetched city.");
      return resolve("Bangalore");
    }, 1000);
  });
}

async function getCoordinatesAsync(city) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Got coordinates for ${city}.`);
      return resolve({ lat: 12.97, lon: 77.59 });
    }, 1000);
  });
}

async function getWeatherAsync(coords) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Weather fetched for (${coords.lat}, ${coords.lon}).`);
      return resolve("🌤️ 28°C and sunny");
    }, 1000);
  });
}

async function main() {
  // we can directly call our promise functions using await
  const city = await getCityAsync();
  const coords = await getCoordinatesAsync(city);
  const weather = await getWeatherAsync(coords);

  console.log("\n\n async await");
  console.log(weather);
}

main();
// ------------------------------------------------------------------------------------------------

const API_KEY = ""; // Replace this with your key

function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Weather data not found");
      }
      return response.json();
    })
    .then((data) => {
      const { coord } = data;
      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`
      );
    })
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      throw new Error("Weather data not found");
    });
}

// Call the function
getWeatherByCity("Bangalore")
  .then((data) => {
    console.log(data);
    const cityName = data.name;
    const country = data.sys.country;
    const temp = data.main.temp;
    const tempMin = data.main.temp_min;
    const tempMax = data.main.temp_max;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const windSpeed = data.wind.speed;

    // Sunrise & sunset
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    output.innerHTML = `
      <h2>${cityName}, ${country}</h2>
      <img src="${iconUrl}" alt="${description}" />
      <p><strong>${description.toUpperCase()}</strong></p>
      <p>🌡️ Temp: ${temp}°C (min: ${tempMin}°C, max: ${tempMax}°C)</p>
      <p>💨 Wind: ${windSpeed} m/s</p>
      <p>🌅 Sunrise: ${sunrise}</p>
      <p>🌇 Sunset: ${sunset}</p>
    `;
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
