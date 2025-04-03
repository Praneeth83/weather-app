import React, { useEffect, useState } from "react";
import MapApp from "./Maps";

const App = () => {
  const [lat, setLat] = useState("17.686815");
  const [lon, setLon] = useState("83.218483");
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const search = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=f469312328e97bb6016d3491e526a629`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setCity(data.name);
        setWeatherData(data ? data : null);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const searchByCity = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f469312328e97bb6016d3491e526a629`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setWeatherData(data);
        setLat(data.coord.lat);
        setLon(data.coord.lon);
      } else {
        setWeatherData(null);
      }
    } catch (err) {
      console.error(err);
      setWeatherData(null);
    }
  };
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }

    function success(position) {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
      search(position.coords.latitude, position.coords.longitude);
    }

    function error() {
      console.log("Unable to retrieve your location");
    }
  }
  useEffect(() => {
    search(lat, lon);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchByCity(city);
    setCity("");
  };
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-blue-400">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1500 ease-in-out ${loaded ? "opacity-100" : "opacity-0"
          }`}
        style={{ backgroundImage: "url('https://wallpaperaccess.com/full/104835.jpg')" }}
      ></div>
      <div className="relative z-10">
        <h1 className="text-white text-4xl font-bold mb-10 drop-shadow-lg">Weather App</h1>
        <div className="flex flex-row items-center justify-center w-full gap-8">
          <MapApp search={search} lt={lat} lon={lon} setLat={setLat} setLon={setLon} />
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-80">
            <form onSubmit={handleSubmit} className="w-full">
              <label className="block text-gray-700 font-semibold mb-2">Enter city:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button className="w-full bg-blue-500 text-white mt-4 py-2 rounded-lg hover:bg-blue-700 transition" disabled={!city}>
                Submit
              </button>
            </form>

            {(weatherData !== null) ? (
              <div className="mt-6 text-center">
                <h2 className="text-xl font-bold">{weatherData.name}</h2>
                <p className="text-gray-600">Temperature: {weatherData.main.temp}°C</p>
                <p className="text-gray-600">Weather: {weatherData.weather[0].description}</p>
              </div>
            ) : <div className="mt-6 text-center"><h4 className="text-xl font-bold">City Not Found</h4></div>}
            <button className="w-full bg-green-500 text-white mt-4 py-2 rounded-lg hover:bg-red-700 transition" onClick={getLocation}>
              My Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
