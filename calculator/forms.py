from django import forms


class ResultForm(forms.Form):
    glider = forms.IntegerField(widget=forms.HiddenInput(), required=True)
    distance = forms.FloatField(widget=forms.HiddenInput(), required=True, min_value=1.0)
    glider_direction = forms.IntegerField(widget=forms.HiddenInput(), required=True, min_value=0, max_value=359)
    safety_factor = forms.FloatField(widget=forms.HiddenInput(), required=True)
    airfield_id = forms.IntegerField(widget=forms.HiddenInput(), required=True, min_value=1)
