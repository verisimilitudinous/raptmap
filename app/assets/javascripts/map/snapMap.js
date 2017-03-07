import store from './store.js'
import readyApp from './readyApp.jsx'

function readyMap() {
  var map;

  // If the div#map element exists, we'll spin up a Leaflet map and append it.
  var mapspot = document.querySelector('div#map');
  if (mapspot instanceof Element) {

    // Uses Leaflet to initialize the map.
    // Basic overview available here:
    // http://leafletjs.com/examples/quick-start/
    map = L.map('map', {zoomControl: false}).setView([38.1341, -121.2722], 13);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    // We need to define a new "Leaflet Control" for the header. This will grab
    // the header element from the Rails templates and prep it for Leaflet.
    // More on extending Leaflet Control here:
    // http://leafletjs.com/examples/extending/extending-3-controls.html
    L.Control.Header = L.Control.extend({
      onAdd: function(map) {
        // Create the Control element for placement within Leaflet.
        // More on DomUtil here:
        // http://leafletjs.com/reference.html#domutil
        var mapHeader = L.DomUtil.create('div', 'map-header');
        // Grab the header from the Rails-rendered templates.
        var header = L.DomUtil.get('header');
        // Add the header to the Leaflet Control.
        mapHeader.appendChild(header);
        return mapHeader;
      }
    });

    // This is the factory function for the Header Control.
    // More on factory functions at the following:
    // http://leafletjs.com/examples/extending/extending-1-classes.html
    // https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md#file-structure
    L.control.header = function(opts) {
      return new L.Control.Header(opts);
    };

    // Same as the Header above, but for the footer this time.
    L.Control.Footer = L.Control.extend({
      onAdd: function(map) {
        var mapFooter = L.DomUtil.create('div', 'map-footer');
        var footer = L.DomUtil.get('footer');
        mapFooter.appendChild(footer);
        return mapFooter;
      }
    });
    L.control.footer = function(opts) {
      return new L.Control.Footer(opts);
    };

    // Finally, add both the Header and Footer controls to the actual map.
    L.control.footer({ position: 'bottomleft' }).addTo(map);
    L.control.header({ position: 'bottomleft' }).addTo(map);

    // Manually place the zoom control.
    var zoomControl = L.control.zoom({
      position: 'bottomright'
    });
    map.addControl(zoomControl);

    // Same concept as the Header and Footer, but with a twist. Here we're
    // preparing the element that's going to be consumed by React.
    L.Control.SubscriptionForm = L.Control.extend({
      onAdd: function(map) {
        var container = L.DomUtil.create('div', 'map-subscription-form');
        return container;
      }
    });
    L.control.subscription_form = function(opts) {
      return new L.Control.SubscriptionForm(opts);
    };
    L.control.subscription_form({ position: 'topleft' }).addTo(map);

    // Now that we have our target element for React placed in the DOM, readyApp()
    // can initialize the React application. See ./readyApp.jsx.
    readyApp();
  };

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
  let coverageArea = L.circle(map.getCenter(), store.getState().radius.in_meters).addTo(map);

  // Ensures the circle's radius always matches the store.
  store.subscribe(() => {
    let dump = store.getState();
    let currentRadius = coverageArea.getRadius();
    if (dump.radius.in_meters !== currentRadius) {
      coverageArea.setRadius(dump.radius.in_meters);
    }
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
  map.on('moveend', applyCenterToCoverageArea);

  return map;
}

export default readyMap;
