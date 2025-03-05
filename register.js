document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let fullName = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let selectedAlerts = [];

    document.querySelectorAll(".checkbox-group input:checked").forEach(checkbox => {
        selectedAlerts.push(checkbox.value);
    });

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        let userData = {
            fullName: fullName,
            email: email,
            alerts: selectedAlerts,
            latitude: lat,
            longitude: lon,
            timestamp: new Date().toISOString()
        };

        // Send user data to the backend
        await fetch("https://your-backend-url.com/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        alert("✅ Registered successfully! You will receive alerts in your area.");
    });
});
