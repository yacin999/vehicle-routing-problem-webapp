from django.db import models
from django.contrib.auth.models import User
from django.core.validators import validate_comma_separated_integer_list

USER_TYPES = [("1", "customer"), ("2", "driver")]
CATEGORIES = [("1", "clothes"), ("2", "electonics"), ("3", "toys")]


class Customer(models.Model):
    user = models.OneToOneField(
        User, null=True, blank=True, on_delete=models.CASCADE, related_name="customer")
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=150)
    email = models.EmailField()

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=150)
    image = models.ImageField(upload_to='products', blank=True)
    price = models.PositiveIntegerField()
    weight = models.FloatField()
    description = models.CharField(max_length=400, null=True, blank=True)
    category = models.CharField(max_length=150, choices=CATEGORIES)

    def __str__(self):
        return "product : {}".format(self.name)


class Driver(models.Model):
    name = models.CharField(max_length=100)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="driver")

    def __str__(self) -> str:
        return self.name


class Vehicle(models.Model):
    brand = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()
    registration_num = models.PositiveSmallIntegerField()

    def __str__(self):
        return self.brand


class Delivery(models.Model):
    depo_coords = models.CharField(max_length=150, default="0.1378, 35.3944")
    delivery_number = models.CharField(max_length=15)
    started_at = models.DateTimeField(auto_now_add=True)

    @property
    def calculate_clients_number(self):
        clients_number = 0
        vehicle_deliveries = self.delivery_vehicles.all()

        for d in vehicle_deliveries:
            clients_number = clients_number + len(d.orders.all())

        return clients_number

    def __str__(self):
        return "delivery_{}".format(self.id)


class DeliveryVehicle(models.Model):
    delivered_at = models.DateTimeField(auto_now_add=True)
    driver = models.ForeignKey(
        Driver, on_delete=models.CASCADE, related_name="delivery_vehicles")
    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, related_name="delivery_vehicles")
    delivery = models.ForeignKey(
        Delivery, on_delete=models.CASCADE, related_name="delivery_vehicles")
    active_arcs = models.JSONField()

    def __str__(self) -> str:
        return "delivery_vehicle_{}".format(self.id)


class Order(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="orders")
    created = models.DateTimeField(auto_now_add=True)
    destination = models.CharField(max_length=150)
    deliveryVehicle = models.ForeignKey(
        DeliveryVehicle, on_delete=models.CASCADE, related_name="orders", null=True, blank=True)
    complete = models.BooleanField(default=False)
    transation_id = models.CharField(max_length=100, null=True)

    def __str__(self):
        return "demand_{}_{}".format(self.id, self.customer.name)


class OrderItem(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="order_items")
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="order_items")
    quantity = models.IntegerField(default=0, null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.name

    @property
    def get_total(self):
        return self.quantity * self.product.price


class UserType(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="user_type")
    type = models.CharField(choices=USER_TYPES, max_length=20)

    def __str__(self):
        return "{}-{}".format(self.id, self.user)
