import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { setCartItems } from "../../actions/product";

import StripeCheckout from "react-stripe-checkout";

import { Alert } from "reactstrap";

import "./buy.css";

function Buy({ productEdit, user, setCartItems, cartItems }) {
  const history = useHistory();

  //const [cartItems, setCartItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [btnText, setBtnText] = useState("ADD TO CART");
  const getCartItem = async () => {
    const items = JSON.parse(localStorage.getItem("cart"));
    // console.log(items);
    // [{product,qty},{pdt,qty}]
    if (items == null) {
      return setBtnText("ADD TO CART");
    } else {
      const present = items.some((item) => {
        console.log(item);

        return item.product._id == productEdit._id;
      });
      // console.log(present, items[1].productId == product._id);
      if (present) {
        return setBtnText("GO TO CART");
      } else {
        return setBtnText("ADD TO CART");
      }
    }
  };
  const getUserCartItem = async () => {
    console.log("I am hitted");
    const addCartUrl = `https://electro--store.herokuapp.com/api/v1/user/cart`;
    try {
      const response = await axios({
        method: "get",
        url: addCartUrl,
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      console.log(response.data.success, "Is Blah Blah Blah");
      if (!response.data.success) {
        console.log(response.data, "NOT SUCCESSSSSSSS");
        setVisible(true);
        setMessage(response.data.message);
      } else {
        console.log(response.data.message, "Is user cart data");
        const items = response.data.message.items;
        setCartItems(response.data.message);
        console.log(response.data.message, "response.data.message");
        console.log(cartItems);
        const present = items.some((item) => {
          console.log(item);
          return item.productId && item.productId._id == productEdit._id;
        });
        // console.log(present, items[1].productId == product._id);
        if (present) {
          setIsPresent(true);
          return setBtnText("GO TO CART");
        } else {
          return setBtnText("ADD TO CART");
        }
      }
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserCartItem();
    } else {
      getCartItem();
    }
    // console.log(product);
  }, []);
  const handleAddCart = () => {
    const items = JSON.parse(localStorage.getItem("cart")); //Converts JSON to js object
    // console.log(items[0]["productId"]);
    if (items == null) {
      const product = productEdit;
      console.log(product);

      const pdts = [{ product, qty: 1 }];
      // console.log(pdts);
      localStorage.setItem("cart", JSON.stringify([...pdts])); //We can add only json objects to local storage
      // console.log(pdts);
      getCartItem();
    } else {
      const present = items.some((item) => {
        return item.product._id == productEdit._id;
      });
      if (!present) {
        const product = productEdit;
        console.log(product);

        const newPdtCart = { product, qty: 1 };
        const pdts = [...items, newPdtCart];
        localStorage.setItem("cart", JSON.stringify([...pdts]));
        getCartItem();
      } else {
        history.push("/cart");
      }
    }
  };

  const handleCartUser = async (id) => {
    setUpdating(true);
    setBtnText("ADDING TO CART");
    if (isPresent) {
      return history.push("/cart");
    }
    const addCartUrl = `https://electro--store.herokuapp.com/api/v1/user/cart/${id}/add`;
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
        setUpdating(false);
        console.log(response.data, "NOT SUCCESSSSSSSS");
        setVisible(true);
        setMessage(response.data.message);
      } else {
        setUpdating(false);
        getUserCartItem();
        setBtnText("GO TO CART");
        return "TRUE";
      }
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
      console.log(error.message, "Error from handle cart user");
    }
  };

  const makePament = async (token, args) => {
    console.log(args);
    if (user) {
      let address = {};
      let body = {};

      console.log(!Object.keys(args).length === 0);
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
          product: productEdit,
          address,
        };
        console.log("Args are present");
      } else {
        body = {
          token,
          product: productEdit,
        };
        console.log(address);
        console.log("Args are not present");
      }

      const paymentUrl = "https://electro--store.herokuapp.com/api/v1/payment";
      try {
        const response = await axios({
          method: "post",
          url: paymentUrl,
          data: body,
          headers: {
            authorization: localStorage.getItem("token"),
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        });
        console.log(response, "Is response from payMent");
        if (response.data.success) {
          history.push("/history");
        } else {
        }
      } catch (error) {
        console.log(error.message, "Is ERROR from payMent");
      }
    } else {
    }
  };

  const handleBuy = () => {
    console.log(history);
    history.push("/login", { from: history.location.pathname });
  };

  return (
    <React.Fragment>
      <div className="buyBtns">
        {visible && (
          <div className="alert_signUp">
            <Alert className="" color="danger" isOpen={visible}>
              {message}
            </Alert>
          </div>
        )}
        <button
          disabled={updating}
          id="cartBtn"
          onClick={user ? () => handleCartUser(productEdit._id) : handleAddCart}
        >
          {btnText}
        </button>
        {user ? (
          <StripeCheckout
            // {`${process.env.REACT_APP_STRIPE}`}
            stripeKey={`${process.env.REACT_APP_STRIPE}`}
            token={makePament}
            name={`Buy ${productEdit.name}`}
            amount={productEdit.price * 100}
            description="Card:4242424242424242,CVV:123"
            currency="INR"
            shippingAddress={user.address ? false : true}
            allowRememberMe={true}
            // billingAddress={false}
          >
            <button id="buyBtn">BUY NOW </button>
          </StripeCheckout>
        ) : (
          <button onClick={handleBuy} id="buyBtn">
            BUY NOW{" "}
          </button>
        )}
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  productEdit: state.products.productEdit,
  cartItems: state.products.cartItems,
});

const mapDispatchToProps = (dispatch) => ({
  setCartItems: (items) => dispatch(setCartItems(items)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Buy);
