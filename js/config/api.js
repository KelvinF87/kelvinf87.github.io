const API_ENDPOINT_PRIMARY =  "http://localhost:5005/api";
const API_ENDPOINT_SECONDARY = "https://serviairemote.onrender.com/api";
const API_ENDPOINT_TERTIARY = "http://docentek.ddns.net:5005/api";

let API_ENDPOINT = API_ENDPOINT_SECONDARY; // Inicialmente usa la URL primaria
let currentEndpointIndex = 0; // Índice del endpoint actual en uso

const API_ENDPOINTS = [
    API_ENDPOINT_TERTIARY,
    API_ENDPOINT_SECONDARY,
    API_ENDPOINT_PRIMARY,
];

// Función para cambiar la URL de forma global (por si detectas un fallo en tiempo de ejecución)
export const setNextBackupAPI = () => {
    currentEndpointIndex = (currentEndpointIndex + 1) % API_ENDPOINTS.length; // Avanza al siguiente endpoint
    API_ENDPOINT = API_ENDPOINTS[currentEndpointIndex];
    console.warn(`Switching to API endpoint: ${API_ENDPOINT}`);
};

export { API_ENDPOINT };