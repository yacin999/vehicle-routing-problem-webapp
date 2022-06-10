import React from "react";

function DriversTab({ drivers }) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <td style={{ fontWeight: "bold", fontSize: 20 }}>name</td>
            <td style={{ fontWeight: "bold", fontSize: 20 }}>email</td>
            <td style={{ fontWeight: "bold", fontSize: 20 }}>status</td>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver, index) => {
            return (
              <tr key={index}>
                <td>{driver.name}</td>
                <td>{driver.user.email}</td>
                <td>
                  <span style={styles.availablStatus}>occupied</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <a
        href="http://127.0.0.1:8000/admin/api/driver/add/"
        className="add-driver-btn"
      >
        Add driver
      </a>
    </>
  );
}

export default DriversTab;

const styles = {
  occupiedStatus: {
    backgroundColor: "red",
    padding: "5px 10px",
    color: "#FFF",
    borderRadius: 3,
    fontWeight: "bold",
  },
  availablStatus: {
    backgroundColor: "green",
    padding: "5px 10px",
    color: "#FFF",
    borderRadius: 3,
    fontWeight: "bold",
  },
};
