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
        var result = document.querySelector("#result");
        result.innerHTML = "?";
        document.getElementById("id_distance").value = -1;
        document.getElementById("id_glider_direction").value = -1;
        document.getElementById("id_airfield_id").value = this.options[this.selectedIndex].dataset.id;
        document.getElementById("weather_details").innerHTML = "";
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
            var result = document.querySelector("#result");
            result.innerHTML = "?";
        }
    }

    function distanceCounter(location) {
        var showDistance = document.querySelector("#distance");
        var distance = (google.maps.geometry.spherical.computeDistanceBetween(active_airfield, location) / 1000).toFixed(2);
        showDistance.innerHTML = "Odległość od lotniska: " + distance + " km";
        document.getElementById("id_distance").value = distance;
    }

    function headingBeetween(location) {
        var showHeading = document.querySelector("#heading");
        var heading = parseInt(google.maps.geometry.spherical.computeHeading(location, active_airfield));
        if (heading < 0) {
            heading += 360
        }
        showHeading.innerHTML = "Kurs: " + heading;
        document.getElementById("id_glider_direction").value = heading;
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
        document.getElementById("id_glider").value = this.options[this.selectedIndex].value;
        var result = document.querySelector("#result");
        result.innerHTML = "?";
    })
});


document.addEventListener("DOMContentLoaded", function () {
    var safety_factor = document.querySelector("#safety-factor");
    safety_factor.addEventListener('change', function (event) {
        document.getElementById("id_reserve_level").value = this.options[this.selectedIndex].value;
        var result = document.querySelector("#result");
        result.innerHTML = "?";
    })
});

$( document ).ready(function() {
    $("#result_form").on('submit', (function (event) {
        var csrftoken = $('csrfmiddlewaretoken').val();
        var glider = $('#id_glider').val();
        var distance = $('#id_distance').val();
        var glider_direction = $('#id_glider_direction').val();
        var airfield_id = $('#id_airfield_id').val();
        var reserve_level = $('#id_reserve_level').val();

        $.ajax({
            url: window.location.href,
            type: "POST",
            data: {
                csrfmiddlewaretoken: csrftoken,
                glider: glider,
                distance: distance,
                glider_direction: glider_direction,
                airfield_id: airfield_id,
                reserve_level: reserve_level
            },
            success: function (json) {
                var result = document.querySelector("#result");
                result.innerHTML = (json['result'] + " m");
                document.querySelector("#weather_details").innerHTML = ("Aktualny wiatr: " + json['wind_speed'] +
                " km/h z kierunku " + json["wind_direction"])
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
        return false;
    }));
});


document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("#result_form");
    form.addEventListener('change', function (event) {
        var result = document.querySelector("#result");
        result.innerHTML = "?";
    })
});