from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.views import View
from calculator.models import Glider, Airdrome
from math import cos, fabs


class Calculator(View):
    def get(self, request):
        glider_list = "<select name='glider'> <option value> -- wybierz szybowiec -- </option>"
        for glider in Glider.objects.order_by('name'):
            glider_list += "<option value='{}'>{}</option>".format(glider.pk, glider.name)
        glider_list += "</select>"

        response = """
                <html>
                <body>
                <form action="" method="POST">
                    <br>
                    {}
                    <label>
                    Odległość od lotniska w km <input type="number" name="distance"/>
                    </label>
                    <label>
                    Kurs <input type="number" name="glider_direction"/>
                    </label>
                    <label>
                    Siła wiatru w km/h <input type="number" name="wind_speed"/>
                    </label>
                    <label>
                    Kierunek wiatru <input type="number" name="wind_direction"/>
                    </label>
                    <select name='reserve_level'>
                    <option value> -- wybierz poziom zapasu -- </option>
                    <option value='1.2'> 20% </option>
                    <option value='1.3'> 30% </option>
                    <option value='1.4'> 40% </option>
                    </select>
                    <input type="submit" value="Oblicz wysokość"/>
                </form>
                </body>
                </html>
                """.format(glider_list)
        return HttpResponse(response)

    def post(self, request):
        id = request.POST["glider"]
        distance = int(request.POST["distance"])
        glider_direction = int(request.POST["glider_direction"])
        wind_speed = int(request.POST["wind_speed"])
        wind_direction = int(request.POST["wind_direction"])
        reserve_level = float((request.POST["reserve_level"]))

        #  zamieniam meteorologiczny kierunek wiatru na nawigacyjny
        if wind_direction >= 180:
            wind_direction -= 180
        else:
            wind_direction += 180

        #  obliczam składową podłużną wiatru
        wind_component = cos(fabs(glider_direction - wind_direction)) * wind_speed

        glider = Glider.objects.get(pk=id)

        #  obliczam w metrach wysokość potrzebną aby wejść w krąg nadlotniskowy
        expected_hight = round((1000 * (reserve_level*((distance * glider.best_glide_speed)/
                               ((glider.best_glide_speed + wind_component)*glider.glide_ratio))) + 300))

        return HttpResponse("Sukces! <br>"
                            "szybowiec: {}<br>"
                            "doskonałość: {}<br>"
                            "prędkość optymalna: {} km/h<br>"
                            "wysokość potrzebna na dolot do krągu na 300m to {} m"
                            .format(glider.name, glider.glide_ratio, glider.best_glide_speed, expected_hight))


class BasicView(View):
    def get(self, request):
        glider_list = Glider.objects.order_by("name")
        airfield_list = Airdrome.objects.order_by("shortcut")
        ctx = {
            "glider_list": glider_list,
            "airfield_list": airfield_list
        }
        return render(request, 'calculator/base.html', ctx)
