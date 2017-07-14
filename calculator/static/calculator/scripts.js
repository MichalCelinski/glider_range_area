// nasłuchiwanie wyboru lotniska. Zmiana steruje widokiem mapy i warunkuje wyniki operacji na niej,
// resetuje też wynik końcowy i czyści pola formularza

document.addEventListener("DOMContentLoaded", function () {
    var airfields = document.querySelector("#airfields");
    airfields.addEventListener('change', function (event) {
        var selected_airfield = {
            lat: parseFloat(this.options[this.selectedIndex].dataset.lat),
            lng: parseFloat(this.options[this.selectedIndex].dataset.lng)
        };
        initMap(selected_airfield);
        document.querySelector("#airfield-details").innerHTML = "Lokalizacja " + this.options[this.selectedIndex].value
            + ":  N" + parseFloat(this.options[this.selectedIndex].dataset.lat).toFixed(2)
            + ", E " + parseFloat(this.options[this.selectedIndex].dataset.lng).toFixed(2);
        document.querySelector("#result").innerHTML = "?";
        document.getElementById("id_distance").value = "";
        document.getElementById("id_glider_direction").value = "";
        document.getElementById("id_airfield_id").value = this.options[this.selectedIndex].dataset.id;
        document.getElementById("weather_details").innerHTML = "";
    })
});


// inicjalizacja mapy
function initMap(selected_airfield) {
    var map;
    var start_position = {lat: 52.0695704, lng: 19.479607};
    var airfield_marker;
    var glider_marker;
    var polyline;
    var active_airfield;
    document.querySelector("#glider-position").innerHTML = "Pozycja szybowca: ?";
    document.querySelector("#distance").innerHTML = "Odległość od lotniska: ?";
    document.querySelector("#heading").innerHTML = "Kurs: ?";

    // centrowanie mapy i ustawienie markera lotniska
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

        airfield_marker = new google.maps.Marker({
            position: selected_airfield,
            map: map
        });

        active_airfield = airfield_marker.getPosition()
    }

    // nasłuch na kliknięcia na mapie i wywołanie funkcji uwzględniających zmiany
    google.maps.event.addListener(map, 'click', function (event) {
        placeMarker(event.latLng);
        distanceCounter(event.latLng);
        headingBeetween(event.latLng);
        drawPolyline(event.latLng);
    });

    // sterowanie markerem pozycji szybowca
    function placeMarker(location) {
        if (airfield_marker != null) {
            if (glider_marker == null) {
            glider_marker = new google.maps.Marker({
                position: location,
                map: map
            });
            } else {
                glider_marker.setPosition(location);
            }
            document.querySelector("#glider-position").innerHTML = "Pozycja szybowca: N " + location.lat().toFixed(2)
                + ", E " + location.lng().toFixed(2);
            document.querySelector("#result").innerHTML = "?";
        }
    }

    // obliczanie odległości między markerami
    function distanceCounter(location) {
        var distance = (google.maps.geometry.spherical.computeDistanceBetween(active_airfield, location) / 1000).toFixed(2);
        document.querySelector("#distance").innerHTML = "Odległość od lotniska: " + distance + " km";
        document.getElementById("id_distance").value = distance;
    }

    // obliczanie kursu szybowca
    function headingBeetween(location) {
        var heading = parseInt(google.maps.geometry.spherical.computeHeading(location, active_airfield));
        if (heading < 0) {
            heading += 360
        }
        document.querySelector("#heading").innerHTML = "Kurs: " + heading;
        document.getElementById("id_glider_direction").value = heading;
    }

    // rysowanie linii łączącej markery
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

//nasłuch na wybór szybowca. Wypisuje detale szybowca, przekazuje do formularza i resetuje wynik końcowy
document.addEventListener("DOMContentLoaded", function () {
    var gliders = document.querySelector("#gliders");
    gliders.addEventListener('change', function (event) {
        document.querySelector("#glider-details").innerHTML = "Wybrany szybowiec: "
            + this.options[this.selectedIndex].dataset.name +
            "<br> Doskonałość: " + this.options[this.selectedIndex].dataset.ratio +
            "<br> Prędkość Optymalna: " + this.options[this.selectedIndex].dataset.speed + " km/h";
        document.getElementById("id_glider").value = this.options[this.selectedIndex].value;
        document.querySelector("#result").innerHTML = "?";
    })
});

//nasłuch na wybór współczynnika. Wypisuje detale szybowca, przekazuje do formularza i resetuje wynik końcowy
document.addEventListener("DOMContentLoaded", function () {
    var safety_factor = document.querySelector("#safety-factor");
    safety_factor.addEventListener('change', function (event) {
        document.getElementById("id_safety_factor").value = this.options[this.selectedIndex].value;
        document.querySelector("#result").innerHTML = "?";
    })
});

// ajax obługujący ukryty formularz (pobranie wyników obliczeń z backendu)
$( document ).ready(function() {
    $("#result_form").on('submit', (function (event) {
        var csrftoken = $('csrfmiddlewaretoken').val();
        var glider = $('#id_glider').val();
        var distance = $('#id_distance').val();
        var glider_direction = $('#id_glider_direction').val();
        var airfield_id = $('#id_airfield_id').val();
        var safety_factor = $('#id_safety_factor').val();

        $.ajax({
            url: window.location.href,
            type: "POST",
            data: {
                csrfmiddlewaretoken: csrftoken,
                glider: glider,
                distance: distance,
                glider_direction: glider_direction,
                airfield_id: airfield_id,
                safety_factor: safety_factor
            },
            success: function (json) {
                var result = document.querySelector("#result");
                result.innerHTML = (json['result'] + " m");
                document.querySelector("#weather_details").innerHTML = ("Aktualny wiatr: " + json['wind_speed'] +
                " km/h z kierunku " + json["wind_direction"])
            },
            error:
                document.querySelector("#result").innerHTML = "Wyklikaj pełen zestaw danych!"
        });
        return false;
    }));
});