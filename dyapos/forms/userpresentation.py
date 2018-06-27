from django import forms
from django.utils.translation import ugettext_lazy as _


class SharePresentationForm(forms.Form):
    email = forms.EmailField()
    permission = forms.ChoiceField(
        choices=(("1", _("Allow edit")), ("0", _("View only"))))
