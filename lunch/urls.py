from django.urls import path

from . import views

urlpatterns = [
    path("", views.index_view, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register_view, name="register"),
    path("search", views.search_view, name="search"),
    path("updateCompany", views.update_company_view, name="updateCompany"),
    path("createEvent/<restaurant_id>", views.create_event_view, name="createEvent"),
    path("getEvent/<int:event_id>", views.get_event_view, name="getEvent"),
    path("upcomingLunches", views.upcoming_lunches_view, name="upcomingLunches"),
    path("findColleagues", views.find_colleagues_view, name="findColleagues"),
    path("searchColleagues", views.search_colleagues_view, name="searchColleagues"),
    path("addColleague/<int:user_id>", views.add_colleague_view, name="addColleague"),
    path("getColleague/<int:user_id>", views.get_colleague_view, name="getColleague"),
]