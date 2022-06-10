from django.db import models

# Create your models here.


class Solver(models.Model):
    nbr_clients = models.PositiveSmallIntegerField()
    vehicle_capacity = models.FloatField()

    def calculate_N(self, n):
        li = [i for i in range(1, n+1)]
        return li

    def calculate_nodes(self, n):
        nodes = [0] + self.calculate_N(n)
        return nodes

    def calculate_goods_customer(self, n, amount):
        goods = {i: amount for i in n}
        return goods

    def calculate_posible_acrs(self, v):
        arcs = [(i, j) for i in v for j in v if i != j]
        return arcs

    def calculate_cost_travel_arcs(self, cost, arcs):
        cost = {(i, j): cost for i, j in arcs}
        return cost
