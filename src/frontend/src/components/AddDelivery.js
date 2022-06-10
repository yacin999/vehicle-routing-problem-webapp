import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import axios from "axios";

function AddDelivery({
  createDelivery,
  sendDataToServer,
  addDepoMarker,
  orders,
  setCurrentTab,
}) {
  const [formData, setFormData] = useState({
    depoCoords: {
      lng: 0.1378,
      lat: 35.3944,
    },
    vehicleCapacity: "",
    availableClients: [],
    selectedClients: [],
  });

  const [availableOrders, setAvailableOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [coordsInputDisabled, setCoordsInputDisabled] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e, type) => {
    const selectedValues = [...e.target.selectedOptions].map(
      (option) => option.value
    );
    if (type === "available") {
      setFormData({
        ...formData,
        availableClients: [...selectedValues],
      });
    } else if (type === "selected") {
      setFormData({
        ...formData,
        selectedClients: [...selectedValues],
      });
    }
  };

  const selectAvailableClients = () => {
    let newAvailableArray = [];
    let newSelectedArray = [];
    availableOrders.forEach((order) => {
      let existed = false;
      formData.availableClients.forEach((client) => {
        if (order.customer.name === client) {
          existed = true;
          newSelectedArray.push(order);
        }
      });
      if (!existed) newAvailableArray.push(order);
    });

    setAvailableOrders([...newAvailableArray]);
    setSelectedOrders([...selectedOrders, ...newSelectedArray]);
  };

  const deselectSelectedClients = () => {
    let newAvailableArray = [];
    let newSelectedArray = [];
    selectedOrders.forEach((order) => {
      let existed = false;
      formData.selectedClients.forEach((client) => {
        if (order.customer.name === client) {
          existed = true;
          newAvailableArray.push(order);
        }
      });
      if (!existed) newSelectedArray.push(order);
    });

    setSelectedOrders([...newSelectedArray]);
    setAvailableOrders([...availableOrders, ...newAvailableArray]);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    createDelivery(formData.depoCoords, selectedOrders);
    setShowPopup(true);
  };

  const handleConfirmSubmitDelivery = () => {
    addDepoMarker(formData.depoCoords.lng, formData.depoCoords.lat);
    sendDataToServer(formData.depoCoords, selectedOrders);
    setCurrentTab(7);
  };

  useEffect(() => {
    setAvailableOrders([...orders]);
  }, []);

  return (
    <div className="add-delivery-container">
      <p>start delivering</p>

      <form onSubmit={handleSubmitForm}>
        <div className="upper-inputs">
          <div className="depo-input input-container">
            <label>depo coords</label>
            <div>
              <input
                type="number"
                placeholder="longitude"
                value={formData.depoCoords.lng}
                disabled={coordsInputDisabled}
                style={{ backgroundColor: coordsInputDisabled && "#e8e8e8" }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    depoCoords: {
                      ...formData.depoCoords,
                      lng: Number(e.target.value),
                    },
                  })
                }
              />
              <input
                type="number"
                placeholder="latitude"
                value={formData.depoCoords.lat}
                disabled={coordsInputDisabled}
                style={{ backgroundColor: coordsInputDisabled && "#e8e8e8" }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    depoCoords: {
                      ...formData.depoCoords,
                      lat: Number(e.target.value),
                    },
                  })
                }
              />
              <GrEdit
                style={{ fontSize: 20, marginLeft: 7, cursor: "pointer" }}
                onClick={() => setCoordsInputDisabled(!coordsInputDisabled)}
              />
            </div>
          </div>
          <div className="vehicle-cap-input input-container">
            <label>vehicle capacity</label>
            <input
              type="number"
              placeholder="Vehicle capacity"
              value={formData.vehicleCapacity}
              onChange={(e) =>
                setFormData({ ...formData, vehicleCapacity: e.target.value })
              }
            />
          </div>
        </div>

        <span className="clients-label">select clients</span>
        <div className="clients-container">
          <div className="available">
            <span>available clients</span>
            <select
              name="orders"
              id="orders"
              multiple
              onChange={(e) => handleChange(e, "available")}
            >
              {availableOrders.map((order, i) => {
                return (
                  <option key={i} value={order.customer.name}>
                    {order.customer.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="clients-btns">
            <FaArrowRight className="icon" onClick={selectAvailableClients} />
            <FaArrowLeft className="icon" onClick={deselectSelectedClients} />
          </div>
          <div className="selected">
            <span>selected clients</span>
            <select
              name="orders"
              id="orders"
              multiple
              onChange={(e) => handleChange(e, "selected")}
            >
              {selectedOrders.map((order, i) => (
                <option key={i} value={order.customer.name}>
                  {order.customer.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input type="submit" value="Submit" />
      </form>
      {showPopup && (
        <div className="confirm-submit-delivery-container">
          <div className="confirm-submit-delivery-popup">
            <p>Are you sure you want to submit</p>
            <div>
              <button className="confirm" onClick={handleConfirmSubmitDelivery}>
                Confirm
              </button>
              <button className="cancel" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddDelivery;
