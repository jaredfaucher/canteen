from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin import ModelAdmin, TabularInline

from .forms import CanteenUserCreationForm, CanteenUserChangeForm
from .models import Address, CanteenUser, Company, Event

class AddressInlineAdmin(TabularInline):
    model = Address

class CanteenUserInlineAdmin(TabularInline):
    model = CanteenUser
    extra = 1

class CompanyAdmin(ModelAdmin):
    model = Company
    inlines = [CanteenUserInlineAdmin,]

class CanteenUserAdmin(UserAdmin):
    form = CanteenUserChangeForm
    model = CanteenUser
    list_display = ['email', 'username', 'company']

admin.site.register(Address)
admin.site.register(Company, CompanyAdmin)
admin.site.register(CanteenUser, CanteenUserAdmin)
admin.site.register(Event)