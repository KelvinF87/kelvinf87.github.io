import * as authService from "../services/authService.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const data = await authService.login(email, password);

      // Store the auth token in localStorage
      localStorage.setItem("authToken", data.authToken);

      // Redirect to the main page or user dashboard
      window.location.href = "index.html";
    } catch (error) {
      console.error("Login failed:", error);
      // Display the error message to the user
      alert("Login failed. Check your credentials.");
      // Puedes agregar lógica aquí para rastrear el número de intentos de inicio de sesión
      // y mostrar un mensaje diferente si el usuario ha intentado iniciar sesión demasiadas veces.
    }
  });
});