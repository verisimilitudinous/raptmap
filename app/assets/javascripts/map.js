import readyApp from './map/react/readyApp.jsx'

// Initialize the React app (readyApp).
function startApp() {
  readyApp();
}

// Trigger it when the DOM is finished loading.
document.addEventListener("DOMContentLoaded", startApp, false);
