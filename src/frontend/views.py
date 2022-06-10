import random
from asyncio.windows_events import NULL
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
from api.models import Order, OrderItem, Driver, Vehicle, Delivery, DeliveryVehicle
from api.serializers import OrderSerializer, OrderItemSerializer, DriverSerializer, VehicleSerializer


# Create your views here.


def index(request):
    return render(request, "frontend/index.html")


@api_view(["GET"])
def get_map_data(request):

    order = Order.objects.filter(complete=True)
    orderItems = OrderItem.objects.all()
    drivers = Driver.objects.all()
    vehicles = Vehicle.objects.all()

    order_serializer = OrderSerializer(order, many=True)
    driver_serializer = DriverSerializer(drivers, many=True)
    vehicle_serializer = VehicleSerializer(vehicles, many=True)
    orderItem_serializer = OrderItemSerializer(orderItems, many=True)

    # print("====== orderitems :", orderItem_serializer.data)

    response = {
        "orders": order_serializer.data,
        "drivers": driver_serializer.data,
        "vehicles": vehicle_serializer.data,
        "orderItems": orderItem_serializer.data
    }
    return Response(response)


@api_view(["POST"])
def save_delivery(request):
    delivery_data = json.loads(request.body)

    print("_________ delivery data :", delivery_data)

    # generating delivery number :
    delivery_number = ""
    for i in range(0, 15):
        delivery_number += str(random.randint(0, 9))

    delivery = Delivery(delivery_number=delivery_number)
    delivery.save()

    print("\n\n")

    for d_data in delivery_data:
        print("&&&&&&&&& d_data :", d_data["driver"])
        driver = Driver.objects.get(id=d_data["driver"]["id"])
        vehicle = Vehicle.objects.get(id=d_data["vehicle"]["id"])
        delivery_vehicle = DeliveryVehicle(
            driver=driver, vehicle=vehicle, delivery=delivery, active_arcs=json.dumps(d_data["activeArcs"]))
        delivery_vehicle.save()
        for order in d_data["orders"]:
            order = Order.objects.get(id=order["id"])
            order.complete = True
            order.save()
            delivery_vehicle.orders.add(order)

    print("_________ delivery number :", int(delivery_number))

    return Response({"response from server": "(dada has retrieved successfully !!)"})
