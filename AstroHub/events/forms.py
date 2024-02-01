from django import forms

class OptimalTimesForm(forms.Form):
    latitude = forms.FloatField()
    longitude = forms.FloatField()
    date = forms.DateField(
        widget=forms.DateInput(attrs={'placeholder': 'YYYY-MM-DD'}))
    start_time = forms.TimeField(
        widget=forms.TimeInput(attrs={'placeholder': 'HH:MM'}))
    duration = forms.IntegerField(min_value=1, max_value=12)
