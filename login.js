document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let email = document.getElementById("loginEmail").value;

    // Send email to the backend to check if user exists
    let response = await fetch("https://your-backend-url.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    });

    let result = await response.json();

    if (result.success) {
        localStorage.setItem("userEmail", email);
        window.location.href = "dashboard.html"; // Redirect to alerts dashboard
    } else {
        alert("❌ User not found! Please register.");
    }
});
