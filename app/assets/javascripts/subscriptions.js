import find from 'lodash/find';
import has from 'lodash/has';

document.addEventListener("DOMContentLoaded", readyIntro, false);

function readyIntro(e) {

  function getRemoteList(awesompleteInstance, url, dataCallback) {
    var data;
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      data = json;
      return json;
    }).then(function(items) {
      awesompleteInstance.list = dataCallback(items);
    });
    return data;
  };

  function checkToFetchRemoteList(awesompleteInstance, e, url, val, verifiers, dataCallback) {
    var response;
    var checkNotValInItems = (find(verifiers.items, function(o) { return o == val }) === undefined);
    var checkForChangeInVal = (val !== verifiers.value) ? true : false;
    var checkNotMinLength = (val.length > 2) ? true : false;
    var checkNotEnterKey = (e.keyCode !== 13) ? true : false;
    var checkNotTooSoon = (verifiers.timer === false) ? true : false;
    //console.log("1:" + val + ": " + checkNotValInItems);
    //console.log("2:" + val + ": " + checkForChangeInVal);
    //console.log("3:" + val + ": " + checkNotMinLength);
    //console.log("4:" + val + ": " + checkNotEnterKey);
    //console.log("5:" + val + ": " + checkNotTooSoon);
    if (checkNotValInItems && checkForChangeInVal && checkNotMinLength && checkNotEnterKey && checkNotTooSoon) {
      response = getRemoteList(awesompleteInstance, url, dataCallback);
    } else {
      response = false;
    };
    return response;
  };

  function configureAutoAjax(awesompleteInstance, inputElement, endpoint, dataCallback) {
    var verifiers = { items: [], value: "", timer: false };
    inputElement.addEventListener("input", function(e) {
      var val = this.value;
      var url = (endpoint + val);
      var data = checkToFetchRemoteList(awesompleteInstance, e, url, val, verifiers, dataCallback);
      if (data !== false) {
        verifiers.items = data;
        verifiers.value = val;
        verifiers.timer = true;
        setTimeout(function() {
          verifiers.timer = false;
        }, 500);
      } else {
        return false;
      };
    });
  };

  var topicInput = document.querySelector('input.topic-field');
  if (topicInput instanceof Element) {
    var autoTopic = new Awesomplete(topicInput, {
      minChars: 2,
      autoFirst: true,
      data: function (item, input) {
      	return { label: item.name, value: item.name, id: item.id };
      }
    });
    var endpoint = '/topics/autocomplete?query=';
    configureAutoAjax(autoTopic, topicInput, endpoint, function(items) {
      return items
    });
    window.addEventListener("awesomplete-selectcomplete", function(e){
      //if (has(e.text.data, "id")) { document.querySelector('#subscription_topic_attributes_id').value = e.text.data.id };
    }, false);
  };

  var locationInput = document.querySelector('input.location-field');
  if (locationInput instanceof Element) {
    var autoLocation = new Awesomplete(locationInput, {
      minChars: 2,
      autoFirst: true,
      data: function (item, input) {
        return { label: item.properties.label,
                 value: item.properties.label,
                 latitude: item.geometry.coordinates[0],
                 longitude: item.geometry.coordinates[1] };
      }
    });
    var endpoint = 'https://search.mapzen.com/v1/autocomplete?api_key=mapzen-HsW7299&text=';
    configureAutoAjax(autoLocation, locationInput, endpoint, function(items) {
      return items.features
    });
    // When user selects value from autocompleter, add the latlng coordinates to hidden inputs.
    window.addEventListener("awesomplete-selectcomplete", function(e){
      //if (has(e.text.data, "latitude")) { document.querySelector('#subscription_location_attributes_latitude').value = e.text.data.latitude };
      //if (has(e.text.data, "longitude")) { document.querySelector('#subscription_location_attributes_longitude').value = e.text.data.longitude };
    }, false);
    // Clear out the hidden latlng coordinates upon additional input in the field.
    // Need to make sure no bad latlng coordinates get submitted if input is changed.
    locationInput.addEventListener("input", function(e) {
      //document.querySelector('#subscription_location_attributes_latitude').value = "";
      //document.querySelector('#subscription_location_attributes_longitude').value = "";
    });
  };

};
