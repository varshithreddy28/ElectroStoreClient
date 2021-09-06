import React, { useState, useEffect } from "react";
import { Container, Button, Alert } from "reactstrap";

import axios from "axios";

import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import "./view.css";

import { setBoughtProducts, setBoughtUsers } from "../../../../actions/admin";

function ViewOrder({ orders, setBoughtProducts, setBoughtUsers }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(null);
  const [check, setCheck] = useState(false);
  const [delivered, setDelivered] = useState(false);

  const setAllProducts = async () => {
    const allOrders_URL =
      "https://electro--store.herokuapp.com/api/v1/user/allorders";

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
        setBoughtProducts(response.data.message);
        setDetails(response.data.message);
      }
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (orders.length != 0) {
      const orderOne = orders.filter((item) => {
        return item._id == id;
      });

      setOrder(orderOne);
    } else {
      setAllProducts();
    }
  }, []);
  useEffect(() => {
    if (order) {
      order.map((item) => {
        if (item.isDelivered) {
          setDelivered(true);
        }
      });
    }
  }, [order]);

  useEffect(() => {
    console.log(delivered);
  }, [delivered]);

  useEffect(() => {
    if (details) {
      const orderOne = details.filter((item) => {
        return item._id == id;
      });

      setOrder(orderOne);
    }
  }, [details]);

  const handleUpdate = () => {
    setCheck(!check);
  };

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      // s("");
    }, 5000);
  }, [message]);

  useEffect(() => {
    if (order && !order[0].isDelivered) {
      const updateOrder = async () => {
        const orderUpdateURl = `https://electro--store.herokuapp.com/api/v1/order/update/${order[0]._id}`;
        try {
          const response = await axios({
            method: "patch",
            url: orderUpdateURl,
            headers: {
              authorization: localStorage.getItem("token"),
            },
          });
          if (!response.data.success) {
            setVisible(true);
            setMessage(response.data.message);
          } else {
            const updateOrder = order;
            updateOrder[0].isDelivered = true;
            setDelivered(true);
            setOrder(updateOrder);
            const i = orders.findIndex((item) => {
              return item._id == id;
            });
            let allOrders = orders;
            allOrders[i].isDelivered = true;
            console.log(response.data.message);
            setBoughtProducts(allOrders);
          }
        } catch (error) {
          setVisible(true);
          setMessage(error.message);
        }
      };
      updateOrder();
    }
  }, [check]);

  return (
    <React.Fragment>
      <Container>
        <div className="">
          {order &&
            order.map((item) => {
              return (
                <div className="">
                  <div className="orderHeader_">
                    <div className="userOrder">
                      <div className="userdetails">
                        <span style={{ marginTop: "15px" }}>
                          <span className="userDetail_">UserName :</span>
                          <span className="uservalue">
                            {item.user.username}
                          </span>
                        </span>
                        <span
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          {" "}
                          <span className="userDetail_">Email :</span>{" "}
                          <span className="uservalue">{item.user.email}</span>
                        </span>
                      </div>
                      <div className="orderUpdate">
                        <label className="switch">
                          <input
                            type="checkbox"
                            value={check}
                            onClick={() => handleUpdate()}
                            checked={delivered ? true : null}
                          />
                          <span className="slider round"></span>
                          <div style={{ marginTop: "10px" }}>
                            <span className="delivered">Delivered</span>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="userAddress">
                      <div style={{ marginTop: "10px" }} className="billing">
                        <span style={{ marginTop: "10px", fontSize: "24px" }}>
                          Billing Address
                        </span>
                        <div className="billDetails">
                          <div className="temp1"></div>
                          <div className="temp">
                            <span>
                              <span className="userDetail_">Name :</span>
                              <span className="uservalue">
                                {item.user.address.billing.name}
                              </span>
                            </span>
                            <span>
                              <span className="userDetail_">
                                Address Lane :
                              </span>
                              <span className="uservalue">
                                {item.user.address.billing.addressLane}
                              </span>
                            </span>
                            <span>
                              <span className="userDetail_">City :</span>
                              <span className="uservalue">
                                {item.user.address.billing.city}
                              </span>
                            </span>
                            <span>
                              <span className="userDetail_">Country :</span>
                              <span className="uservalue">
                                {item.user.address.billing.country}
                              </span>
                            </span>
                            <span>
                              <span className="userDetail_">Zip Code :</span>
                              <span className="uservalue">
                                {item.user.address.billing.zip}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: "10px" }} className="shipping">
                        <span style={{ marginTop: "10px", fontSize: "24px" }}>
                          Shipping Address
                        </span>
                        <div className="billDetails">
                          <div className="temp1"></div>
                          <div className="temp">
                            <span>
                              <span className="userDetail_">Name : </span>
                              <span className="uservalue">
                                {item.user.address.shipping.name}
                              </span>
                            </span>
                            <span>
                              <span className="userDetail_">
                                Address Lane :
                              </span>
                              <span className="uservalue">
                                {item.user.address.shipping.addressLane}
                              </span>
                            </span>
                            <span>
                              <span className="userDetail_">City :</span>
                              <span className="uservalue">
                                {item.user.address.shipping.city}
                              </span>
                            </span>
                            <span>
                              <span className="userDetail_">Country :</span>
                              <span className="uservalue">
                                {item.user.address.shipping.country}
                              </span>
                            </span>{" "}
                            <span>
                              <span className="userDetail_">Zip Code :</span>
                              <span className="uservalue">
                                {item.user.address.shipping.zip}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="orderBody">
                    {item.details[0].items.map((pdt) => {
                      return (
                        <div className="orderDetails_">
                          <div className="pdtImageOrder">
                            <img src={pdt.productId.image[0].url} alt="" />
                          </div>

                          <div className="pdtDetails">
                            <div className="pdtName">{pdt.productId.name}</div>
                            <span>Units: {pdt.qty}</span>
                            <div className="">
                              <span className="orderedAt">
                                {item.orderedAt}
                              </span>
                            </div>
                          </div>
                          <div className="pedtPrice">
                            <div className="">
                              <span style={{ fontWeight: "500" }}>
                                ₹{pdt.productId.price}
                              </span>
                              <span>(Per Unit)</span>
                            </div>
                          </div>
                          <div className="receipt">
                            <a
                              style={{ color: "#b48cdada" }}
                              href={item.receipt_url}
                              target="_blank"
                            >
                              <i className="fas fa-receipt"></i>
                              Receipt
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewOrder);
