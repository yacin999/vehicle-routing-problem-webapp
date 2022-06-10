from docplex.mp.model import Model


def vrp_solver(nodes, clients_set, arcs, vehicle_capacity, cost_travel, capacity_for_customer):

    mdl = Model('CVRP')
    x = mdl.binary_var_dict(arcs, name='x')
    u = mdl.continuous_var_dict(clients_set, ub=vehicle_capacity, name='u')

    mdl.minimize(mdl.sum(cost_travel[i, j] * x[i, j] for i, j in arcs))

    mdl.add_constraints(
        mdl.sum(x[i, j] for j in nodes if j != i) == 1 for i in clients_set)
    mdl.add_constraints(
        mdl.sum(x[i, j] for i in nodes if i != j) == 1 for j in clients_set)
    mdl.add_indicator_constraints(mdl.indicator_constraint(
        x[i, j], u[i]+capacity_for_customer[j] == u[j]) for i, j in arcs if i != 0 and j != 0)
    mdl.add_constraints(u[i] >= capacity_for_customer[i] for i in clients_set)
    solution = mdl.solve(log_output=False)

    active_arcs = [a for a in arcs if x[a].solution_value > 0.9]

    return active_arcs


def devide_routes(arcs):
    routes = {}
    routeIndex = 1
    for arc in arcs:
        if arc[0] == 0:
            routes["route_{}".format(routeIndex)] = [arc]
            routeIndex = routeIndex+1

    for key in routes:
        next = routes[key][0][1]
        i = 0

        while True:
            if next == arcs[i][0]:
                routes[key].append(arcs[i])
                next = arcs[i][1]

                if arcs[i][1] == 0:
                    break
            i = i+1
            if i >= len(arcs):
                i = 0
    return routes
