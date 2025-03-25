// settings.js
import * as userService from "./services/userService.js";
import * as modelService from "./services/modelService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const settingsContent = document.getElementById("settings-content");

  // Check if the user is authenticated
  const token = localStorage.getItem("authToken");
  if (!token) {
    // No token, redirect to login
    window.location.href = "login.html";
    return;
  }

  try {
    // Verify the token
    const user = await userService.verifyToken(token);
    if (!user) {
      // Token is invalid
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
      return;
    }
    displaySettings(user);
  } catch (error) {
    console.error("Token verification failed:", error);
    // Token verification failed, redirect to login
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
    return;
  }

  async function displaySettings(user) {
    let settingsHTML = `
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700">User Profile</h2>
        <div>
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input type="text" id="name" value="${user.name}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <p class="text-gray-700 text-sm">Email: ${user.email}</p>

        <h2 class="text-xl font-semibold text-gray-700">AI Model Selection</h2>
        <div>
          <label for="ai-model" class="block text-gray-700 text-sm font-bold mb-2">Select AI Model:</label>
          <select id="ai-model" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">`;

    try {
      const models = await modelService.getModels(token); // Assuming getModels API exists
      models.forEach((model) => {
        settingsHTML += `<option value="${model._id}" ${
          model._id === user.idprompt ? "selected" : ""
        }>${model.name}</option>`; // Assuming idprompt holds the model ID
      });
    } catch (modelError) {
      console.error("Error fetching models:", modelError);
      settingsHTML += `<option value="" disabled>Error loading models</option>`;
    }

    settingsHTML += `
          </select>
        </div>
        <button id="save-settings" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save Settings</button>
      </div>
    `;

    settingsContent.innerHTML = settingsHTML;

    // Add event listener for saving settings
    document
      .getElementById("save-settings")
      .addEventListener("click", async () => {
        const selectedModelId = document.getElementById("ai-model").value;
        const newName = document.getElementById("name").value; // Get the new name

        try {
          // Update user settings
          const updatedUser = await userService.updateUser(
            user._id,
            { idprompt: selectedModelId, name: newName }, // Include the new name in the update
            token
          ); // Pass the token
          showNotification('Cambio realizado! Por razones de seguridad, debe volver a iniciar sesión para ver los cambios.', 'green');

          // Optionally refresh the page or update the UI
          // window.location.reload();
        } catch (updateError) {
          console.error("Error updating user settings:", updateError);
          showNotification('Error saving settings.', 'red');

        }
      });
  }

    // Function to show a modern notification
    function showNotification(message, color) {
    const notificationDiv = document.createElement('div');
    notificationDiv.classList.add(
        'fixed',
        'top-0',
        'isolate',
        'flex',
        'items-top',
        'gap-x-6',
        'overflow-hidden',
        'bg-gray-50',
        'px-6',
        'py-2.5',
        'sm:px-3.5',
        'transition-opacity',
        'duration-500',
        'ease-in-out',
        'opacity-100', // Initially visible
        'border-2',
        (color === 'green' ? 'border-green-500' : 'border-red-500')
    );
    notificationDiv.style.backgroundColor = color === 'green' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'; // Light background based on color

    notificationDiv.innerHTML = `
        <div class="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
            <div class="aspect-577/310 w-[36.0625rem] bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"></div>
        </div>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p class="text-sm/6 text-gray-900">
                <strong class="font-semibold">${message}</strong>
            </p>
        </div>
        <div class="flex flex-1 justify-end">
            <button type="button" class="notification-close -m-3 p-3 focus-visible:outline-offset-[-4px]">
                <span class="sr-only">Dismiss</span>
                <svg class="size-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
            </button>
        </div>
    `;

    // Add close functionality
    notificationDiv.querySelector('.notification-close').addEventListener('click', () => {
        notificationDiv.style.opacity = '0';
        setTimeout(() => notificationDiv.remove(), 500); // Remove after fade out
    });

    document.body.appendChild(notificationDiv);

    // Fade out after 5 seconds (4500ms for visibility + 500ms for fade-out)
    setTimeout(() => {
        notificationDiv.style.opacity = '0';
        setTimeout(() => notificationDiv.remove(), 500); // Remove after fade out
    }, 4500);
}
});