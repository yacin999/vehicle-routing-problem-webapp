from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.views import APIView
from .serializers import CreateUserSerializer
import json
import random
from .solver import vrp_solver, devide_routes

# Create your views here.


class CreateUserAPIView(CreateAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # We create a token than will be used for future auth
        token = Token.objects.create(user=serializer.instance)
        token_data = {"token": token.key}
        return Response(
            {**serializer.data, **token_data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class LogoutUserAPIView(APIView):
    queryset = get_user_model().objects.all()

    def get(self, request, format=None):
        # simply delete the token to force a login
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def solve_vrp(request):
    print("+++++++++ solver view !!!", request.body.decode('utf8'))
    data = json.loads(request.body)

    n = data["numberClients"]
    clients_set = [i for i in range(1, n+1)]
    nodes = [0] + clients_set
    arcs = [(i, j) for i in nodes for j in nodes if i != j]
    vehicle_capacity = 15000
    cost_travel = {}

    for d in data["routes"]:
        t = tuple(map(int, d.split(",")))
        cost_travel[t] = data["routes"][d]

    capacity_for_customer = {
        i: data["capacitysCustomer"][i-1] for i in clients_set}

    active_arcs = vrp_solver(
        nodes, clients_set, arcs, vehicle_capacity, cost_travel, capacity_for_customer)

    print("========= active arcs :", active_arcs)

    devided_routes = devide_routes(active_arcs)

    print("=======  devided routes :", devided_routes)

    response = json.dumps({"activeArcs": active_arcs})
    return Response(response)
