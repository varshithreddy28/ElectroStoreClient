import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Button, Alert } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";

import ViewOrder from "./view/view";

import { setBoughtProducts, setBoughtUsers } from "../../../actions/admin";

import "./admin.css";

function Admin({ setBoughtProducts, setBoughtUsers, orders }) {
  const allOrders_URL =
    "https://electrostore-zqml.onrender.com/api/v1/user/allorders";
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);

  const setAllProducts = async () => {
    try {
      const response = await axios({
        method: "get",
        url: allOrders_URL,
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      if (!response.data.success) {
        setVisible(true);
        setMessage(response.data.message);
      } else {
        dispatch({
          type: "SET_BOUGHTPRODUCTS",
          details: response.data.message,
        });
        console.log(response.data.message);
        setDetails(response.data.message);
      }
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
    }
  };
  useEffect(() => {
    if (orders && orders.length != 0) {
      setDetails(orders);
    } else {
      setAllProducts();
    }
  }, []);

  useEffect(() => {
    details && setLoading(false);
  }, [details]);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      // s("");
    }, 5000);
  }, [message]);
  return (
    <React.Fragment>
      <Container>
        {visible && (
          <div className="alert_signUp">
            <Alert className="" color="danger" isOpen={visible}>
              {message}
            </Alert>
          </div>
        )}
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <div className="orderDetails ">
            <div className="orderHeader">
              <span> All Order's</span>
            </div>
            <div className="orderbody">
              {details.map((item) => {
                return (
                  <div className="orderdetails ">
                    <div className="orderdetails_header">
                      <span className="user">User :</span>{" "}
                      <span className="username">{item.user.username}</span>
                    </div>
                    <div className="ordereddate">
                      <span className="order">Order :</span>
                      <span className="orderedAt">{item.orderedAt}</span>
                    </div>
                    <div className="deliverStatus">
                      {item.isDelivered ? (
                        <span>
                          <span className="status">Status : </span>
                          <span
                            style={{ color: "#22dd22" }}
                            className="delivered"
                          >
                            Delivered
                          </span>
                        </span>
                      ) : (
                        <span>
                          <span className="status">Status : </span>
                          <span
                            style={{ color: "red" }}
                            className="notdelivered"
                          >
                            Pending
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="info">
                      <Link
                        style={{ color: "#b48cdada" }}
                        to={`/order/${item._id}`}
                      >
                        InFo
                        <i class="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* {open && <ViewOrder id={id} setOpen={setOpen} />} */}
      </Container>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  orders: state.admin.products,
});

const mapDispatchToProps = (dispatch) => ({
  setBoughtProducts: (details) => dispatch(setBoughtProducts(details)),
  setBoughtUsers: (user) => dispatch(setBoughtUsers(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
