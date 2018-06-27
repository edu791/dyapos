from django import forms
from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _

User = get_user_model()


class UserCreationForm(forms.ModelForm):
    error_messages = {
        'duplicate_username': _("A user with that username already exists."),
        'duplicate_email': _("That email is already registered."),
        'password_mismatch': _("The two password fields didn't match."),
    }
    username = forms.RegexField(label=_("Username"), max_length=30,
        regex=r'^[\w.+-]+$',
        error_messages={
            'invalid': _("This value may contain only letters, numbers and "
                         "./+/-/_ characters.")})
    email = forms.EmailField()
    password1 = forms.CharField(label=_("Password"), widget=forms.PasswordInput)
    password2 = forms.CharField(label=_("Password confirmation"), widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ("username", "email")

    def clean_username(self):
        username = self.cleaned_data["username"]
        try:
            User._default_manager.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError(
            self.error_messages['duplicate_username'],
            code='duplicate_username',
        )

    def clean_email(self):
        email = self.cleaned_data["email"]
        try:
            User._default_manager.get(email=email)
        except User.DoesNotExist:
            return email
        raise forms.ValidationError(
            self.error_messages['duplicate_email'],
            code='duplicate_email',
        )

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                self.error_messages['password_mismatch'],
                code='password_mismatch',
            )
        return password2

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class ProfileForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ["first_name", "last_name", "info"]


class ChangeEmailForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ["email"]


class RecoverPasswordForm(forms.Form):
    email = forms.EmailField()

    def clean(self):
        # Check if the email address is associated to an account
        email = self.cleaned_data.get("email")
        if email:
            if not User.objects.filter(email=email).exists():
                raise forms.ValidationError(
                    _("The email address is not registered"))

        return self.cleaned_data


class ChangePasswordForm(forms.Form):
    old_password = forms.CharField(widget=forms.PasswordInput)
    new_password = forms.CharField(widget=forms.PasswordInput)
    new_password_repeat = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        # Check if passwords match
        new_password1 = self.cleaned_data.get("new_password")
        new_password2 = self.cleaned_data.get("new_password_repeat")

        if new_password1 != new_password2:
            raise forms.ValidationError(_("Passwords don't match"))

        return self.cleaned_data


class ResetPasswordForm(forms.Form):
    new_password = forms.CharField(widget=forms.PasswordInput)
    new_password_repeat = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        # Check if passwords match
        new_password1 = self.cleaned_data.get("new_password")
        new_password2 = self.cleaned_data.get("new_password_repeat")
        if new_password1 != new_password2:
            raise forms.ValidationError(_("Passwords don't match"))
        return self.cleaned_data
