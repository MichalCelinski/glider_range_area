from django.shortcuts import render
from django.views import View
from calculator import services
from calculator.forms import ResultForm
from calculator.models import Glider, Airdrome
from django.http import JsonResponse


class BasicView(View):
    def get(self, request):
        glider_list = Glider.objects.order_by("name")
        airfield_list = Airdrome.objects.order_by("shortcut")
        result_form = ResultForm()
        ctx = {
            "glider_list": glider_list,
            "airfield_list": airfield_list,
            "result_form": result_form
        }
        return render(request, 'calculator/base.html', ctx)

    def post(self, request):
        if request.is_ajax():
            glider_id = request.POST.get("glider")
            distance = float(request.POST.get("distance"))
            glider_direction = int(request.POST.get("glider_direction"))
            airfield_id = int(request.POST.get("airfield_id"))
            reserve_level = float((request.POST.get("reserve_level")))

            selected_airfield = Airdrome.objects.get(pk=airfield_id)

            # pobieram pogodę dla lotniska
            airfield_weather = services.get_weather(selected_airfield.latitude, selected_airfield.longitude)

            wind_direction_meteorological = airfield_weather['weather']['deg']
            wind_speed = round(airfield_weather['weather']['speed']*3.6, 0)

            expected_height = services.calculate_height(glider_id, distance, glider_direction, reserve_level,
                                                       wind_direction_meteorological, wind_speed)

            data = {"result": expected_height,
                    "wind_speed": wind_speed,
                    "wind_direction": wind_direction_meteorological}
            return JsonResponse(data)

