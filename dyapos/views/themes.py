# encoding: utf-8

from django.http.response import HttpResponse
from dyapos.models.theme import Theme
from dyapos.models.font import Font
from dyapos.models.presentation import Presentation
from dyapos.forms.theme import ThemeEditForm
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from json import dumps
from django.core.serializers import serialize
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404


@csrf_exempt
def get_list(request):
    """Gets a list of themes"""

    default_themes = [theme for theme in Theme.objects.values("id", "name", "image_preview").filter(user=None)]
    custom_themes = [theme for theme in Theme.objects.values("id", "name", "image_preview").filter(user=request.user)]
    theme_list = {"themes": default_themes,
                  "custom": custom_themes}

    return HttpResponse(dumps(theme_list))


@csrf_exempt
def get_css(request, id):
    """Get the theme style as CSS code
    Args:
        id (int): Theme Id
    """

    try:
        theme = Theme.objects.get(pk=id)
        return render_to_response("theme_css.html", {"theme": theme})
    except ObjectDoesNotExist:
        raise Http404


@login_required()
@csrf_exempt
def set(request):
    """Set a presentation theme from the list"""

    try:
        presentation = Presentation.objects.get(id=request.POST["presentation_id"])
        presentation.theme_id = request.POST["theme_id"]
        presentation.save()
        return HttpResponse(serialize("json", [presentation.theme], use_natural_keys=True))
    except ObjectDoesNotExist:
        raise Http404


@login_required()
@csrf_exempt
def edit(request, id):
    """Edits a theme
    Args:
        id (int): Theme ID
    """

    try:
        theme = Theme.objects.get(pk=id)
    except ObjectDoesNotExist:
        raise Http404

    if request.method == "POST":
        form = ThemeEditForm(request.POST, request.FILES, instance=theme)

        if form.is_valid():
            if form.instance.is_custom is False:
                if not request.user.is_superuser:
                    # create a new custom theme associated to the user and based on the predefined theme
                    form.instance.id = None
                    form.instance.is_custom = True
                    form.instance.user_id = request.user.id

            # Upload the image files to Imgur
            import requests
            from base64 import b64encode

            # Upload the image preview
            try:
                imgur_image = requests.post("https://api.imgur.com/3/upload.json",
                                            headers={"Authorization": "Client-ID 3f3402cfcabb4c6"},
                                            data={'image': b64encode(request.FILES["image_preview"].read()),
                                                  'type': 'base64',
                                                  }
                                            )
            except requests.ConnectionError:
                pass

            form.instance.image_preview = imgur_image.json()["data"]["link"]

            if request.FILES.get("custom_logo"):
                # Upload the custom logo
                imgur_image = requests.post("https://api.imgur.com/3/upload.json",
                                            headers={"Authorization": "Client-ID 3f3402cfcabb4c6"},
                                            data={
                                                'image': b64encode(request.FILES["custom_logo"].read()),
                                                'type': 'base64',
                                            }
                                            )

                form.instance.custom_logo = imgur_image.json()["data"]["link"]
            # Finish uploading to Imgur

            form.save()
            return HttpResponse(form.instance.id)

    form = ThemeEditForm(instance=theme)
    fonts = Font.objects.all()
    return render_to_response("theme_edit.html", {"form": form, "fonts": fonts})


@login_required()
@csrf_exempt
def delete_theme(request, id):
    """Deletes a custom theme
    Args:
        id (int): Custom theme ID
    """

    try:
        theme = Theme.objects.get(pk=id)
    except ObjectDoesNotExist:
        raise Http404

    if theme.is_custom is True:
        # for every theme that has already set the same theme, change it to the default theme ID 1
        for presentation in theme.presentation_set.all():
            presentation.theme_id = 1
            presentation.save()

        if theme.user_id == request.user.id:
            theme.delete()

    return HttpResponse()
