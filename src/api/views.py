import json
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, permissions, authentication

from .serializers import CustomerSerializer, ProductSerializer, OrderSerializer, DeliveryVehicleSerializer, OrderItemSerializer
from .models import Customer, Product, Order, OrderItem, Driver

# Create your views here.


# @api_view(["GET"])
# def get_customers(request):

#     customers = Customer.objects.all()

#     if request.method == "GET":
#         serializer = CustomerSerializer(customers, many=True)

#         return Response(serializer.data)

#     return Response({"message": "this is a wrong reqeust !!"})


# @api_view(['POST'])
# def create_customer(request):

#     if request.method == 'POST':
#         serializer = CustomerSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    # authentication_classes = [authentication.TokenAuthentication]

    serializer_class = CustomerSerializer

    queryset = Customer.objects.all()


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [
        # permissions.IsAuthenticated
        permissions.AllowAny
    ]
    # authentication_classes = [authentication.TokenAuthentication]

    serializer_class = ProductSerializer

    queryset = Product.objects.all()


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [
        # permissions.IsAuthenticated
        permissions.IsAuthenticated
    ]
    # authentication_classes = [authentication.TokenAuthentication]

    serializer_class = OrderSerializer

    queryset = Order.objects.all()


@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def ckeckout(request):
    data = json.loads(request.body)
    print("======REQUEST HEADER :", request.headers)

    print("======= USER", request.user)

    customer = request.user.customer
    order = Order.objects.create(
        complete=True, customer=customer, destination="{}, {}".format(data["userLocation"]["longitude"], data["userLocation"]["latitude"]))

    for item in data["userPurchases"]:
        product = Product.objects.get(id=item["product"]["id"])
        order_item = OrderItem.objects.create(
            product=product, order=order, quantity=item["itemQuanity"])
        order.order_items.add(order_item)

    print("data were recieved to the CLIENT successfylly !!", data)

    return Response({"message": "response from server"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def driver_mission(request):
    driver = Driver.objects.get(id=request.user.driver.id)
    
    deliveries = driver.delivery_vehicles.all()
    orders = Order.objects.all()
    order_items = OrderItem.objects.all()
    
    
    delivery_serializer = DeliveryVehicleSerializer(deliveries, many=True)
    order_serializer = OrderSerializer(orders, many=True)
    orderItem_serializer = OrderItemSerializer(order_items, many=True)
    
    response = {
        "deliveries" : delivery_serializer.data,
        "orders" : order_serializer.data,
        "orderItems" : orderItem_serializer.data
    }
    
    return Response(response)
    
    
    
    
    
    