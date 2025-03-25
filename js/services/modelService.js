import { API_ENDPOINT } from "../config/api.js";

export async function getModels(token) {
  const response = await fetch(`${API_ENDPOINT}/modelos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Get models failed: ${response.status}`);
  }

  return await response.json();
}