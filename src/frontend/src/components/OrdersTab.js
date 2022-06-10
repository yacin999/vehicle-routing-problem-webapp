import React from "react";
import { AiOutlineCheck } from "react-icons/ai";

function OrdersTab({ orders, orderItems }) {
  return (
    <div className="table" style={styles.table}>
      <div
        className="row header"
        style={{ ...styles.row, ...styles.rowHeader }}
      >
        <p style={{ ...styles.column, ...styles.columnHeader }}>customer</p>
        <p style={{ ...styles.column, ...styles.columnHeader }}>products</p>
        <p style={{ ...styles.column, ...styles.columnHeader }}>total</p>
        <p style={{ ...styles.column, ...styles.columnHeader }}>status</p>
      </div>

      {orders.length > 0 ? (
        orders.map((order, i) => {
          let total = 0;
          return (
            <div className="row" key={i} style={styles.row}>
              <div className="column" style={styles.column}>
                {order.customer.name}
              </div>
              <div
                className="column"
                style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}
              >
                {orderItems.map((orderItem, j) => {
                  if (order.id === orderItem.order.id) {
                    total += orderItem.quantity * orderItem.product.price;
                    return (
                      <div key={j} className="row" style={styles.innerRow}>
                        <img
                          src={orderItem.product.image}
                          style={styles.image}
                        />
                        <div style={styles.productInfos}>
                          <span style={{ fontSize: 20, marginBottom: 5 }}>
                            {orderItem.product.name}
                          </span>
                          <span
                            style={{
                              fontSize: 15,
                              marginBottom: 5,
                              color: "#333",
                            }}
                          >
                            quantity : {orderItem.quantity}
                          </span>
                          <span
                            style={{
                              fontSize: 15,
                              marginBottom: 5,
                              color: "#333",
                            }}
                          >
                            weight : {orderItem.product.weight} g
                          </span>
                          <span
                            style={{
                              fontSize: 15,
                              color: "#0063bb",
                              marginBottom: 5,
                            }}
                          >
                            ${orderItem.product.price}
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="column" style={styles.column}>
                {"$" + total}
              </div>
              <div className="column" style={styles.column}>
                <span style={styles.productStatus}>
                  delivered <AiOutlineCheck />
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ textAlign: "center", marginTop: 30, color: "#333" }}>
          no orders yet to show
        </p>
      )}
    </div>
  );
}

export default OrdersTab;

const styles = {
  table: {
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    height: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "2px solid #DDD",
  },
  columnHeader: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  rowHeader: {
    borderBottom: "1px solid #DDD",
  },
  innerRow: {
    borderBottom: "1px solid #DDD",
    padding: 10,
    display: "flex",
    alignItems: "center",
  },
  column: {
    padding: 10,
    display: "flex",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: "100px",
    marginRight: "10px",
  },
  productInfos: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  productStatus: {
    display: "flex",
    alignItems: "center",
    color: "green",
  },
};
