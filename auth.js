// Redirect users if not logged in
if (!localStorage.getItem("userEmail")) {
    window.location.href = "login.html";
}
