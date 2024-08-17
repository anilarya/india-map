import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Map() {
    const [weatherData, setWeatherData] = useState([]);

    const cities = [
        { name: 'New Delhi', lat: 28.6139, long: 77.209 },
        { name: 'Mumbai', lat: 19.076, long: 72.8777 }, // Maharashtra
        { name: 'Bangalore', lat: 12.9716, long: 77.5946 }, // Karnataka
        { name: 'Chennai', lat: 13.0827, long: 80.2707 }, // Tamil Nadu
        { name: 'Kolkata', lat: 22.5726, long: 88.3639 }, // West Bengal
        { name: 'Hyderabad', lat: 17.385, long: 78.4867 }, // Telangana
        { name: 'Jaipur', lat: 26.9124, long: 75.7873 }, // Rajasthan
        { name: 'Lucknow', lat: 26.8467, long: 80.9462 }, // Uttar Pradesh
        { name: 'Bhopal', lat: 23.2599, long: 77.4126 }, // Madhya Pradesh
        { name: 'Gandhinagar', lat: 23.2156, long: 72.6369 }, // Gujarat
        { name: 'Bhubaneswar', lat: 20.2961, long: 85.8245 }, // Odisha
        { name: 'Chandigarh', lat: 30.7333, long: 76.7794 }, // Chandigarh
        { name: 'Dehradun', lat: 30.3165, long: 78.0322 }, // Uttarakhand
        { name: 'Shimla', lat: 31.1048, long: 77.1734 }, // Himachal Pradesh
        { name: 'Thiruvananthapuram', lat: 8.5241, long: 76.9366 }, // Kerala
        { name: 'Patna', lat: 25.5941, long: 85.1376 }, // Bihar
        { name: 'Ranchi', lat: 23.3441, long: 85.3096 }, // Jharkhand
        { name: 'Raipur', lat: 21.2514, long: 81.6296 }, // Chhattisgarh
        { name: 'Panaji', lat: 15.4909, long: 73.8278 }, // Goa
        { name: 'Shillong', lat: 25.5788, long: 91.8933 }, // Meghalaya
        { name: 'Aizawl', lat: 23.7271, long: 92.7176 }, // Mizoram
        { name: 'Imphal', lat: 24.817, long: 93.9368 }, // Manipur
        { name: 'Agartala', lat: 23.8315, long: 91.2868 }, // Tripura
        { name: 'Kohima', lat: 25.6751, long: 94.1086 }, // Nagaland
        { name: 'Itanagar', lat: 27.0844, long: 93.6053 }, // Arunachal Pradesh
        { name: 'Gangtok', lat: 27.3314, long: 88.6138 }, // Sikkim
        { name: 'Dispur', lat: 26.1408, long: 91.7898 }, // Assam
        { name: 'Puducherry', lat: 11.9416, long: 79.8083 }, // Puducherry
        { name: 'Srinagar', lat: 34.0837, long: 74.7973 }, // Jammu and Kashmir
        { name: 'Leh', lat: 34.1526, long: 77.5771 } // Ladakh
    ];

    const fetchWeatherData = async () => {
        try {
            const responses = await Promise.all(
                cities.map(city =>
                    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.name},IN&units=metric&appid=97ed7afbc7cd322f478581ebb18ab89d`)
                )
            );
            const data = responses.map((response, index) => ({
                name: cities[index].name,
                latitude: cities[index].lat,
                longitude: cities[index].long,
                temp: response.data.main.temp,
            }));
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    useEffect(() => {
        fetchWeatherData();

        // Set an interval to refresh the data every hour (3600000 ms)
        const intervalId = setInterval(fetchWeatherData, 3600000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const d3 = window.d3;
        const Datamap = window.Datamap;

        if (weatherData.length) {
            document.getElementById('india').innerHTML = ''; // Clear the previous map before re-rendering

            var bubble_map = new Datamap({
                element: document.getElementById('india'),
                scope: 'india',
                geographyConfig: {
                    popupOnHover: true,
                    highlightOnHover: true,
                    borderColor: '#444',
                    borderWidth: 0.5,
                    dataUrl: 'https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json'
                },
                fills: {
                    'MAJOR': '#306596',
                    'MEDIUM': '#0fa0fa',
                    'MINOR': '#bada55',
                    'HOT': '#ff0000', // Red for high temperature
                    defaultFill: '#dddddd'
                },
                setProjection: function (element) {
                    var projection = d3.geo.mercator()
                        .center([78.9629, 23.5937]) // always in [East Latitude, North Longitude]
                        .scale(1000);
                    var path = d3.geo.path().projection(projection);
                    return { path: path, projection: projection };
                }
            });

            // Calculate min and max temperatures
            const temps = weatherData.map(city => city.temp);
            const minTemp = Math.min(...temps);
            const maxTemp = Math.max(...temps);

            // Prepare bubbles data with relative radius and color
            const bubbles = weatherData.map(city => ({
                name: city.name,
                latitude: city.latitude,
                longitude: city.longitude,
                radius: 5 + (city.temp - minTemp) / (maxTemp - minTemp) * 15, // Relative radius based on temperature
                fillKey: city.temp > 30 ? 'HOT' : 'MEDIUM', // Red for hot temperatures
                temp: city.temp,
            }));

            bubble_map.bubbles(bubbles, {
                popupTemplate: function (geo, data) {
                    return `<div class="hoverinfo">${data.name}: ${data.temp}°C</div>`;
                }
            });
        }
    }, [weatherData]);

    return (
        <div style={containerStyle}>
            <div style={sidebarStyle}>
                <h2>Weather Information</h2>
                <div style={cityListStyle}>
                    {weatherData.map(city => (
                        <div key={city.name} style={cityInfoStyle}>
                            <strong>{city.name}</strong>: {city.temp}°C
                        </div>
                    ))}
                </div>
            </div>
            <div id="india" style={mapStyle}></div>
        </div>
    );
}

const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '20px',
};

const sidebarStyle = {
    width: '250px',
    marginRight: '20px',
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: '0',
    bottom: '0',
    overflowY: 'auto',
};

const cityListStyle = {
    maxHeight: 'calc(100vh - 60px)', // Adjust based on header/footer heights if any
    overflowY: 'auto',
};

const mapStyle = {
    height: '600px',
    width: '900px',
    margin: '0 auto',
    marginLeft: '270px', // Account for the fixed sidebar width
};

const cityInfoStyle = {
    margin: '10px 0',
    fontSize: '16px',
};
