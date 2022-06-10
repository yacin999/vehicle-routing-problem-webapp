import React from "react";

function CustomersTab({ orders }) {
  return (
    <table>
      <thead>
        <tr>
          <td style={{ fontWeight: "bold", fontSize: 20 }}>name</td>
          <td style={{ fontWeight: "bold", fontSize: 20 }}>address</td>
          <td style={{ fontWeight: "bold", fontSize: 20 }}>email</td>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => {
          return (
            <tr key={index}>
              <td>{order.customer.name}</td>
              <td>{order.customer.address}</td>
              <td>{order.customer.email}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default CustomersTab;
