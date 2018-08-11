from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AuthenticationForm
from .models import CanteenUser, Company

class CanteenUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = CanteenUser
        fields = ('username', 'email', 'first_name', 'last_name')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control', 'placeholder': 'username'})
        self.fields['email'].widget.attrs.update({'class': 'form-control', 'placeholder': 'email@example.com'})
        self.fields['email'].required = True
        self.fields['first_name'].widget.attrs.update({'class': 'form-control', 'placeholder': 'first name'})
        self.fields['first_name'].required = True
        self.fields['last_name'].widget.attrs.update({'class': 'form-control', 'placeholder': 'last name'})
        self.fields['last_name'].required = True
        self.fields['password1'].widget.attrs.update({'class': 'form-control', 'placeholder': 'password'})
        self.fields['password2'].widget.attrs.update({'class': 'form-control', 'placeholder': 'confirm'})

class CanteenUserChangeForm(UserChangeForm):

    class Meta:
        model = CanteenUser
        fields = ('username', 'email', 'company')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

class CanteenAuthenticationForm(AuthenticationForm):
    def __init__(self, request=None, *args, **kwargs):
        super().__init__(request, *args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control', 'placeholder': 'username'})
        self.fields['password'].widget.attrs.update({'class': 'form-control', 'placeholder': 'password'})