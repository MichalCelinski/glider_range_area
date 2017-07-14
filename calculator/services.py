import requests
from gliderangearea.local_settings import OPENWEATHERMAP_API_KEY
from .models import Glider
from math import cos, fabs, radians


def get_weather(lat, lon):
    params = {'lat': lat, 'lon': lon, 'APPID': OPENWEATHERMAP_API_KEY}
    r = requests.get("http://api.openweathermap.org/data/2.5/weather", params=params)
    weather = r.json()
    wind_details = {'weather': weather['wind']}
    return wind_details


def calculate_height(glider_id, distance, glider_direction, safety_factor, wind_direction_meteorological, wind_speed):

    #  zamieniam meteorologiczny kierunek wiatru na nawigacyjny
    if wind_direction_meteorological >= 180:
        wind_direction = wind_direction_meteorological - 180
    else:
        wind_direction = wind_direction_meteorological + 180

    # obliczam składową podłużną wiatru
    wind_component = (cos(radians(fabs(glider_direction - wind_direction)))) * wind_speed

    glider = Glider.objects.get(pk=glider_id)

    #  obliczam wysokość potrzebną aby dolecieć do lotniska
    suggested_height = (distance * glider.best_glide_speed) / ((glider.best_glide_speed + wind_component)
                                                              * glider.glide_ratio)
    # zamieniam km na mery, dodaję wysokość kręgu lotniskowego (300m) i modyfikuję wynik o współczynnik bezpieczeństwa
    suggested_height = round(safety_factor * (suggested_height * 1000) + 300)

    return suggested_height
