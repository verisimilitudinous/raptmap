import store from './store.js'
import readyApp from './readyApp.jsx'

function readyMap() {
  var map;
  var mapspot = document.querySelector('div#map');
  if (mapspot instanceof Element) {
    map = L.map('map', {zoomControl: false}).setView([38.1341, -121.2722], 13);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);
    // Add our zoom control manually where we want to
    var zoomControl = L.control.zoom({
      position: 'bottomright'
    });
    map.addControl(zoomControl);

    L.Control.Header = L.Control.extend({
      onAdd: function(map) {
        var mapHeader = L.DomUtil.create('div', 'map-header');
        var header = L.DomUtil.get('header');
        mapHeader.appendChild(header);
        return mapHeader;
      }
    });
    L.control.header = function(opts) {
      return new L.Control.Header(opts);
    };

    L.Control.Footer = L.Control.extend({
      onAdd: function(map) {
        var mapFooter = L.DomUtil.create('div', 'map-footer');
        //var mapCenter = L.DomUtil.create('div', 'center')
        var footer = L.DomUtil.get('footer');
        mapFooter.appendChild(footer);
        //mapFooter.appendChild(mapCenter);
        return mapFooter;
      }
    });
    L.control.footer = function(opts) {
      return new L.Control.Footer(opts);
    };

    L.control.footer({ position: 'bottomleft' }).addTo(map);
    L.control.header({ position: 'bottomleft' }).addTo(map);

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
    readyApp();
  };

  // Pan map on location form submission.
  store.subscribe(() => {
    let dump = store.getState();
    let currentLatLng = map.getCenter();
    //console.log(dump.location.latitude + "," + dump.location.longitude + ";" + currentLatLng.lat + "," + currentLatLng.lng);
    if ((dump.location.latitude !== null) && (dump.location.longitude !== null)) {
      if ((dump.location.latitude !== currentLatLng.lat) || (dump.location.longitude !== currentLatLng.lng)) {
        map.panTo(new L.LatLng(dump.location.latitude, dump.location.longitude));
      }
    }
  });

  let coverageArea = L.circle(map.getCenter(), store.getState().radius.in_meters).addTo(map);

  function applyCenterToCoverageArea(e) {
    let dump = store.getState();
    let currentLatLng = map.getCenter();
    coverageArea.setLatLng(currentLatLng);
    if ((dump.location.latitude !== currentLatLng.lat) || (dump.location.longitude !== currentLatLng.lng)) {
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
  map.on('moveend', applyCenterToCoverageArea);

  store.subscribe(() => {
    let dump = store.getState();
    let currentRadius = coverageArea.getRadius();
    if (dump.radius.in_meters !== currentRadius) {
      coverageArea.setRadius(dump.radius.in_meters);
    }
  });

  return map;
}

export default readyMap;
