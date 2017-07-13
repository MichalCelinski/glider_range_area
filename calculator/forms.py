from django import forms


class ResultForm(forms.Form):
    glider = forms.IntegerField(widget=forms.HiddenInput(), required=True)
    distance = forms.FloatField(widget=forms.HiddenInput(), required=True, min_value=1)
    glider_direction = forms.IntegerField(widget=forms.HiddenInput(), required=True, min_value=0, max_value=359)
    # wind_speed = forms.IntegerField(label="Prędkość wiatru (km/h)", min_value=0, max_value=100, required=True)
    # wind_direction = forms.IntegerField(label="Kierunek wiatru", min_value=0, max_value=359, required=True)
    reserve_level = forms.FloatField(widget=forms.HiddenInput(), required=True)
    airfield_id = forms.IntegerField(widget=forms.HiddenInput(), required=True, min_value=1)
