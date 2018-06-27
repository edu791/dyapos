# -*- coding: utf-8 -*-

import datetime
import hashlib
import urllib
from dyapos.forms.presentation import *
from dyapos.models.presentation import Presentation
from dyapos.models.userpresentation import UserPresentation
from dyapos.models.font import Font
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.forms.formsets import formset_factory
from django.http import Http404
from django.core.serializers import serialize
from dyapos.forms.userpresentation import SharePresentationForm
from django.contrib import messages
from django.utils.translation import ugettext as _

User = get_user_model()


def presentation(request, key):
    """Shows the presentation page with info, mini preview and other options
    Args:
        key (str): String key that corresponds to a presentation
    """

    # search the presentation based on its key
    presentation = Presentation.objects.filter(key=key).first()

    # if presentation exists
    if presentation is not None:

        # show the presentation page
        return render_to_response("presentation.html", {
            "presentation": presentation,
            "rename_form": RenameForm(instance=presentation),
            "modify_description_form": ModifyDescriptionForm(instance=presentation),
            "share_form": share(request, presentation.id).content,
            "is_owner": True if (request.user.is_authenticated() and request.user.is_owner(presentation)) else False,
            "can_edit": True if (request.user.is_authenticated() and request.user.can_edit(presentation)) else False,
            "owner": presentation.userpresentation_set.filter(is_owner=True).first().user.username
        }, context_instance=RequestContext(request))
    else:
        raise Http404


@login_required()
def create(request):
    """Creates a new presentation and associates to the current user"""

    if request.method == "POST":
        form = NewPresentationForm(request.POST)
        if form.is_valid():
            # Check if the user has exceeded the number of created
            # presentations
            if request.user.presentation_limit_reached():
                form.instance.key = hashlib.sha1(
                    str(datetime.datetime.now())).hexdigest()[:10]
                form.save()
                request.user.associate_to_presentation(
                    form.instance, True, True)

                # redirect to the edit page of the created presentation
                return HttpResponseRedirect("/edit/" + str(form.instance.key))
            else:
                messages.add_message(request, messages.ERROR, _(
                    "You reached the limit of created presentations."), extra_tags="alert")
                return HttpResponseRedirect("/home")

    return render_to_response("home.html", {"form": NewPresentationForm()}, context_instance=RequestContext(request))


@login_required()
def delete(request, id):
    """Deletes a presentation
    Args:
        id (int): Presentation Id to delete
    """

    try:
        presentation = Presentation.objects.get(pk=id)
        if request.user.is_owner(presentation):
            presentation.delete_completely()
        else:
            presentation.userpresentation_set.filter(
                user_id=request.user.id).first().delete()
    except ObjectDoesNotExist:
        raise Http404

    # redirect to home page
    return HttpResponseRedirect("/home")


@login_required()
def copy(request, id):
    """Copies a backup of the presentation
    Args:
        id (int): Presentation Id to be copied
    """

    try:
        presentation = Presentation.objects.get(pk=id)
        if request.user.presentation_limit_reached():
            request.user.associate_to_presentation(
                presentation.clone(), True, True)
        else:
            messages.add_message(request, messages.ERROR, _(
                "You reached the limit of created presentations."), extra_tags="alert")
            return HttpResponseRedirect("/home/")
    except ObjectDoesNotExist:
        raise Http404

    # redirect to home page
    return HttpResponseRedirect("/home")


@login_required()
def rename(request, id):
    """Renames the presentation
    Args:
     id (int): Presentation Id to be renamed
    """

    if request.method == "POST":
        try:
            presentation = Presentation.objects.get(pk=id)
            form = RenameForm(request.POST, instance=presentation)
            if form.is_valid():
                form.save()
        except ObjectDoesNotExist:
            raise Http404

    return HttpResponseRedirect(request.META["HTTP_REFERER"])


@login_required()
def modify_description(request, id):
    """Modifies the presentation description
    Args:
     id (int): Presentation Id whose the description will be modified
    """

    if request.method == "POST":
        try:
            presentation = Presentation.objects.get(pk=id)
            form = ModifyDescriptionForm(request.POST, instance=presentation)
            if form.is_valid():
                form.save()
        except ObjectDoesNotExist:
            raise Http404

    return HttpResponseRedirect(request.META["HTTP_REFERER"])


@login_required()
def edit(request, key):
    """Open the presentation editor screen
    Args:
        key (str): Presentation public key, default = None
    """

    from dyapos.views.themes import get_css

    try:
        presentation = Presentation.objects.get(key=key)

        # check if user is allowed to edit this presentation
        if request.user.can_edit(presentation):
            # get user data
            user_data = {
                "username": request.user.username,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
            }
        else:
            raise ObjectDoesNotExist
    except ObjectDoesNotExist:
        raise Http404

    return render_to_response("edit.html", {"theme_css": get_css(request, presentation.theme_id).content,
                                            "presentation": presentation,
                                            "user_data": user_data,
                                            "share_form": share(request, presentation.id).content if request.user.is_owner(presentation) else None,
                                            "form_change_options": ChangeOptionsForm(instance=presentation),
                                            "fonts": Font.objects.all(),
                                            "NODEJS_URL": settings.NODEJS_URL
                                            }, context_instance=RequestContext(request))


@login_required()
def change_options(request, id):
    """Changes some options of a presentation
    Args:
        id (int): Presentation ID
    """

    if request.method == "POST":
        try:
            presentation = Presentation.objects.get(pk=id)
            if request.user.can_edit(presentation):
                form = ChangeOptionsForm(request.POST, instance=presentation)
                if form.is_valid():
                    form.save()
        except ObjectDoesNotExist:
            raise Http404

    return HttpResponseRedirect(request.META["HTTP_REFERER"])


@csrf_exempt
def download(request, id):
    """Generates a ZIP package with all the presentation data for being presented offline
    Args:
        id (int): Presentation ID
    """

    from tempfile import NamedTemporaryFile
    from zipfile import ZipFile
    from StringIO import StringIO

    # get the presentation from the database based on its key
    try:
        presentation = Presentation.objects.get(pk=id)
    except ObjectDoesNotExist:
        raise Http404

    # Open StringIO to grab in-memory ZIP contents
    s = StringIO()

    # create a zip container file for the presentation
    zip = ZipFile(s, "w")

    presentation_content = view(request, presentation.key).content.decode("utf-8")

    # replace the static URL to a new static URL
    presentation_content = presentation_content.replace(settings.STATIC_URL, "").replace(
        "libs/", "").replace("/media/fonts/", "fonts/")

    # store script and styles inside the zip
    zip.write(settings.BASE_DIR + settings.STATIC_URL +
              "js/libs/impress.js", "js/impress.js")
    zip.write(settings.BASE_DIR + settings.STATIC_URL +
              "js/libs/impress-progress.js", "js/impress-progress.js")
    zip.write(settings.BASE_DIR + settings.STATIC_URL +
              "js/libs/impressConsole.js", "js/impressConsole.js")
    zip.write(settings.BASE_DIR + settings.STATIC_URL +
              "css/impress.css", "css/impress.css")
    zip.write(settings.BASE_DIR + settings.STATIC_URL +
              "css/impress-progress.css", "css/impress-progress.css")
    zip.write(settings.BASE_DIR + settings.STATIC_URL +
              "css/impressConsole.css", "css/impressConsole.css")
    zip.write(presentation.theme.title_font.filename.path,
              str(presentation.theme.title_font.filename))
    zip.write(presentation.theme.subtitle_font.filename.path,
              str(presentation.theme.subtitle_font.filename))
    zip.write(presentation.theme.body_font.filename.path,
              str(presentation.theme.body_font.filename))

    # define an opener class with a fake user agent, in case the image url is
    # protected from the headers
    class MyOpener(urllib.FancyURLopener):
        version = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11'

    # download images and store them inside the zip
    slides = presentation.get_slides()

    myopener = MyOpener()
    for slide in slides:
        for component in slide["components"]:
            if component["type"] == "image":
                # retrieve the image file from the url
                img = myopener.retrieve(component["url"])
                img_type = img[1].type
                filename = hashlib.sha1(str(datetime.datetime.now())).hexdigest()[
                    :10] + "." + img_type.split("/")[1]
                if img_type == "image/jpeg" or img_type == "image/png" or img_type == "image/gif":
                    zip.write(img[0], "img/" + filename)
                    presentation_content = presentation_content.replace(component["url"].decode("utf-8"), "img/" + filename)

    # If the theme has a logo
    if presentation.theme.custom_logo != "":
        img = myopener.retrieve(str(presentation.theme.custom_logo))
        img_type = img[1].type
        filename = hashlib.sha1(str(datetime.datetime.now())).hexdigest()[:10] + "." + img_type.split("/")[1]
        if img_type == "image/jpeg" or img_type == "image/png" or img_type == "image/gif":
            zip.write(img[0], "img/" + filename)
            presentation_content = presentation_content.replace(str(presentation.theme.custom_logo).decode("utf-8"), "img/" + filename)

    # create a temporary file to store the presentation file
    presentation_file = NamedTemporaryFile()
    presentation_file.write(presentation_content.encode("utf-8"))
    presentation_file.seek(0)
    zip.write(presentation_file.name, presentation.name + ".html")
    zip.close()

    presentation_file.close()

    response = HttpResponse(
        s.getvalue(), content_type="application/x-zip-compressed")
    response["Content-Disposition"] = "attachment; filename=" + \
        presentation.name.replace(" ", "_") + ".zip"
    return response


def view(request, key):
    """Shows the presentation"""

    # get the presentation based on its key
    presentation = Presentation.objects.filter(key=key).first()

    if presentation:
        from dyapos.views.themes import get_css

        slides = presentation.get_slides()

        # show the presentation preview
        return render_to_response("view.html", {
            "presentation": presentation,
            "theme_css": get_css(request, presentation.theme.id).content,
            "slides": slides
        }, context_instance=RequestContext(request))
    else:
        raise Http404


@login_required()
def like(request, id):
    """Sets a like on the presentation
    Args:
        id (int): Presentation Id
    """
    try:
        Presentation.objects.get(pk=id).like()
    except ObjectDoesNotExist:
        raise Http404

    return HttpResponseRedirect(request.META["HTTP_REFERER"])


@csrf_exempt
def load_featured(request):
    """Gets the top 6 featured presentation whose the 'num_likes' and 'num_views' are the highest"""

    presentations = Presentation.objects.filter(
        is_private=False).order_by("num_likes", "num_views")[:6]
    return HttpResponse(serialize("json", presentations))


@login_required()
def share(request, id):
    """Share the presentation to other users"""

    try:
        presentation = Presentation.objects.get(pk=id)
    except ObjectDoesNotExist:
        raise Http404
    share_formset = formset_factory(SharePresentationForm)

    if request.method == "POST":
        formset = share_formset(request.POST)
        if formset.is_valid():
            for form in formset:
                user = User.objects.filter(
                    emailform.cleaned_data["email"]).first()
                if user is not None:
                    userpresentation = UserPresentation(presentation_id=presentation.id,
                                                        user_id=user.id,
                                                        can_edit=True if int(
                                                            form.cleaned_data["permission"]) == 1 else False,
                                                        is_owner=0)
                    userpresentation.save()

        # redirect to the same page
        return HttpResponseRedirect(request.META["HTTP_REFERER"])
    else:
        return render_to_response("share_form.html", {
            "presentation": presentation,
            "collaborators": presentation.userpresentation_set.exclude(user__id=request.user.id),
            "host": request.get_host(),
            "share_formset": share_formset
        }, context_instance=RequestContext(request))


@login_required()
def join(request, key, edit_key):
    presentation = Presentation.objects.filter(key=key).first()
    if presentation and presentation.edit_key == edit_key:
        if not request.user.is_allowed(presentation):
            request.user.associate_to_presentation(presentation, False, True)
            messages.add_message(request, messages.SUCCESS, _(
                "A new presentation was added to your 'shared' items"))
            return HttpResponseRedirect("/")
        else:
            messages.add_message(request, messages.ERROR, _(
                "You are already joined to that presentation"), extra_tags="alert")
            return HttpResponseRedirect("/")
    else:
        raise Http404


@login_required()
@csrf_exempt
def unshare(request, id):
    """Unshare the presentation to a user
    Args:
        id (int): UserPresentation association ID
    """

    try:
        userpresentation = UserPresentation.objects.get(pk=id)
        print userpresentation
        userpresentation.delete()
    except ObjectDoesNotExist:
        raise Http404

    return HttpResponseRedirect("")


@login_required()
@csrf_exempt
def get_edit_link(request, id):
    """Generates a edit share link
    Args:
        id (int): Presentation ID
    """
    try:
        presentation = Presentation.objects.get(pk=id)
        if request.user.is_owner(presentation):
            presentation.generate_edit_key()
            return HttpResponse("http://%s%s" % (request.get_host(), reverse(join, args=[presentation.key, presentation.edit_key])))
        else:
            raise Http404
    except ObjectDoesNotExist:
        raise Http404
