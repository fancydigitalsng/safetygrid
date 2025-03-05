// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("subscribers");

// 📢 Handle Subscription Form
document.getElementById("subscribe-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const statusMessage = document.getElementById("status-message");

    if (name === "" || email === "") {
        statusMessage.textContent = "Please fill in all fields.";
        statusMessage.style.color = "red";
        return;
    }

    // Save to Firebase
    db.push({
        name: name,
        email: email,
        timestamp: new Date().toISOString()
    }).then(() => {
        statusMessage.textContent = "Subscribed successfully!";
        statusMessage.style.color = "green";
        document.getElementById("subscribe-form").reset();
    }).catch((error) => {
        statusMessage.textContent = "Error subscribing. Try again.";
        statusMessage.style.color = "red";
    });
});
