

from django.urls import path
from . import views


urlpatterns = [
    path("map/", views.index, name="index"),
    path("panel/", views.get_map_data, name="panel"),
    path("save-delivery/", views.save_delivery, name="save_delivery"),
]
