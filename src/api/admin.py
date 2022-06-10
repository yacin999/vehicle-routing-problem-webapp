from django.contrib import admin
from .models import Driver, Customer, Product, Vehicle, Delivery, UserType, Order, OrderItem, DeliveryVehicle

# Register your models here.


class DriverAdmin(admin.ModelAdmin):
    display_fields = '__all__'


class CustomerAdmin(admin.ModelAdmin):
    display_fields = '__all__'


class ProductAdmin(admin.ModelAdmin):
    display_fields = '__all__'


class VehicleAdmin(admin.ModelAdmin):
    display_fields = '__all__'


class DeliveryVehicleAdmin(admin.ModelAdmin):
    display_fields = '__all__'


class DeliveryAdmin(admin.ModelAdmin):
    display_fields = '__all__'


class OrderAdmin(admin.ModelAdmin):
    display_fields = '__all__'


class OrderItemAdmin(admin.ModelAdmin):
    display_fields = '__all__'


class UserTypeAdmin(admin.ModelAdmin):
    display_fields = '__all__'


admin.site.register(Driver, DriverAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(DeliveryVehicle, DeliveryVehicleAdmin)
admin.site.register(Delivery, DeliveryAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(UserType, UserTypeAdmin)
