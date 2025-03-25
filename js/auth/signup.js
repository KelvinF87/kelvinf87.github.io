import * as authService from "../services/authService.js";

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const data = await authService.signup(name, email, password);
             // Store the auth token in localStorage
             // localStorage.setItem("authToken", data.authToken);
            // Redirect to login page or main page
            window.location.href = "login.html";
        } catch (error) {
            console.error("Signup failed:", error);
            // Display the error message to the user
            alert("Signup failed. Please check the details.");
        }
    });
});