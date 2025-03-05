document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherAlerts();
});

const alertsFeed = document.getElementById("alertsFeed");

async function fetchWeatherAlerts() {
    try {
        let response = await fetch("https://api.weather.gov/alerts/active", {
            headers: {
                "User-Agent": "SafetyGridApp (your-email@example.com)"
            }
        });

        let data = await response.json();

        if (data.alerts && data.alerts.length > 0) {
            data.alerts.slice(0, 5).forEach(alert => {
                addAlert({ message: alert.headline, level: "high" });
            });
        } else {
            addAlert({ message: "✅ No active weather alerts.", level: "low" });
        }
    } catch (error) {
        console.error("Weather API Error:", error);
    }
}

// 🛑 Function to Display Alerts in the UI
function addAlert(alert) {
    let div = document.createElement("div");
    div.classList.add("alert", alert.level);
    div.textContent = alert.message;
    alertsFeed.prepend(div);
}

// 🔄 Fetch Alerts Every 10 Minutes (600,000ms)
setInterval(fetchWeatherAlerts, 600000);


/* Report an emergency */
document.getElementById("alertForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        let alertType = document.getElementById("alertType").value;
        let alertMessage = document.getElementById("alertMessage").value;
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        let alertData = {
            type: alertType,
            message: alertMessage,
            latitude: lat,
            longitude: lon,
            timestamp: new Date().toISOString()
        };

        // Send the alert to the backend
        await fetch("https://your-backend-url.com/api/alerts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alertData)
        });

        alert("🚨 Alert submitted successfully!");
    });
});

// Alert js //
// Initialize EmailJS with your user ID
emailjs.init("safetygrid1@gmail.com"); // Replace with your EmailJS User ID

// Function to send an email alert
function sendAlertEmail(alertType, location, message, userEmail) {
    emailjs.send("service_j5z6gv6", "template_kdaov97", {
        alert_type: alertType,
        location: location,
        message: message,
        user_email: userEmail,
    })
    .then(response => {
        console.log("Email Sent Successfully!", response);
        alert("Emergency Alert Sent!");
    })
    .catch(error => {
        console.error("Email Send Failed:", error);
        alert("Error sending alert!");
    });
}

// Example Usage: Call this function when a user submits an alert
document.getElementById("alertForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let alertType = document.getElementById("alertType").value;
    let location = document.getElementById("location").value;
    let message = document.getElementById("message").value;
    let userEmail = "recipient@example.com"; // Replace with actual user email

    sendAlertEmail(alertType, location, message, userEmail);
});

// Home js
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
