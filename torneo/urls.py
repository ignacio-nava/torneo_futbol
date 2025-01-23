from django.urls import path

from .views import torneo_view, torneo_json_view


app_name = "torneo"
urlpatterns = [
    path("", torneo_view, name="home"),
    path('api/torneo/<int:id>/', torneo_json_view, name='torneo-json'),
]