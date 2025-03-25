import { API_ENDPOINT } from "../config/api.js";

export async function login(email, password) {
  const response = await fetch(`${API_ENDPOINT}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return await response.json();
}

export async function signup(name, email, password) {
  const response = await fetch(`${API_ENDPOINT}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, roles: "user", prompt: "DefaultPrompt", active: true, img: "URL to your image" }),
  });

  if (!response.ok) {
    throw new Error(`Signup failed: ${response.status}`);
  }

  return await response.json();
}

export async function verifyToken(token) {
  const response = await fetch(`${API_ENDPOINT}/auth/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Token verification failed: ${response.status}`);
  }

  return await response.json();
}