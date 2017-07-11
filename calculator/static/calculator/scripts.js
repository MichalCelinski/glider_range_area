document.addEventListener("DOMContentLoaded", function () {
    var airfields = document.querySelector("#airfields");
    airfields.addEventListener('change', function (event) {
        selected_airfield = {
            lat: parseFloat(this.options[this.selectedIndex].dataset.lat),
            lng: parseFloat(this.options[this.selectedIndex].dataset.lng)
        };
        initMap(selected_airfield);
        var airfield_details = document.querySelector("#airfield-details");
        airfield_details.innerHTML = "Lokalizacja " + this.options[this.selectedIndex].value + ":  N" +
            parseFloat(this.options[this.selectedIndex].dataset.lat).toFixed(2) + ", E " +
            parseFloat(this.options[this.selectedIndex].dataset.lng).toFixed(2);
    })
});

function initMap(selected_airfield) {
    var map;
    var start_position = {lat: 52.0695704, lng: 19.479607};
    var marker;
    var marker_2;
    var polyline;
    var active_airfield;
    var showPosition = document.querySelector("#glider-position");
    showPosition.innerHTML = "Pozycja szybowca: ?";
    var showDistance = document.querySelector("#distance");
    showDistance.innerHTML = "Odległość od lotniska: ?";
    var showHeading = document.querySelector("#heading");
    showHeading.innerHTML = "Kurs: ?";

    if (selected_airfield == null || JSON.stringify(selected_airfield) == JSON.stringify(start_position)){
        map = new google.maps.Map(document.getElementById('map'), {
            center: start_position,
            zoom: 7
        });
    } else {
        map = new google.maps.Map(document.getElementById('map'), {
            center: selected_airfield,
            zoom: 10
        });

        marker = new google.maps.Marker({
            position: selected_airfield,
            map: map
        });

        active_airfield = marker.getPosition()
    }

    google.maps.event.addListener(map, 'click', function (event) {
        placeMarker(event.latLng);
        distanceCounter(event.latLng);
        headingBeetween(event.latLng);
        drawPolyline(event.latLng);
    });

    function placeMarker(location) {
        if (marker != null) {
            if (marker_2 == null) {
            marker_2 = new google.maps.Marker({
                position: location,
                map: map
            });
            } else {
                marker_2.setPosition(location);
            }
            var showPosition = document.querySelector("#glider-position");
            showPosition.innerHTML = "Pozycja szybowca: N " + location.lat().toFixed(2) + ", E " + location.lng().toFixed(2)
        }
    }

    function distanceCounter(location) {
        var showDistance = document.querySelector("#distance");
        var distance = (google.maps.geometry.spherical.computeDistanceBetween(active_airfield, location) / 1000).toFixed(2);
        showDistance.innerHTML = "Odległość od lotniska: " + distance + " km";
        localStorage.distance = distance
    }

    function headingBeetween(location) {
        var showHeading = document.querySelector("#heading");
        var heading = parseInt(google.maps.geometry.spherical.computeHeading(location, active_airfield));
        if (heading < 0) {
            heading += 360
        }
        showHeading.innerHTML = "Kurs: " + heading;
    }

    function drawPolyline(location) {
        if (polyline != null) {
            polyline.setMap(null)
        }
        polyline = new google.maps.Polyline({
            path: [
                new google.maps.LatLng(active_airfield.lat(), active_airfield.lng()),
                new google.maps.LatLng(location.lat(), location.lng())
            ],
            strokeColor: "#e74c3c",
            strokeWeight: 3,
            map: map
        });
    }
}


document.addEventListener("DOMContentLoaded", function () {
    var gliders = document.querySelector("#gliders");
    gliders.addEventListener('change', function (event) {

        var glider_details = document.querySelector("#glider-details");
        glider_details.innerHTML = "Wybrany szybowiec: " + this.options[this.selectedIndex].dataset.name +
            "<br> Doskonałość: " + this.options[this.selectedIndex].dataset.ratio +
            "<br> Prędkość Optymalna: " + this.options[this.selectedIndex].dataset.speed + " km/h";
        document.getElementById("temp").value = this.options[this.selectedIndex].dataset.ratio
    })
});