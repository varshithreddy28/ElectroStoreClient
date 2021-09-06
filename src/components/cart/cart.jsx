import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container, Button, Alert } from "reactstrap";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { setCartItems } from "../../actions/product";

import EmptyCart from "../../assets/empty_cart.svg";

import StripeCheckout from "react-stripe-checkout";

import Loading from "../loading/loading";

import "./cart.css";

export const Cart = ({ user, products, cartItem, setCartItems }) => {
  const addCartUrl = `https://electro--store.herokuapp.com/api/v1/user/cart`;

  const history = useHistory();

  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [userPresent, setUserPresent] = useState(false);
  const [allpdts, setAllpdts] = useState({});
  const [updating, setUpdating] = useState(false);
  // Minus
  const [updatingMinus, setUpdatingMinus] = useState(false);

  const [loading, setLoading] = useState(false);

  var arr = [];
  const setProducts = () => {
    if (!localStorage.getItem("token")) {
      const items = JSON.parse(localStorage.getItem("cart")); //Converts JSON to js object
      setProduct(items);
    }
  };

  const userCart = async () => {
    if (localStorage.getItem("token")) {
      try {
        const response = await axios({
          method: "get",
          url: addCartUrl,
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
        console.log(response.data.success);
        if (!response.data.success) {
          console.log(response.data, "NOT SUCCESSSSSSSS");
          setVisible(true);
          setMessage(response.data.message);
        } else {
          console.log(response.data.message, "Is user cart data.........");
          setAllpdts(response.data.message);
          const items = response.data.message;
          setCartItems(items);
          setProduct(items.items);
          setAllpdts(items);
        }
      } catch (error) {
        setVisible(true);
        setMessage(error.message);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      console.log(cartItem, "Is Blah Blah Blah");
      if (cartItem && cartItem.length != 0) {
        setProduct(cartItem.items);
        console.log(cartItem, cartItem.length, "Is Blah Blah Blah 2");

        setAllpdts(cartItem);
        console.log(cartItem, cartItem.length, "Is Blah Blah Blah 12");
      } else {
        console.log("Not Yet Done");
        userCart();
      }
      setUserPresent(true);
    } else {
      setProducts();
    }
    // console.log(user);
  }, []);

  useEffect(() => {
    if (product == null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [product]);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      // s("");
    }, 5000);
  }, [message]);

  const handleMinus = (i) => {
    let editItems = product;

    if (editItems[i].qty == 1) {
      editItems.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify([...editItems]));
      setProducts(editItems);
    } else {
      editItems[i].qty -= 1;
      localStorage.setItem("cart", JSON.stringify([...editItems]));
      setProducts(editItems);
    }
  };

  const handleAdd = (i) => {
    let editItems = product;
    editItems[i].qty += 1;
    localStorage.setItem("cart", JSON.stringify([...editItems]));
    setProducts(editItems);
  };

  // user

  const handleMinusUser = async (id, i, price) => {
    setUpdatingMinus(true);
    const updatingBtn = document.getElementById(`btnM_${id}`);
    updatingBtn.disabled = true;

    const removeCartUrl = `https://electro--store.herokuapp.com/api/v1/user/cart/${id}/delete`;
    try {
      const response = await axios({
        method: "delete",
        url: removeCartUrl,
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      if (!response.data.success) {
        setVisible(true);
        setMessage(response.data.message);
      } else {
        let updatedPdt = product;
        if (updatedPdt[i].qty == 1) {
          updatingBtn.disabled = false;
          let selected = allpdts;
          selected.totalPrice = selected.totalPrice - price;
          setAllpdts(selected);
          updatedPdt.splice(i, 1);
          setProduct([...updatedPdt]);
        } else {
          let selected = allpdts;
          selected.totalPrice = selected.totalPrice - price;
          setAllpdts(selected);
          updatedPdt[i].qty -= 1;
          setProduct([...updatedPdt]);
          updatingBtn.disabled = false;

          setUpdatingMinus(false);
        }
        return "TRUE";
      }
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
    }
  };

  const handleAddUser = async (id, i, price) => {
    const addCartUrl = `https://electro--store.herokuapp.com/api/v1/user/cart/${id}/add`;
    const updatingBtn = document.getElementById(`btn_${id}`);
    updatingBtn.disabled = true;

    try {
      const response = await axios({
        method: "post",
        url: addCartUrl,
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      console.log(response.data.success);
      if (!response.data.success) {
        setVisible(true);
        setMessage(response.data.message);
      } else {
        let selected = allpdts;
        selected.totalPrice = selected.totalPrice + price;
        console.log(selected);
        setAllpdts(selected);

        let updatedPdt = product;
        updatedPdt[i].qty += 1;
        setProduct([...updatedPdt]);
        updatingBtn.disabled = false;
        setUpdating(false);
        return "TRUE";
      }
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
    }
  };
  useEffect(() => {
    console.log(product, "are products");
  }, [product]);

  const handleBuy = () => {
    console.log(history);
    if (!userPresent) {
      history.push("/login", { from: history.location.pathname });
    } else {
      console.log("User is present");
    }
  };

  const makePament = async (token, args) => {
    console.log(args);
    if (user) {
      let address = {};
      let body = {};

      if (args.billing_name) {
        address = {
          billing: {
            name: args.billing_name,
            addressLane: args.billing_address_line1,
            city: args.billing_address_city,
            country: args.billing_address_country,
            zip: args.billing_address_zip,
          },
          shipping: {
            name: args.shipping_name,
            addressLane: args.shipping_address_line1,
            city: args.shipping_address_city,
            country: args.shipping_address_country,
            zip: args.shipping_address_zip,
          },
        };
        body = {
          token,

          address,
        };
      } else {
        body = {
          token,
        };
      }

      // console.log(token, ".......", body);
      const paymentUrl =
        "https://electro--store.herokuapp.com/api/v1/user/placeorder";
      try {
        const response = await axios({
          method: "post",
          url: paymentUrl,
          data: body,
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          history.push("/history");
        } else {
        }
      } catch (error) {
        setMessage(error.message);
      }
    } else {
      console.log("Please Login");
    }
  };

  useEffect(() => {
    console.log(allpdts.totalPrice, "IS total PRice of  xart");
  }, [allpdts]);

  const handleViewPdt = (id) => {
    history.push(`/product/${id}`);
  };

  return (
    <Container>
      {visible && (
        <div className="alert_signUp">
          <Alert className="" color="danger" isOpen={visible}>
            {message}
          </Alert>
        </div>
      )}

      <div className="cart">
        <div className="carthead">
          <span style={{ fontSize: "25px" }}>
            <i class="fas fa-shopping-cart"></i> Cart
          </span>
        </div>

        {/* {loading ? <Loading /> : ""} */}

        <div className="col-md-8 offset-md-2">
          <div id="buyBtnOrder">
            {user && product && product.length > 0 ? (
              <StripeCheckout
                // {`${process.env.REACT_APP_STRIPE}`}
                stripeKey={`${process.env.REACT_APP_STRIPE}`}
                token={makePament}
                name={`Make Payment`}
                amount={allpdts.totalPrice * 100}
                description="Card:4242424242424242,CVV:123"
                currency="INR"
                shippingAddress={user.address ? false : true}
                allowRememberMe={true}
                // billingAddress={false}
              >
                <button id="buyBtnCart">BUY NOW </button>
              </StripeCheckout>
            ) : product && product.length > 0 ? (
              <button onClick={handleBuy} id="buyBtnCart">
                BUY NOW{" "}
              </button>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="row">
          {userPresent ? (
            userPresent && product && product.length > 0 ? (
              product.map((item, i) => {
                const product = item.productId;
                return (
                  <div className="col-md-8 offset-md-2">
                    <div className="cartItem">
                      <div className="itemName">
                        <div
                          onClick={() => handleViewPdt(product._id)}
                          className=""
                        >
                          <span className="itemName_">{product.name}</span>
                          <div className="itemDetail">
                            <span className="itemPrice">
                              Price: ₹{product.price} (Per Unit)
                            </span>
                          </div>
                        </div>
                        <div className="itemUpdate">
                          <div className="itemimg">
                            <img
                              src={product.image[0].url}
                              alt="Cart Item Image"
                            />
                          </div>
                          <div className="changeItem">
                            <button
                              id={`btnM_${product._id}`}
                              className="minus"
                              onClick={() =>
                                handleMinusUser(product._id, i, product.price)
                              }
                            >
                              <i id="minus" className="fas fa-minus "></i>
                            </button>
                            <div className="qty">{item.qty}</div>
                            <button
                              id={`btn_${product._id}`}
                              className="plus"
                              onClick={() =>
                                handleAddUser(product._id, i, product.price)
                              }
                            >
                              <i id="plus" className="fas fa-plus "></i>
                            </button>
                            {/* <div
                              disabled="true"
                              className="plus"
                              onClick={() => handleAddUser(product._id, i)}
                            >
                              <i id="plus" className="fas fa-plus "></i>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="EmptyCart">
                <img src={EmptyCart} alt="Image of empty cart" />
                <div className="EmptyCart_data">
                  <h3>Hey!It feels so light</h3>
                  <p>It feels no items in your bag.Let's add some items</p>
                  <button
                    className="add_items_cart"
                    onClick={() => history.push("/products")}
                  >
                    ADD ITEMS
                  </button>
                </div>
              </div>
            )
          ) : !userPresent && product && product.length > 0 ? (
            product.map((item, i) => {
              return (
                <div
                  className="col-md-8 offset-md-2"
                  onClick={() => handleViewPdt(item.product._id)}
                >
                  <div className="cartItem">
                    <div className="itemName">
                      <div className="">
                        <span className="itemName_">{item.product.name}</span>
                        <div className="itemDetail">
                          <span className="itemPrice">
                            Price: ₹{item.product.price}
                          </span>
                        </div>
                      </div>
                      <div className="itemUpdate">
                        <div className="itemimg">
                          <img
                            src={item.product.image[0].url}
                            alt="Cart Item Image"
                          />
                        </div>
                        <div className="changeItem">
                          <div className="minus" onClick={() => handleMinus(i)}>
                            <i id="minus" className="fas fa-minus "></i>
                          </div>
                          <div className="qty">{item.qty}</div>
                          <div className="plus" onClick={() => handleAdd(i)}>
                            <i id="plus" className="fas fa-plus "></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="EmptyCart">
              <img src={EmptyCart} alt="Image of empty cart" />
              <div className="EmptyCart_data">
                <h3>Hey!It feels so light</h3>
                <p>It feels no items in your bag.Let's add some items</p>
                <button
                  className="add_items_cart"
                  onClick={() => history.push("/products")}
                >
                  ADD ITEMS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  products: state.products.products,
  user: state.user.user,
  cartItem: state.products.cartItems,
});

const mapDispatchToProps = (dispatch) => ({
  setCartItems: (items) => dispatch(setCartItems(items)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
