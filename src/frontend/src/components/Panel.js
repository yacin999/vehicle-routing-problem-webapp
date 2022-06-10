import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";
import * as tMaps from "@tomtom-international/web-sdk-maps";
import * as tServices from "@tomtom-international/web-sdk-services";
import OrdersTab from "./OrdersTab";
import DriversTab from "./DriversTab";
import CustomersTab from "./CustomersTab";
import DelivriesTab from "./DelivriesTab";
import axios from "axios";
import { colors } from "../utils";
import AddDelivery from "./AddDelivery";
import VehiclesTab from "./VehiclesTab";
import DetailRoutes from "./DetailRoutes";

function Panel({ map }) {
  const [panelIsClosed, setPanelIsClosed] = useState(false);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [currentTab, setCurrentTab] = useState(1);
  const [serverData, setServerData] = useState({});
  const [finalRoutes, setFinalRoutes] = useState(null);
  const [finalOrders, setFinalOrders] = useState([]);

  // const [originLoc, setOriginLoc] = useState({
  //   lng: 0.1378,
  //   lat: 35.3944,
  // });

  const addMarker = (lng, lat) => {
    const element = document.createElement("div");
    element.className = "marker";
    const marker = new tMaps.Marker({
      element: element,
    });

    marker.setLngLat([lng, lat]);
    marker.addTo(map);
  };

  const addDepoMarker = (lng, lat) => {
    const element = document.createElement("div");
    element.className = "depo-marker";
    const marker = new tMaps.Marker({
      element: element,
    });

    marker.setLngLat([lng, lat]);
    marker.addTo(map);
  };

  // ======= Helpfull functions
  const convertToPoints = (lngLat) => {
    return {
      point: {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      },
    };
  };

  const goAddDelivery = () => {
    setCurrentTab(6);
  };

  // ======== Main functions

  const createLocations = (origin, selectedOrders) => {
    let destinations = [];
    destinations.push(origin);
    selectedOrders.forEach((order) => {
      let coords = order.destination.split(",");
      destinations.push({
        lng: Number(coords[0]),
        lat: Number(coords[1]),
      });
    });
    return destinations;
  };

  const calculateTravelCost = (origin, selectedOrders) => {
    return new Promise((resolve, reject) => {
      const allDestinations = createLocations(origin, selectedOrders);
      let arcs = [];
      let arcIndex = 0;
      let travelCost = {};
      let allConvertedDestinations = allDestinations.map((location) => {
        return convertToPoints(location);
      });

      allConvertedDestinations.forEach((originLoc, i) => {
        let pointsForParameters = [];
        allConvertedDestinations.forEach((location, j) => {
          if (
            i !== j &&
            location.point.latitude !== originLoc.point.latitude &&
            location.point.longitude !== originLoc.point.longitude
          ) {
            pointsForParameters.push(location);
            arcs.push([i, j]);
          }
        });

        const callParameters = {
          key: "I6kBz902v7AXAGvD9J7DNysPz9DkfQMP",
          destinations: pointsForParameters,
          origins: [originLoc],
        };
        tServices.services
          .matrixRouting(callParameters)
          .then((matrixApiResults) => {
            const results = matrixApiResults.matrix[0];
            results.forEach((result, index) => {
              let drivingTime =
                result.response.routeSummary.travelTimeInSeconds;

              Object.assign(travelCost, {
                [arcs[arcIndex]]: drivingTime,
              });
              arcIndex++;
            });
          })
          .catch((err) => console.log("(MatrixRouting said) : ERROR", err));
      });
      resolve(travelCost);
    });
  };

  const drawRoute = (geoJson, routeId, lineColor) => {
    map.addLayer({
      id: `route${routeId}`,
      type: "line",
      source: {
        type: "geojson",
        data: geoJson,
      },
      paint: {
        "line-color": lineColor,
        "line-width": 2,
      },
    });
  };

  const createDelivery = (origin, selectedOrders) => {
    calculateTravelCost(origin, selectedOrders).then((travelCost) => {
      console.log("========== testing travel cost", travelCost);
      setServerData(travelCost);
    });
  };

  const generateVehicleDelivery = (arcs) => {
    let routes = {};
    let routeIndex = 1;

    arcs.forEach((arc) => {
      if (arc[0] === 0) {
        routes[`route_${routeIndex}`] = [arc];
        routeIndex++;
      }
    });

    Object.keys(routes).forEach((key) => {
      let next = routes[key][0][1];
      let i = 0;

      while (true) {
        if (next === arcs[i][0]) {
          routes[key].push(arcs[i]);
          next = arcs[i][1];

          if (arcs[i][1] === 0) break;
        }
        i++;
        if (i >= arcs.length) i = 0;
      }
    });

    return routes;
  };

  const sendDataToServer = (origin, selectedOrders) => {
    let capacitysCustomer = [];

    selectedOrders.forEach((order) => {
      let capacity = 0;
      orderItems.forEach((orderItem) => {
        if (order.id === orderItem.order.id) {
          capacity += orderItem.product.weight * orderItem.quantity;
        }
      });
      capacitysCustomer.push(capacity);
    });
    console.log("testing server data :", serverData);
    axios
      .post("http://127.0.0.1:8000/vrp-api/solver/", {
        routes: serverData,
        numberClients: selectedOrders.length,
        capacitysCustomer: capacitysCustomer,
      })
      .then((response) => {
        const activeArcs = JSON.parse(response.data).activeArcs;
        const nodes = createLocations(origin, selectedOrders);
        const routes = generateVehicleDelivery(activeArcs);
        setFinalRoutes(routes);
        setFinalOrders(selectedOrders);

        let pathIndex = 1;

        Object.keys(routes).forEach((key, routeindex) => {
          let route = routes[key];
          route.forEach((arc, i) => {
            const formattedLocation = `${nodes[arc[0]].lng},${
              nodes[arc[0]].lat
            }:${nodes[arc[1]].lng},${nodes[arc[1]].lat}`;

            setTimeout(() => {
              tServices.services
                .calculateRoute({
                  key: "I6kBz902v7AXAGvD9J7DNysPz9DkfQMP",
                  locations: formattedLocation,
                })
                .then((routeData) => {
                  pathIndex++;
                  const geoJson = routeData.toGeoJson();
                  console.log("calculateRoute ===>>", geoJson);
                  drawRoute(geoJson, pathIndex, colors[routeindex]);
                });
            }, i * 3000);
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/panel/")
      .then((res) => {
        console.log("response :", res);
        setOrders(res.data.orders);
        setDrivers(res.data.drivers);
        setVehicles(res.data.vehicles);
        setOrderItems(res.data.orderItems);
        res.data.orders.forEach((order, i) => {
          let coords = order.destination.split(",");
          addMarker(Number(coords[0]), Number(coords[1]));
        });
      })
      .catch((error) => console.log("error from server ", error));

    return () => map.remove();
  }, []);

  return (
    <>
      <FiMenu className="menu-icon" onClick={() => setPanelIsClosed(true)} />
      {panelIsClosed && (
        <div className="panel">
          <div className="panel-popup">
            <AiFillCloseCircle
              onClick={() => setPanelIsClosed(false)}
              className="close-icon"
            />
            <a className="admin-panel-link" href="http://127.0.0.1:8000/admin/">
              Admin Panel
            </a>
            <div className="panel-content">
              <ul className="panel-tabs">
                <li
                  className="hovered"
                  style={currentTab === 1 ? styles.activeTab : null}
                  onClick={() => {
                    setCurrentTab(1);
                    console.log("server data", serverData);
                  }}
                >
                  Customers
                </li>
                <li
                  className="hovered"
                  style={currentTab === 2 ? styles.activeTab : null}
                  onClick={() => setCurrentTab(2)}
                >
                  Orders
                </li>
                <li
                  className="hovered"
                  style={currentTab === 3 ? styles.activeTab : null}
                  onClick={() => setCurrentTab(3)}
                >
                  Drivers
                </li>
                <li
                  className="hovered"
                  style={
                    currentTab === 4 || currentTab === 6 || currentTab === 7
                      ? styles.activeTab
                      : null
                  }
                  onClick={() => setCurrentTab(4)}
                >
                  Delivries
                </li>
                <li
                  className="hovered"
                  style={currentTab === 5 ? styles.activeTab : null}
                  onClick={() => setCurrentTab(5)}
                >
                  Vehicles
                </li>
              </ul>
              <div className="content">
                {currentTab === 1 ? (
                  <CustomersTab orders={orders} />
                ) : currentTab === 2 ? (
                  <OrdersTab orders={orders} orderItems={orderItems} />
                ) : currentTab === 3 ? (
                  <DriversTab drivers={drivers} />
                ) : currentTab === 4 ? (
                  <DelivriesTab
                    goAddDelivery={goAddDelivery}
                    setCurrentTab={setCurrentTab}
                  />
                ) : currentTab === 5 ? (
                  <VehiclesTab />
                ) : currentTab === 6 ? (
                  <AddDelivery
                    createDelivery={createDelivery}
                    sendDataToServer={sendDataToServer}
                    addDepoMarker={addDepoMarker}
                    orders={orders}
                    setCurrentTab={setCurrentTab}
                  />
                ) : currentTab === 7 &&
                  finalRoutes &&
                  finalOrders &&
                  drivers &&
                  vehicles ? (
                  <DetailRoutes
                    finalRoutes={finalRoutes}
                    finalOrders={finalOrders}
                    orderItems={orderItems}
                    drivers={drivers}
                    vehicles={vehicles}
                    serverData={serverData}
                    setPanelIsClosed={setPanelIsClosed}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Panel;

const styles = {
  activeTab: {
    borderBottomWidth: 4,
    borderBottomStyle: "solid",
    borderBottomColor: "rgb(0, 99, 187)",
    color: "#000",
    backgroundColor: "rgb(232, 252, 255)",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
};
