from django import forms


class ResultForm(forms.Form):
    glider = forms.IntegerField(widget=forms.HiddenInput())
    distance = forms.FloatField(widget=forms.HiddenInput())
    glider_direction = forms.IntegerField(widget=forms.HiddenInput())
    wind_speed = forms.IntegerField(label="Prędkość wiatru (km/h)", min_value=0, max_value=100)
    wind_direction = forms.IntegerField(label="Kierunek wiatru", min_value=0, max_value=359)
    reserve_level = forms.FloatField(widget=forms.HiddenInput())
