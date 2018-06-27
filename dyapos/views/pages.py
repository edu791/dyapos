# encoding: utf-8

from dyapos.forms.presentation import *
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect


def index(request):
    """Show the main page"""

    if request.user.is_authenticated():
        if request.path == "/":
            # show the user's home page
            return HttpResponseRedirect("/home")

    return render_to_response('index.html', context_instance=RequestContext(request))


@login_required()
def home(request, first_time=False):
    """Show logged user's home page"""

    template_data = {}

    if first_time:
        from dyapos.forms.user import ProfileForm
        template_data["profile_form"] = ProfileForm(instance=request.user)

    template_data["form"] = NewPresentationForm()
    # Default 'all' if the filter is not specified
    filter = request.GET.get("filter") or "all"
    if filter == "all":
        template_data["presentations"] = request.user.get_all_presentations(
            request.GET.get("page") or 1, request.POST.get("search") or "")
    elif filter == "own":
        template_data["presentations"] = request.user.get_own_presentations(
            request.GET.get("page") or 1, request.POST.get("search") or "")
    elif filter == "shared":
        template_data["presentations"] = request.user.get_shared_presentations(
            request.GET.get("page") or 1, request.POST.get("search") or "")
    template_data["filter"] = filter

    return render_to_response("home.html", template_data, context_instance=RequestContext(request))


def demo(request):
    return render_to_response("demo.html", context_instance=RequestContext(request))
