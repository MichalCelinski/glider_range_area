import requests
from gliderangearea.local_settings import OPENWEATHERMAP_API_KEY
from .models import Glider
from math import cos, fabs, radians


def get_weather(lat, lon):
    params = {'lat': lat, 'lon': lon, 'APPID': OPENWEATHERMAP_API_KEY}
    request = requests.get("http://api.openweathermap.org/data/2.5/weather", params=params)
    weather = request.json()
    wind_details = {'weather': weather['wind']}
    return wind_details


def calculate_height(glider_id, distance, glider_direction, safety_factor, wind_direction_meteorological, wind_speed):

    if wind_direction_meteorological >= 180:
        wind_direction = wind_direction_meteorological - 180
    else:
        wind_direction = wind_direction_meteorological + 180

    wind_component = (cos(radians(fabs(glider_direction - wind_direction)))) * wind_speed

    glider = Glider.objects.get(pk=glider_id)

    suggested_height = (distance * glider.best_glide_speed) / ((glider.best_glide_speed + wind_component)
                                                              * glider.glide_ratio)

    suggested_height = round(safety_factor * (suggested_height * 1000) + 300)

    return suggested_height
