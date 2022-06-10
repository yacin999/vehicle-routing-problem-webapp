from . import views
from django.urls import path
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'products', views.ProductViewSet, basename="product")
router.register(r'customers', views.CustomerViewSet, basename="customer")
router.register(r'orders', views.OrderViewSet, basename="order")


urlpatterns = [
    # path('customers/', views.get_customers, name='customers'),
    # path('create-customer/', views.create_customer, name='create_customer')
    path('checkout/', views.ckeckout, name='checkout'),
    path('get-driver-mission/', views.driver_mission, name='driver_mission')
]

urlpatterns += router.urls
