from rest_framework import serializers
from .models import Customer, Product, Order, OrderItem, Driver, Vehicle, DeliveryVehicle, Delivery


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ['name', 'address', 'email']


class DriverSerializer(serializers.ModelSerializer):

    class Meta:
        model = Driver
        fields = '__all__'
        depth = 1


class VehicleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vehicle
        fields = '__all__'
        depth = 1


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'
        depth = 1


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = '__all__'
        depth = 1


class DeliveryVehicleSerializer(serializers.ModelSerializer):

    class Meta:
        model = DeliveryVehicle
        fields = '__all__'
        depth = 2


class DeliverySerializer(serializers.ModelSerializer):

    class Meta:
        model = Delivery
        fields = '__all__'
        depth = 2
