# encoding: utf-8

import datetime
import hashlib
from dyapos.forms.user import *
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.http import Http404
from django.utils.translation import ugettext as _
from django.conf import settings
from django.contrib import messages
from django.core.mail import EmailMultiAlternatives
from smtplib import SMTPException
from django.utils.html import strip_tags
from django.core.exceptions import ObjectDoesNotExist

User = get_user_model()


def signup(request):
    """Register a new user"""

    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            username = form.clean_username()
            password = form.clean_password2()
            form.save()
            user = authenticate(username=username,
                                password=password)
            login(request, user)

            # redirect to main page
            return HttpResponseRedirect("/home/first-time")
        else:
            return render_to_response("signup.html", {"form": form}, context_instance=RequestContext(request))

    # show signup form
    return render_to_response("signup.html", {"form": UserCreationForm()}, context_instance=RequestContext(request))


def recover_password(request):
    """Sends a recovery password email to the user. it's send's a
    reset a reset password link to the user"""

    if request.method == "POST":
        form = RecoverPasswordForm(request.POST)
        if form.is_valid():
            user = User.objects.filter(
                email=form.cleaned_data["email"]).first()
            user.reset_password_key = hashlib.md5(
                str(datetime.datetime.now())).hexdigest()
            user.save()

            email_content = render_to_response("email/recovery_password.html", {
                                               "person": user, "host": request.get_host()}, context_instance=RequestContext(request)).content
            email = EmailMultiAlternatives(_("Password recovery"), strip_tags(
                email_content), settings.EMAIL_HOST_USER, [form.cleaned_data["email"]])
            email.attach_alternative(email_content, "text/html")
            try:
                email.send()
            except SMTPException:
                pass
            messages.add_message(request, messages.SUCCESS, _(
                "We've sent you an email with a reset password link"))

            # return to main page
            return HttpResponseRedirect("/")
        else:
            return render_to_response("recover_password.html", {'form': form}, context_instance=RequestContext(request))

    return render_to_response("recover_password.html", {'form': RecoverPasswordForm()}, context_instance=RequestContext(request))


def reset_password(request, key):
    """Resets the password
    Args:
            key (str): Key hash to validate if the user requested a password reset
    """

    user = User.objects.filter(reset_password_key=key).first()
    if user:
        if request.method == "POST":
            form = ResetPasswordForm(request.POST)
            if form.is_valid():
                user.set_password(form.cleaned_data["new_password"])
                user.reset_password_key = None
                user.save()
                messages.add_message(
                    request, messages.SUCCESS, _("Your password has been changed"))
                return HttpResponseRedirect("/")
            else:
                return render_to_response("reset_password.html", {"form": form, "key": key}, context_instance=RequestContext(request))
        elif request.method == "GET":
            form = ResetPasswordForm()
            return render_to_response("reset_password.html", {"form": form, "key": key}, context_instance=RequestContext(request))
    else:
        raise Http404


def user(request, username):
    """Get user information (profile page)
    Args:
            username (str): username to search
    """

    if username.lower() != "admin":
        try:
            found_user = User.objects.get(username__iexact=username)
            if found_user:
                return render_to_response("user.html", {"found_user": found_user,
                                                        "email_hash": found_user.get_email_hash(),
                                                        "presentations": found_user.get_own_presentations(request.GET.get("page") or 1, hide_private=True)}, context_instance=RequestContext(request))
        except ObjectDoesNotExist:
            raise Http404
    else:
        raise Http404


@login_required
def user_settings(request):
    """Shows and updates user's settings data"""

    if request.method == "POST":
        profile_form = ProfileForm(request.POST)
        change_email_form = ChangeEmailForm(request.POST)
        if profile_form.is_valid() and change_email_form.is_valid():
            request.user.first_name = profile_form.cleaned_data["first_name"]
            request.user.last_name = profile_form.cleaned_data["last_name"]
            request.user.info = profile_form.cleaned_data["info"]
            request.user.save()

            # check if the email address is already used for another user
            if not User.objects.filter(email=change_email_form.cleaned_data["email"]).exclude(id=request.user.id):
                request.user.email = change_email_form.cleaned_data["email"]
                request.user.save()

                # redirect to home page
                return HttpResponseRedirect("/settings")
            else:
                return render_to_response("settings.html", {"profile_form": profile_form, "change_email_form": change_email_form}, context_instance=RequestContext(request))
        else:
            return render_to_response("settings.html", {"profile_form": profile_form, "change_email_form": change_email_form}, context_instance=RequestContext(request))

    # show the settings page
    return render_to_response("settings.html", {"profile_form": ProfileForm(instance=request.user),
                                                "change_email_form": ChangeEmailForm(instance=request.user)}, context_instance=RequestContext(request))


@login_required
def update_profile(request):
    """ Updates the user profile data """

    if request.method == "POST":
        profile_form = ProfileForm(request.POST, instance=request.user)
        if profile_form.is_valid():
            profile_form.save()
            return HttpResponseRedirect("/home")


@login_required
def change_password(request):
    """Change the user's password"""

    if request.method == "POST":
        form = ChangePasswordForm(request.POST)
        if form.is_valid():
            # Check if old password is correct
            if authenticate(username=request.user.email,
                            password=form.cleaned_data["old_password"]):

                # hash the new password using a cryptographic algorithm
                request.user.set_password(form.cleaned_data["new_password"])

                # update user with the new password to the database
                request.user.save()

                return HttpResponseRedirect("/settings")
            else:
                form.non_field_errors = "Your old password is incorrect"
                return render_to_response("change_password.html", {'form': form}, context_instance=RequestContext(request))
        else:
            return render_to_response("change_password.html", {'form': form}, context_instance=RequestContext(request))
    else:
        form = ChangePasswordForm()

    # show change password form
    return render_to_response("change_password.html", {'form': form}, context_instance=RequestContext(request))


@login_required
def delete(request):
    """Delete the user account including all its data and presentation"""
    userpresentations = request.user.userpresentation_set.filter()
    # delete every related presentation
    for userpresentation in userpresentations:
        if userpresentation.is_owner:
            # Delete the presentation completely
            userpresentation.presentation.delete_completely()
        else:
            # Delete only the relation between the user and the presentation
            userpresentation.delete()
    # delete user from database
    request.user.delete()
    # redirect to index
    return HttpResponseRedirect("/")
