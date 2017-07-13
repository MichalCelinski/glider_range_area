import requests
from gliderangearea.local_settings import APPID


def get_weather(lat, lon):
    url = "http://api.openweathermap.org/data/2.5/weather"
    params = {'lat': lat, 'lon': lon, 'APPID': APPID}
    r = requests.get('http://api.openweathermap.org/data/2.5/weather', params=params)
    weather = r.json()
    weather_details = {'weather': weather['wind']}
    return weather_details