import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Container, Button, Alert } from "reactstrap";
import { useHistory } from "react-router-dom";

import Empty from "../../../../assets/undraw_Empty.svg";

import "./all.css";

export const All = (props) => {
  const history = useHistory();

  const addCartUrl = `https://electro--store.herokuapp.com/api/v1/user/history`;

  const [orders, setOrders] = useState(null);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const getUserHistory = async () => {
    if (localStorage.getItem("token")) {
      try {
        const response = await axios({
          method: "get",
          url: addCartUrl,
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
        // console.log(response.data.success);
        if (!response.data.success) {
          console.log(response.data, "NOT SUCCESSSSSSSS");
          setVisible(true);
          setMessage(response.data.message);
        } else {
          //   console.log(response.data.message, "Is user cart data");
          response.data.message && setOrders(response.data.message);
          console.log(response.data.message, "gfvhhg");
          // setCartItems(items);
        }
      } catch (error) {
        setVisible(true);
        setMessage(error.message);
      }
    }
  };

  useEffect(() => {
    if (props.orders) {
      setOrders(props.orders);
    } else {
      getUserHistory();
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      // s("");
    }, 5000);
  }, [message]);

  useEffect(() => {
    console.log(orders, "..");
    // orders.map((order) => {
    //   order.items.map((item) => {
    //     console.log(item.productId);
    //   });
    // });
  }, [orders]);

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
        <div className="allOrders">
          {console.log(orders && orders.length != 0, orders)}
          <div className="orderHeadding">
            <div className="myorders">
              {orders ? (
                orders.length != 0 ? (
                  <span id="">My Orders</span>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </div>
          </div>
          {orders ? (
            orders.length != 0 ? (
              orders.map((order) => {
                return order.items.map((item) => {
                  return (
                    <div className="row">
                      <div className="col-md-8 offset-md-2">
                        <div className="puchasePdt">
                          <div className="pdtImageOrder">
                            <img src={item.productId.image[0].url} alt="" />
                          </div>
                          <div className="purchaseDiscription">
                            <span id="productNameOrder">
                              {item.productId.name}
                            </span>
                            <span>Units: {item.qty}</span>
                            <div className="order_Details">
                              <span className="orderedAt">
                                Purchased on: {item.orderedAt}
                              </span>
                              {order.delivered ? (
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
                          </div>
                          <div className="pedtPrice">
                            <div className="">
                              <span style={{ fontWeight: "500" }}>
                                ₹{item.productId.price}
                              </span>
                              <span>(Per Unit)</span>
                            </div>
                          </div>
                          <div className="receipt">
                            <a
                              style={{ color: "#b48cdada" }}
                              href={order.receipt_url}
                              target="_blank"
                            >
                              <i className="fas fa-receipt"></i>
                              Receipt
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })
            ) : (
              <div className="EmptyHistory">
                <img src={Empty} alt="Image of empty cart" />
                <div className="EmptyCart_data">
                  <h3>Hey!No Items Bought, Continue Shopping</h3>
                  <button
                    className="add_items_cart"
                    onClick={() => history.push("/products")}
                  >
                    SHOP NOW
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="EmptyHistory">
              <img
                className="emptycart"
                src={Empty}
                alt="Image of empty cart"
              />
              <div className="EmptyCart_data">
                <h3>Hey!No Items Bought,Continue Shopping</h3>
                <button
                  className="add_items_cart"
                  onClick={() => history.push("/products")}
                >
                  SHOP NOW
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  orders: state.user.user.history,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(All);
