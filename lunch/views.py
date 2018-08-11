from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, render_to_response
from django.urls import reverse
from django.utils.timezone import make_aware
from datetime import datetime
from django.db.models import Q

import os
import json
import logging
import requests

from .forms import CanteenUserCreationForm, CanteenAuthenticationForm
from .models import CanteenUser, Company, Address, Event

logger = logging.getLogger(__name__)

if not os.getenv("API_KEY"):
    raise RuntimeError("API_KEY is not set")

API_KEY = os.getenv("API_KEY")
YELP_SEARCH_URL = 'https://api.yelp.com/v3/businesses/search'
YELP_BUSINESS_URL = 'https://api.yelp.com/v3/businesses/'

def index_view(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('login'))
    context = {'user': request.user,
               'upcoming_lunches': Event.objects.filter(attendees = request.user),
               'companies': Company.objects.all()}
    return render(request, 'lunch/index.html', context)

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username'].lower()
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            form = CanteenAuthenticationForm()
            context = {'form': form, 'message': 'Invalid credentials.'}
            return render(request, 'lunch/login.html', context)
    form = CanteenAuthenticationForm()
    context = {'form': form, 'message': None}
    return render(request, 'lunch/login.html', context)


def register_view(request):
    if request.method == 'POST':
        username = request.POST['username'].lower()
        email = request.POST['email'].lower()
        password = request.POST['password1']
        passwordConfirm = request.POST['password2']
        firstName = request.POST['first_name']
        lastName = request.POST['last_name']

        if password != passwordConfirm:
            form = CanteenUserCreationForm()
            context = {'form': form, 'message': 'Passwords do not match'}
            return render(request, 'lunch/register.html', context)  
        
        user = CanteenUser.objects.create_user(username, email, password)
        user.first_name = firstName
        user.last_name = lastName
        user.save()
        login(request, user) 
        return HttpResponseRedirect(reverse('index'))   
    
    if not request.user.is_authenticated:
        form = CanteenUserCreationForm()
        context = {'form': form, 'message': None}
        return render(request, 'lunch/register.html', context)  
    return HttpResponseRedirect(reverse('index'))

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('login'))

def search_view(request):
    if request.user.is_authenticated:
        if request.method == 'POST':

            data = json.loads(request.body)
            term = data['search_term']
            location = f'{request.user.company.address}'

            headers = {'Authorization': f'Bearer {API_KEY}'}
            payload = {'term': term, 'location': location}

            try:
                response = requests.get(YELP_SEARCH_URL, headers=headers, params=payload)
            except requests.exceptions.RequestException as e:
                logger.error(f'{e}')
            
            context = {'restaurants': []}
            restaurants = response.json()['businesses']
            for restaurant in restaurants:
                context['restaurants'].append(restaurant)

            return render_to_response('lunch/search_results.html', context)
        else:
            return render_to_response('lunch/search_results.html')


def update_company_view(request):
    if request.user.is_authenticated:
        if request.method == 'POST':

            data = json.loads(request.body)
            newCompany = data['new_company']
            if newCompany is True:
                company_name = data['company_name']
                address1 = data['address_1']
                address2 = data['address_2']
                city = data['city']
                state = data['state']
                zipcode = data['zipcode']

                address = Address(address1=address1, address2=address2,
                                  city=city, state=state, zipcode=zipcode)
                address.save()
                company = Company(name=company_name, address=address)
                company.save()
            else:
                company = Company.objects.get(id=data['company_id'])
            
            request.user.company = company
            request.user.save()
            context = {'user': request.user,
                       'companies': Company.objects.all(),
                       'success': True}
            return render_to_response('lunch/update_company_modal_body.html', context)
        else:
            context = {'user': request.user,
                       'companies': Company.objects.all()}
            return render_to_response('lunch/update_company_modal_body.html', context)

def create_event_view(request, restaurant_id):
    if request.user.is_authenticated:
        headers = {'Authorization': f'Bearer {API_KEY}'}
        try:
            response = requests.get(f'{YELP_BUSINESS_URL}{restaurant_id}', headers=headers)
        except requests.exceptions.RequestException as e:
            logger.error(f'{e}')

        if request.method == 'POST':
            data = json.loads(request.body)
            date = data['event_date'].split('-')
            time = data['event_time'].split(':')
            eventTime = make_aware(datetime(int(date[0]),int(date[1]),int(date[2]),int(time[0]),int(time[1])))
            event = Event(restaurantId=data['restaurant_id'],
                          restaurantName=response.json()['name'], 
                          eventTime=eventTime,
                          creator=request.user)
            event.save();
            event.attendees.add(request.user)
            for attendee in data['attendees']:
                attendeeUser = CanteenUser.objects.get(id=attendee['id'])
                event.attendees.add(attendeeUser)
            event.save();
            context = {'user': request.user,
                       'event': event,
                       'restaurant': response.json()}
            return render_to_response('lunch/create_event_modal_body.html', context)
        else:

            context = {'user': request.user,
                       'restaurant': response.json()}
            return render_to_response('lunch/create_event_modal_body.html', context)

def upcoming_lunches_view(request):
    if request.user.is_authenticated:
        context = {'upcoming_lunches': Event.objects.filter(attendees = request.user)}
        return render_to_response('lunch/upcoming_lunches_card.html', context)

def find_colleagues_view(request):
    if request.user.is_authenticated:
        context = {'user': request.user,
                   'upcoming_lunches': Event.objects.filter(attendees = request.user),
                   'companies': Company.objects.all()}
        return render(request, 'lunch/find_colleagues.html', context)

def search_colleagues_view(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            data = json.loads(request.body)
            term = data['search_term']
            query = Q(first_name__icontains=term) | Q(last_name__icontains=term) | Q(company__name__icontains=term)
            results = CanteenUser.objects.exclude(colleagues=request.user).exclude(id=request.user.id).filter(query)
            if results:
                context = {'colleagues': results}
            else:
                context = {'no_results': True}
            return render_to_response('lunch/colleague_search_results.html', context)
        else:
            return render_to_response('lunch/colleague_search_results.html')

def add_colleague_view(request, user_id):
    if request.user.is_authenticated and request.method == 'POST':
        newColleague = CanteenUser.objects.get(id=user_id)
        request.user.colleagues.add(newColleague)
        request.user.save()
        context = {'user': request.user}
        return render_to_response('lunch/colleagues_card.html', context)

def get_colleague_view(request, user_id):
    if request.user.is_authenticated:
        colleague = CanteenUser.objects.get(id=user_id)
        context = {'colleague': colleague}
        return render_to_response('lunch/view_colleague_modal_content.html', context)


def get_event_view(request, event_id):
    if request.user.is_authenticated:
        event = Event.objects.get(id=event_id)
        context = {'user': request.user, 'event': event}
        return render_to_response('lunch/view_event_modal_body.html', context)