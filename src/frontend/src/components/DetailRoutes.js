import axios from "axios";
import React, { useState, useEffect } from "react";

function DetailRoutes({
  finalRoutes,
  finalOrders,
  drivers,
  vehicles,
  orderItems,
  serverData,
  setPanelIsClosed,
}) {
  const [routeClients, setrouteClients] = useState([]);

  const calculateSmallestDist = (dist) => {
    const shortDis = dist.reduce((acc, loc) =>
      acc.distance < loc.distance ? acc : loc
    );
    return dist.indexOf(shortDis);
  };

  const generateRoutesDetail = () => {
    let routes = [];

    if (Object.keys(finalRoutes).length <= drivers.length) {
      Object.keys(finalRoutes).map((key, routeIndex) => {
        let route = finalRoutes[key];
        let clientsIndex = [];
        let clients = [];

        // get clients indexes from route arcs
        route.forEach((arc) => {
          for (let i = 0; i < arc.length; i++) {
            if (arc[i] !== 0 && !clientsIndex.includes(arc[i])) {
              clientsIndex.push(arc[i]);
            }
          }
        });

        clientsIndex.forEach((indx) => {
          clients.push(finalOrders[indx - 1]);
        });

        routes.push({
          orders: clients,
          driver: drivers[routeIndex],
          vehicle: vehicles[routeIndex],
          activeArcs: route,
        });
      });
    } else {
      console.log("number of drivers doesn't fit all customers !!!");

      let driverTracker = [];

      Object.keys(finalRoutes).map((key, routeIndex) => {
        let route = finalRoutes[key];
        let clientsIndex = [];
        let clients = [];

        let distance = 0;

        // get clients indexes from route arcs
        route.forEach((arc) => {
          distance += serverData[arc.toString()];

          for (let i = 0; i < arc.length; i++) {
            if (arc[i] !== 0 && !clientsIndex.includes(arc[i])) {
              clientsIndex.push(arc[i]);
            }
          }
        });

        clientsIndex.forEach((indx) => {
          clients.push(finalOrders[indx - 1]);
        });

        if (routeIndex <= drivers.length - 1) {
          driverTracker.push({
            dist: distance,
            driver: drivers[routeIndex],
            vehicle: vehicles[routeIndex],
          });

          routes.push({
            orders: clients,
            driver: drivers[routeIndex],
            vehicle: vehicles[routeIndex],
            activeArcs: route,
          });
        } else {
          let shortestDitanceIndex = calculateSmallestDist(driverTracker);
          driverTracker[shortestDitanceIndex].distance += distance;

          routes.push({
            orders: clients,
            driver: driverTracker[shortestDitanceIndex].driver,
            vehicle: driverTracker[shortestDitanceIndex].vehicle,
            activeArcs: route,
          });
        }
      });
    }

    return routes;
  };

  useEffect(() => {
    let routes = generateRoutesDetail();
    setrouteClients([...routes]);
    axios
      .post("http://127.0.0.1:8000/save-delivery/", routes)
      .then((res) => console.log(" delivery data has saved successfully !!"))
      .catch((err) => console.log("error while trying to save delivery !!!"));
  }, []);

  return (
    <>
      <div className="routes-detail">
        <div className="table" style={styles.table}>
          <div className="row" style={styles.row}>
            <p style={{ ...styles.cell, ...{ flex: 1 } }}>Delivery ID</p>
            <p style={{ ...styles.cell, ...{ flex: 4 } }}>Customers</p>
            <p style={{ ...styles.cell, ...{ flex: 2 } }}>Drivers</p>
            <p style={{ ...styles.cell, ...{ flex: 2 } }}>Vehicles</p>
          </div>
          {routeClients &&
            routeClients.map((route, i) => {
              console.log("inside JSX :", routeClients);
              return (
                <div className="row" style={styles.row} key={i}>
                  <p style={{ ...styles.cell, ...{ flex: 1 } }}>{i + 1}</p>
                  <div style={{ ...styles.cellC, ...{ flex: 4 } }}>
                    {route.orders &&
                      route.orders.map((order, j) => {
                        let total = 0;
                        let capacity = 0;
                        orderItems.map((orderItem) => {
                          if (order.id === orderItem.order.id) {
                            total +=
                              orderItem.product.price * orderItem.quantity;
                            capacity +=
                              orderItem.product.weight * orderItem.quantity;
                          }
                        });
                        return (
                          <div className="customer-card" key={j}>
                            <span style={{ fontSize: 15 }}>
                              {order.customer.name}
                            </span>
                            <span style={{ fontSize: 15 }}>
                              capacity : {capacity}g
                            </span>
                            <span style={{ fontSize: 15 }}>
                              total : {total}$
                            </span>
                          </div>
                        );
                      })}
                  </div>
                  <p style={{ ...styles.cell, ...{ flex: 2 } }}>
                    {route.driver.name}
                  </p>
                  <p style={{ ...styles.cell, ...{ flex: 2 } }}>
                    {route.vehicle.brand}
                    {route.vehicle.id}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
      <button
        className="add-driver-btn"
        onClick={() => setPanelIsClosed(false)}
        style={{ border: "none", backgroundColor: "blue" }}
      >
        Show map
      </button>
    </>
  );
}

export default DetailRoutes;

const styles = {
  table: {
    display: "flex",
    flexDirection: "column",
    width: "90%",
    margin: "10px auto",
    height: "80%",
    overflowY: "scroll",
    scrollbarWidth: "none",
    backgroundColor: "#f7f7f7",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    textAlign: "center",
    border: "1px solid #333",
    width: "100%",
    padding: 15,
    fontSize: 20,
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cellC: {
    textAlign: "center",
    border: "1px solid #333",
    width: "100%",
    padding: 15,
    fontSize: 20,
    color: "#333",
  },
};
