from django import forms
from dyapos.models.presentation import Presentation


class NewPresentationForm(forms.ModelForm):

    class Meta:
        model = Presentation
        fields = ["name", "description", "is_private"]


class RenameForm(forms.ModelForm):

    class Meta:
        model = Presentation
        fields = ["name"]


class ModifyDescriptionForm(forms.ModelForm):

    class Meta:
        model = Presentation
        fields = ["description"]


class ChangeOptionsForm(forms.ModelForm):
    class Meta:
        model = Presentation
        fields = ["name", "description", "has_progressbar", "slides_timeout"]

    def clean(self):
        # If the slides_timeout is less than 0
        self.cleaned_data["slides_timeout"] = 0 if self.cleaned_data.get(
            "slides_timeout") < 0 else self.cleaned_data["slides_timeout"]
        return self.cleaned_data
