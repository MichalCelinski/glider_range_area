import requests
from gliderangearea.local_settings import APPID
from .models import Glider
from math import cos, fabs, radians


def get_weather(lat, lon):
    params = {'lat': lat, 'lon': lon, 'APPID': APPID}
    r = requests.get("http://api.openweathermap.org/data/2.5/weather", params=params)
    weather = r.json()
    weather_details = {'weather': weather['wind']}
    return weather_details


def calculate_height(glider_id, distance, glider_direction, reserve_level, wind_direction_meteorological, wind_speed):
    #  zamieniam meteorologiczny kierunek wiatru na nawigacyjny
    if wind_direction_meteorological >= 180:
        wind_direction = wind_direction_meteorological - 180
    else:
        wind_direction = wind_direction_meteorological + 180

    # obliczam składową podłużną wiatru
    wind_component = (cos(radians(fabs(glider_direction - wind_direction)))) * wind_speed

    glider = Glider.objects.get(pk=glider_id)

    #  obliczam w metrach wysokość potrzebną aby wejść w krąg nadlotniskowy
    expected_height = round((1000 * (reserve_level * ((distance * glider.best_glide_speed) /
                                                      ((glider.best_glide_speed + wind_component)
                                                       * glider.glide_ratio))) + 300))

    return expected_height