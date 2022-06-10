import React from "react";
import { BsTrash } from "react-icons/bs";

function DelivriesTab({ goAddDelivery, setCurrentTab }) {
  return (
    <>
      {/*  <div className="delivery" style={styles.delivery}>
      {/* <span>depo coordinates</span>
      <input type="text" placeholder="longitude" />
      <input type="text" placeholder="latitude" />
      <input type="text" placeholder="max of clients" />
      <input type="submit" value="add" />
      <button>create delivery</button> 
      <button
        style={{
          backgroundColor: "red",
          color: "#fff",
          padding: 20,
          cursor: "pointer",
        }}
        onClick={createDelivery}
      >
        generate routes
      </button>
      <button onClick={sendDataToServer}>send data</button>




      <div className="left" style={styles.left}>
        <div className="card" style={styles.card}>
          <BsTrash style={styles.removeIcon} />
          <p>ghorbal bought laptop</p>
        </div>
        <div className="card" style={styles.card}>
          <BsTrash style={styles.removeIcon} />
          <p>ghorbal bought laptop</p>
        </div>
        <div className="card" style={styles.card}>
          <BsTrash style={styles.removeIcon} />
          <p>ghorbal bought laptop</p>
        </div>
        <div className="card" style={styles.card}>
          <BsTrash style={styles.removeIcon} />
          <p>ghorbal bought laptop</p>
        </div>
        <div className="card" style={styles.card}>
          <BsTrash style={styles.removeIcon} />
          <p>ghorbal bought laptop</p>
        </div>
        <div className="card" style={styles.card}>
          <BsTrash style={styles.removeIcon} />
          <p>ghorbal bought laptop</p>
        </div>
        <div className="card" style={styles.card}>
          <BsTrash style={styles.removeIcon} />
          <p>ghorbal bought laptop</p>
        </div>
      </div>
      <div className="right" style={styles.right}>
        <p style={{ color: "#333" }}>Table of Routes</p>
        <p onClick={sendDataToServer}>send data</p>

        <div className="table" style={styles.table}>
          <div className="row" style={styles.row}>
            <p style={styles.cell}>delivery ID</p>
            <p style={styles.cell}>customers</p>
          </div>
          <div className="row" style={styles.row}>
            <p style={styles.cell}>1</p>
            <p style={styles.cell}>Ghorbal Ibrahim</p>
          </div>
          <div className="row" style={styles.row}>
            <p style={styles.cell}>2</p>
            <p style={styles.cell}>Kelalech Omar</p>
          </div>
          <div className="row" style={styles.row}>
            <p style={styles.cell}>2</p>
            <p style={styles.cell}>Kelalech Omar</p>
          </div>
          <div className="row" style={styles.row}>
            <p style={styles.cell}>2</p>
            <p style={styles.cell}>Kelalech Omar</p>
          </div>
          <div className="row" style={styles.row}>
            <p style={styles.cell}>2</p>
            <p style={styles.cell}>Kelalech Omar</p>
          </div>
        </div>
        <button style={styles.generateRouteBtn} onClick={createDelivery}>
          Generate Routes
        </button>
      </div> 
    </div> */}

      <table>
        <thead>
          <tr>
            <td style={{ fontWeight: "bold", fontSize: 20 }}>Delivery ID</td>
            <td style={{ fontWeight: "bold", fontSize: 20 }}>
              number of vehicles
            </td>
            <td style={{ fontWeight: "bold", fontSize: 20 }}>
              number of clients
            </td>
            <td style={{ fontWeight: "bold", fontSize: 20 }}>Depository</td>
            <td style={{ fontWeight: "bold", fontSize: 20 }}>
              Date of delivering
            </td>
            <td style={{ fontWeight: "bold", fontSize: 20 }}>Status</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <p
                onClick={() => setCurrentTab(7)}
                style={{ color: "#0063bb", cursor: "pointer" }}
              >
                0047002300345072679
              </p>
            </td>
            <td>3</td>
            <td>10</td>
            <td>Oran</td>
            <td>5-30-2022</td>
            <td>mission completed</td>
          </tr>
        </tbody>
      </table>

      <a className="add-driver-btn" onClick={goAddDelivery}>
        New Delivery
      </a>
    </>
  );
}

export default DelivriesTab;

const styles = {
  delivery: {
    display: "flex",
    // height: "100%",
  },
  // left: {
  //   flex: "6 1 0%",
  //   marginRight: 40,
  //   height: "100%",
  //   overflowY: "scroll",
  //   scrollbarWidth: "none",
  //   padding: 10,
  //   borderBottom: "1px solid #ddd",
  //   backgroundColor: "#f7f7f7",
  // },
  // card: {
  //   padding: 20,
  //   borderRadius: 5,
  //   boxShadow: "rgb(0, 0, 0) 0px 1px 3px",
  //   marginBottom: 30,
  //   position: "relative",
  //   backgroundColor: "#FFF",
  // },
  // removeIcon: {
  //   position: "absolute",
  //   right: 5,
  //   top: 5,
  //   color: "red",
  //   cursor: "pointer",
  // },
  // right: {
  //   flex: 4,
  //   position: "relative",
  //   textAlign: "center",
  // },
  // generateRouteBtn: {
  //   position: "absolute",
  //   bottom: "0px",
  //   border: "none",
  //   padding: "10px 20px",
  //   backgroundColor: "blue",
  //   borderRadius: 5,
  //   color: "#FFF",
  //   fontWeight: "bold",
  //   cursor: "pointer",
  //   width: "40%",
  //   transform: "translateX(-50%)",
  // },
  // table: {
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "space-between",
  //   width: "80%",
  //   margin: "10px auto",
  //   height: "80%",
  //   overflowY: "scroll",
  //   scrollbarWidth: "none",
  //   backgroundColor: "#f7f7f7",
  // },
  // row: {
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "center",
  // },
  // cell: {
  //   textAlign: "center",
  //   border: "1px solid #333",
  //   width: "100%",
  //   padding: 15,
  //   fontSize: 20,
  //   color: "#333",
  // },
};
