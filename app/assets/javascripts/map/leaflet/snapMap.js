import store from '../store.js'
import L from 'leaflet'
import 'leaflet.locatecontrol'
import './leaflet-slider.js'

// This is where we set up the Leaflet map.

function readyMap() {

  let map;

  // If the div#map element exists, we'll spin up a Leaflet map and append it.
  const mapspot = document.querySelector('div#map');
  if (mapspot instanceof Element) {
    // Dump the initial state from the store.
    // We'll use these values to initialize the map.
    const initial_dump = store.getState();

    // Get the initial latitude and longitude for the map.
    const default_coordinates = [initial_dump.location.latitude, initial_dump.location.longitude];

    // Uses Leaflet to initialize the map.
    // We'll add Controls later, but this is where we start.
    // Basic overview available here:
    // http://leafletjs.com/examples/quick-start/
    map = L.map('map', {zoomControl: false}).setView(default_coordinates, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 17
    }).addTo(map);

    // Manually place the zoom control.
    var zoomControl = L.control.zoom({
      position: 'bottomright',
      zoomInTitle: gon.map_controls.zoom_in,
      zoomOutTitle: gon.map_controls.zoom_out,
      zoomInText: '&#xf00e;',
      zoomOutText: '&#xf010;'
    });
    map.addControl(zoomControl);

    // Get the initial radius from the store.
    const initial_radius = initial_dump.radius.length;

    // Add the slider to the map for controlling the radius
    // of the coverage area.
    var radiusSlider = L.control.slider(function(value){
      store.dispatch({
        type: 'CHANGE_RADIUS',
        radius: {
          length: value,
        }
      });
    }, {
      size: '200px',
      min: 100,
      max: 50000,
      value: initial_radius,
      step: 100,
      collapsed: false,
      orientation: "vertical",
      position: "topleft",
      getValue: function(value) { return (value/1000).toFixed(1) },
      syncSlider: true,
      increment: true,
      incrementUp: '&#xf065;',
      incrementUpTitle: gon.map_controls.radius_up,
      incrementDown: '&#xf066;',
      incrementDownTitle: gon.map_controls.radius_down,
      showValue: true,
      showValueTitle: gon.map_controls.radius_value,
      title: gon.map_controls.radius_slider
    });
    map.addControl(radiusSlider);

    // Add the geo-locator to the map.
    // Will ask user for permissions to get location from device.
    L.control.locate({
      position: "bottomright",
      drawCircle: false,
      icon: "icon-crosshairs",
      iconLoading: "icon-clock-o",
      showPopup: false,
      keepCurrentZoomLevel: true,
      strings: {
        title: gon.map_controls.geolocator
      }
    }).addTo(map);

    // Watch Redux and relocate the map whenever the user inputs a new place via the form.
    // More on our Redux store can be found in ./store.js.
    // More on the subscribe() method here:
    // http://redux.js.org/docs/api/Store.html#subscribe
    store.subscribe(() => {
      // First get the current state of the store and put it into dump.
      let dump = store.getState();
      // Next ask the map for the coordinates of the map's current location.
      let currentLatLng = map.getCenter();
      // If the Redux store's location coordinates are not null...
      if ((dump.location.latitude !== null) && (dump.location.longitude !== null)) {
        // And if either the latitude or longitude between map and store differ...
        if ((dump.location.latitude !== currentLatLng.lat) || (dump.location.longitude !== currentLatLng.lng)) {
          // Then move the map to the new location reported by the store.
          map.panTo(new L.LatLng(dump.location.latitude, dump.location.longitude));
        }
      }
    });

    // Draws a circle at the center of the map, with the radius coming out of the store.
    let coverageArea = L.circle(map.getCenter(), initial_radius).addTo(map);

    // Ensures the circle's radius always matches the store.
    store.subscribe(() => {
      let dump = store.getState();
      let currentRadius = coverageArea.getRadius();
      if (dump.radius.length !== currentRadius) {
        coverageArea.setRadius(dump.radius.length);
      };
    });

    // Ensures the search area is always at the center of the map.
    // The user can enter a location via the form field, but we also want to let them move the map manually.
    // Regardless their choice, the store should always have the map's current coordinates.
    function applyCenterToCoverageArea(e) {
      let dump = store.getState();
      let currentLatLng = map.getCenter();
      // The search radius circle should always be drawn in the center of the map. Nothing fancy needed here.
      coverageArea.setLatLng(currentLatLng);
      // If the store and map differ on the corrdinates, we need to update the store.
      if ((dump.location.latitude !== currentLatLng.lat) || (dump.location.longitude !== currentLatLng.lng)) {
        // Updates the store.
        // The 'CHANGE_LOCATION' reducer can be found in ./store.js.
        // More on dispatch():
        // http://redux.js.org/docs/api/Store.html#dispatch
        store.dispatch({
          type: 'CHANGE_LOCATION',
          location: {
            name: "",
            latitude: currentLatLng.lat,
            longitude: currentLatLng.lng
          }
        });
      };
    };

    // Whenever the map stops moving, check the map's coordinates against the store.
    // More on Leaflet events:
    // http://leafletjs.com/reference.html#map-events
    map.on('move', applyCenterToCoverageArea);
  };

  return map;
}

// Fire up the map as soon as the store says the DOM is ready.
//store.subscribe(() => {
//  let dump = store.getState();
//  if (dump.map_ready == true) {
//    readyMap();
//  }
//});

export default readyMap;
