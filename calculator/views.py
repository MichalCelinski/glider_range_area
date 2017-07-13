from django.shortcuts import render
from django.views import View
from calculator import services
from calculator.forms import ResultForm
from calculator.models import Glider, Airdrome
from math import cos, fabs, radians
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
            id = request.POST.get("glider")
            distance = float(request.POST.get("distance"))
            glider_direction = int(request.POST.get("glider_direction"))
            airfield_id = int(request.POST.get("airfield_id"))
            reserve_level = float((request.POST.get("reserve_level")))

            selected_airfield = Airdrome.objects.get(pk=airfield_id)

            # pobieram pogodę dla lotniska
            airfield_weather = services.get_weather(selected_airfield.latitude, selected_airfield.longitude)

            wind_direction_meteorological = airfield_weather['weather']['deg']
            wind_speed = round(airfield_weather['weather']['speed']*3.6, 2)

            #  zamieniam meteorologiczny kierunek wiatru na nawigacyjny
            if wind_direction_meteorological >= 180:
                wind_direction = wind_direction_meteorological - 180
            else:
                wind_direction = wind_direction_meteorological + 180


            # obliczam składową podłużną wiatru
            wind_component = (cos(radians(fabs(glider_direction - wind_direction)))) * wind_speed

            glider = Glider.objects.get(pk=id)

            #  obliczam w metrach wysokość potrzebną aby wejść w krąg nadlotniskowy
            expected_hight = round((1000 * (reserve_level * ((distance * glider.best_glide_speed) /
                        ((glider.best_glide_speed + wind_component) * glider.glide_ratio))) + 300))
            data = {"result": expected_hight, "wind_speed": wind_speed, "wind_direction": wind_direction_meteorological}
            return JsonResponse(data)

