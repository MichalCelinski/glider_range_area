var start_position = {lat: 52.26916667, lng: 20.90722222};

function initMap() {
    var marker;
    var marker_2;
    var polyline;

    var map = new google.maps.Map(document.getElementById('map'), {
        center: start_position,
        zoom: 10
    });

    var marker = new google.maps.Marker({
        position: start_position,
        map: map
    });

    var latLngA = marker.getPosition();

    google.maps.event.addListener(map, 'click', function (event) {
        placeMarker(event.latLng);
        distanceCounter(event.latLng);
        headingBeetween(event.latLng);
        drawPolyline(event.latLng);
    });

    function placeMarker(location) {
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

    function distanceCounter(location) {
        var distance = (google.maps.geometry.spherical.computeDistanceBetween(latLngA, location) / 1000).toFixed(2);
        var showDistance = document.querySelector("#distance");
        showDistance.innerHTML = "Odległość od lotniska: " + distance + " km"
    }

    function headingBeetween(location) {
        var heading = parseInt(google.maps.geometry.spherical.computeHeading(location, latLngA));
        if (heading < 0) {
            heading += 360
        }
        var showHeading = document.querySelector("#heading");
        showHeading.innerHTML = "Kurs: " + heading
    }

    function drawPolyline(location) {
        if (polyline != null) {
            polyline.setMap(null)
        }
        polyline = new google.maps.Polyline({
            path: [
                new google.maps.LatLng(latLngA.lat(), latLngA.lng()),
                new google.maps.LatLng(location.lat(), location.lng())
            ],
            strokeColor: "#e74c3c",
            strokeWeight: 3,
            map: map
        });
    }
}