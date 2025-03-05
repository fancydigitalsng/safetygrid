const alertFeed = document.getElementById("alertFeed");

function fetchAlerts() {
    firebase.firestore().collection("emergencyReports").orderBy("timestamp", "desc").limit(5)
        .onSnapshot((snapshot) => {
            alertFeed.innerHTML = "";
            snapshot.forEach((doc) => {
                const data = doc.data();
                alertFeed.innerHTML += `
                    <div class="alert">
                        <p><strong>${data.description}</strong></p>
                        ${data.mediaURL ? `<img src="${data.mediaURL}" width="100%">` : ""}
                        <small>Reported at: ${new Date(data.timestamp?.toDate()).toLocaleString()}</small>
                    </div>
                `;
            });
        });
}

fetchAlerts();

// Location based alert //
document.addEventListener("DOMContentLoaded", () => {
    const alertFeed = document.getElementById("alertFeed");

    // Function to fetch alerts based on user's location
    function fetchAlerts(city, state) {
        firebase.firestore().collection("emergencyReports")
            .where("city", "==", city)  // Show only alerts from user's city
            .where("state", "==", state)
            .orderBy("timestamp", "desc")
            .limit(5)
            .onSnapshot((snapshot) => {
                alertFeed.innerHTML = "";
                if (snapshot.empty) {
                    alertFeed.innerHTML = "<p>No alerts in your area.</p>";
                } else {
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        alertFeed.innerHTML += `
                            <div class="alert">
                                <p><strong>${data.description}</strong></p>
                                ${data.mediaURL ? `<img src="${data.mediaURL}" width="100%">` : ""}
                                <small>Reported at: ${new Date(data.timestamp?.toDate()).toLocaleString()}</small>
                            </div>
                        `;
                    });
                }
            });
    }

    // Get User's Location
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Reverse geocode using OpenStreetMap
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                    .then(response => response.json())
                    .then(data => {
                        const city = data.address.city || data.address.town || data.address.village || "Unknown";
                        const state = data.address.state || "Unknown";
                        console.log(`User is in: ${city}, ${state}`);
                        fetchAlerts(city, state);
                    })
                    .catch(error => {
                        console.error("Error getting location:", error);
                        alertFeed.innerHTML = "<p>Could not detect location.</p>";
                    });
            }, () => {
                alertFeed.innerHTML = "<p>Location access denied. Showing all alerts.</p>";
                fetchAlerts("All", "All");  // Default to all alerts if location is denied
            });
        } else {
            alertFeed.innerHTML = "<p>Geolocation not supported by your browser.</p>";
        }
    }

    getUserLocation();
});

// Map Functionality
// Initialize Map
function initMap() {
    var map = L.map('alertMap').setView([9.082, 8.6753], 6); // Default: Nigeria

    // OpenStreetMap Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Load Emergency Reports from Firestore
    firebase.firestore().collection("emergencyReports")
        .onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                let data = doc.data();
                if (data.latitude && data.longitude) {
                    L.marker([data.latitude, data.longitude])
                        .addTo(map)
                        .bindPopup(`<strong>${data.description}</strong><br>${data.city}, ${data.state}`);
                }
            });
        });
}

// Run map when page loads
document.addEventListener("DOMContentLoaded", initMap);
