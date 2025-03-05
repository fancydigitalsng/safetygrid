document.addEventListener("DOMContentLoaded", function () {
    // Greet the logged-in user
    let userEmail = localStorage.getItem("userEmail");
    document.getElementById("userGreeting").textContent = "Hello, " + userEmail;

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("userEmail");
        window.location.href = "login.html";
    });

    // Load alerts from API (Dummy data for now)
    let alertsList = document.getElementById("alertsList");
    alertsList.innerHTML = `
        <div class="alert-card">🚔 Crime Reported: Armed Robbery at Main Street</div>
        <div class="alert-card">🚑 Accident: Car crash on Highway 12</div>
        <div class="alert-card">🔥 Fire: Building on fire at Downtown</div>
    `;
});

document.addEventListener("DOMContentLoaded", function () {
    let username = localStorage.getItem("userName");
    let userCity = localStorage.getItem("userCity");
    let userState = localStorage.getItem("userState");

    document.getElementById("username").innerText = username;
    document.getElementById("userLocation").innerText = userCity + ", " + userState;

    // Now, filter alerts based on user location (COMING NEXT!)
});

function fetchAlerts() {
    let userCity = localStorage.getItem("userCity");
    let userState = localStorage.getItem("userState");

    fetch("https://api.safetygrid.com/alerts")
        .then(response => response.json())
        .then(data => {
            let filteredAlerts = data.filter(alert => 
                alert.city.toLowerCase() === userCity.toLowerCase() && 
                alert.state.toLowerCase() === userState.toLowerCase()
            );

            displayAlerts(filteredAlerts);
        })
        .catch(error => console.error("Error fetching alerts:", error));
}

function fetchLiveLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updateAlerts, error);
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    function updateAlerts(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let geocodeURL = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=YOUR_API_KEY`;

        fetch(geocodeURL)
            .then(response => response.json())
            .then(data => {
                let city = data.address.city || data.address.town || "Unknown City";
                let state = data.address.state || "Unknown State";

                document.getElementById("userLocation").innerText = city + ", " + state;

                // Fetch alerts for this location
                fetchAlerts(city, state);
            })
            .catch(error => console.error("Error fetching location:", error));
    }

    function fetchAlerts(city, state) {
        fetch("https://api.safetygrid.com/alerts")
            .then(response => response.json())
            .then(data => {
                let filteredAlerts = data.filter(alert => 
                    alert.city.toLowerCase() === city.toLowerCase() && 
                    alert.state.toLowerCase() === state.toLowerCase()
                );

                displayAlerts(filteredAlerts);
            })
            .catch(error => console.error("Error fetching alerts:", error));
    }

    function error() {
        alert("Unable to retrieve your live location. Using registered location instead.");
    }

    document.addEventListener("DOMContentLoaded", fetchLiveLocation);

    function fetchLiveLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updateAlerts, error);
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    function updateAlerts(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let geocodeURL = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=YOUR_API_KEY`;

        fetch(geocodeURL)
            .then(response => response.json())
            .then(data => {
                let city = data.address.city || data.address.town || "Unknown City";
                let state = data.address.state || "Unknown State";

                document.getElementById("userLocation").innerText = city + ", " + state;

                // Fetch alerts for this location
                fetchAlerts(city, state);
            })
            .catch(error => console.error("Error fetching location:", error));
    }

    function fetchAlerts(city, state) {
        fetch("https://api.safetygrid.com/alerts")
            .then(response => response.json())
            .then(data => {
                let filteredAlerts = data.filter(alert => 
                    alert.city.toLowerCase() === city.toLowerCase() && 
                    alert.state.toLowerCase() === state.toLowerCase()
                );

                displayAlerts(filteredAlerts);
            })
            .catch(error => console.error("Error fetching alerts:", error));
    }

    function error() {
        alert("Unable to retrieve your live location. Using registered location instead.");
    }

    document.addEventListener("DOMContentLoaded", fetchLiveLocation);

    // Handle Report form submission //
    