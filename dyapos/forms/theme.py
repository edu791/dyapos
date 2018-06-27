from django import forms
from dyapos.models.theme import Theme


class ThemeEditForm(forms.ModelForm):

    class Meta:
        model = Theme
        exclude = ["user", "is_custom"]
