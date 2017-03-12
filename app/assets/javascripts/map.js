import readyMap from './map/snapMap.js'
import readyApp from './map/readyApp.jsx'

// Initialize both the React app (readyApp) and the Leaflet map (readyMap).
function startApp() {
  readyApp();
  readyMap();
}

// Trigger it when the DOM is finished loading.
document.addEventListener("DOMContentLoaded", startApp, false);
