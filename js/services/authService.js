import { API_ENDPOINT, setNextBackupAPI } from "../config/api.js";

// Función para realizar las llamadas a la API
const apiCall = async (url, options, timeout = 5000) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort(); // Aborta la solicitud después de [timeout] ms
            console.warn(`Request timed out after ${timeout}ms at ${url}`);
        }, timeout);

        const response = await fetch(url, {
            ...options,
            signal: controller.signal, // Asocia la señal al fetch
        });

        clearTimeout(timeoutId); // Limpia el timeout si la solicitud se completa a tiempo

        if (!response.ok) {
            console.warn(`API request failed with status ${response.status} at ${url}`);
            throw new Error(`API request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        // Intenta con la siguiente URL de respaldo
        setNextBackupAPI();
        console.log(`Attempting request with next API endpoint: ${API_ENDPOINT}`); // Debug
        throw error; // Relanza el error para que se maneje en la función que llama a apiCall
    }
};

export async function login(email, password) {
    try {
        return await apiCall(`${API_ENDPOINT}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
    } catch (error) {
        console.error("Login failed:", error);
        throw error; // Propaga el error para que se maneje en el componente
    }
}

export async function signup(name, email, password) {
    try {
        return await apiCall(`${API_ENDPOINT}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, roles: "user", prompt: "DefaultPrompt", active: true, img: "URL to your image" }),
        });
    } catch (error) {
        console.error("Signup failed:", error);
        throw error; // Propaga el error para que se maneje en el componente
    }
}

export async function verifyToken(token) {
    try {
        return await apiCall(`${API_ENDPOINT}/auth/verify`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Token verification failed:", error);
        throw error; // Propaga el error para que se maneje en el componente
    }
}