// js/services/userService.js
import { API_ENDPOINT } from "../config/api.js";

// Verify Token
export async function verifyToken(token) {
  try {
    const response = await fetch(`${API_ENDPOINT}/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Token verification failed: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text(); // Get the response as text
      console.error("Unexpected response:", text);
      throw new Error(
        "Invalid JSON response from server. Check server logs."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
}

// Update User
export async function updateUser(userId, data, token) {
    try {
      const response = await fetch(`${API_ENDPOINT}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`User update failed: ${response.status}`);
      }
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text(); // Get the response as text
        console.error("Unexpected response:", text);
        throw new Error(
          "Invalid JSON response from server. Check server logs."
        );
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
  
export async function getUser(userId, token) {
    try {
      const response = await fetch(`${API_ENDPOINT}/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to get user: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }