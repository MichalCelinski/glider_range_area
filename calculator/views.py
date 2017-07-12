from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.views import View
from calculator.forms import ResultForm
from calculator.models import Glider, Airdrome
from math import cos, fabs
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
            wind_speed = int(request.POST.get("wind_speed"))
            wind_direction = int(request.POST.get("wind_direction"))
            reserve_level = float((request.POST.get("reserve_level")))

            #  zamieniam meteorologiczny kierunek wiatru na nawigacyjny
            if wind_direction >= 180:
                wind_direction -= 180
            else:
                wind_direction += 180

            # obliczam składową podłużną wiatru
            wind_component = cos(fabs(glider_direction - wind_direction)) * wind_speed

            glider = Glider.objects.get(pk=id)

            #  obliczam w metrach wysokość potrzebną aby wejść w krąg nadlotniskowy
            expected_hight = round((1000 * (reserve_level * ((distance * glider.best_glide_speed) /
                        ((glider.best_glide_speed + wind_component) * glider.glide_ratio))) + 300))
            data = {"result": expected_hight}
            return JsonResponse(data)
