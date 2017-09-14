from django.shortcuts import render
from django.views import View
from calculator import services
from calculator.forms import ResultForm
from calculator.models import Airdrome, Glider
from django.http import JsonResponse
from gliderangearea.local_settings import GOOGLEMAPS_API_KEY


class MainPageView(View):
    def get(self, request):
        glider_list = Glider.objects.order_by("name")
        airfield_list = Airdrome.objects.order_by("shortcut")
        result_form = ResultForm()
        ctx = {
            "glider_list": glider_list,
            "airfield_list": airfield_list,
            "result_form": result_form,
            "googlemaps_api_key": GOOGLEMAPS_API_KEY
        }
        return render(request, 'calculator/base.html', ctx)

    def post(self, request):
        if request.is_ajax():
            glider_id = request.POST.get("glider")
            distance = float(request.POST.get("distance"))
            glider_direction = int(request.POST.get("glider_direction"))
            airfield_id = int(request.POST.get("airfield_id"))
            safety_factor = float((request.POST.get("safety_factor")))

            selected_airfield = Airdrome.objects.get(pk=airfield_id)

            airfield_weather = services.get_weather(selected_airfield.latitude, selected_airfield.longitude)

            if len(airfield_weather['weather']) is 2:
                wind_direction_meteorological = round(airfield_weather['weather']['deg'])
                wind_speed = round(airfield_weather['weather']['speed'] * 3.6)
            else:
                wind_direction_meteorological = 0
                wind_speed = 0

            suggested_height = services.calculate_height(glider_id, distance, glider_direction, safety_factor,
                                                        wind_direction_meteorological, wind_speed)

            data = {"result": suggested_height,
                    "wind_speed": wind_speed,
                    "wind_direction": wind_direction_meteorological}
            return JsonResponse(data)
