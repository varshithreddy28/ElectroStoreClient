import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { setUserDetails } from "../../../actions/user";
import { connect } from "react-redux";
import { setCartItems } from "../../../actions/product";

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert,
} from "reactstrap";

import "./login.css";

function Login(props) {
  const history = useHistory();
  const [details, setDetails] = useState({ username: "", password: "" });
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updatingMessage, setUpdatingMessage] = useState(
    "HANG ON!LOADING DATA"
  );
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [cart, setCart] = useState([]);

  const login_user = "https://electrostore-zqml.onrender.com/api/v1/user/login";
  const user_details =
    "https://electrostore-zqml.onrender.com/api/v1/user/details";
  const handleLogin = async (e) => {
    e.preventDefault();
    setUpdating(true);

    // console.log(details);
    // console.log(email);

    const addCartItem = async (cartitems) => {
      const addCartUrl = `https://electrostore-zqml.onrender.com/api/v1/user/cart/local/add`;
      try {
        const response = await axios({
          method: "post",
          url: addCartUrl,
          data: cartitems,
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
          setUpdating(false);
          return "TRUE";
        }
      } catch (error) {
        setVisible(true);
        setMessage(error.message);
      }
    };

    // Cart Items :

    const setCartItem = async () => {
      const items = JSON.parse(localStorage.getItem("cart"));
      console.log(items);
      // console.log(items != null, items.length != 0);
      console.log(items != null && items != []);

      if (items != null && items.length != 0) {
        setUpdatingMessage("UPDATING CART PLEASE WAIT");
        let cartitems = [];
        items.forEach((item, i) => {
          const newObj = { id: item.product._id, qty: item.qty };
          cartitems.push(newObj);
        });
        await addCartItem(cartitems);
        console.log(cartitems, "........");
      } else {
        console.log("No items in cart");
      }
    };

    try {
      const response = await axios.post(login_user, details);
      if (!response.data.success) {
        setUpdating(false);
        setVisible(true);
        setMessage(response.data.message);
      } else {
        localStorage.setItem("token", `bearer ${response.data.token}`);
        await setCartItem();
        try {
          const response = await axios({
            method: "get",
            url: user_details,
            headers: {
              authorization: localStorage.getItem("token"),
            },
          });
          if (!response.data.success) {
            setVisible(true);
            setMessage(response.data.message);
          } else {
            setUser(response.data.message);
            console.log(history);
            if (history.location.state && history.location.state.from) {
              history.push(history.location.state.from);
            } else {
              history.push("/");
            }
          }
        } catch (error) {
          setVisible(true);
          setMessage(error.message);
        }
      }
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
    }
  };
  const handleChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    // console.log({ ...details, [inputName]: inputValue });
    // IMPORTANT STEP FOR TAKING INPUTS
    setDetails({ ...details, [inputName]: inputValue });
  };

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      // s("");
    }, 5000);
  }, [message]);

  useEffect(() => {
    props.setCartItems(user.cart);
    console.log(user.cart, "Is our guest");
    props.setUserDetails(user);
  }, [user]);

  useEffect(() => {
    console.log(updating);
  }, [updating]);

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
        {updating && (
          <div className="alert_signUp">
            <Alert className="" color="warning" isOpen={updating}>
              {updatingMessage}
            </Alert>
          </div>
        )}
        <Form className="login">
          <div>
            <p className="welcome">Welcome back!</p>
            <h3 className="loginHeader">Login to continue</h3>
          </div>
          <div className="loginInput">
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="exampleEmail" className="mr-sm-2">
                User Name
              </Label>
              <Input
                onChange={handleChange}
                value={details.username}
                type="text"
                name="username"
                id="exampleEmail"
                placeholder="User Name"
              />
            </FormGroup>
          </div>
          <div className="loginInput">
            <FormGroup className="mb-5 mr-sm-2 mb-sm-0">
              <Label for="examplePassword" className="mr-sm-2">
                Password
              </Label>
              <Input
                onChange={handleChange}
                value={details.password}
                type="password"
                name="password"
                id="examplePassword"
                placeholder="Password"
              />
            </FormGroup>
          </div>
          <Button onClick={handleLogin} className="submitLogin">
            Submit
          </Button>
          <div className="new">
            <p>
              Dosen't have account?{" "}
              <span>
                <Link className="new_sign" to="/signup">
                  register
                </Link>
              </span>
            </p>
          </div>
        </Form>
      </Container>
    </React.Fragment>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setUserDetails: (user) => dispatch(setUserDetails(user)),
  setCartItems: (items) => dispatch(setCartItems(items)),
});

export default connect(null, mapDispatchToProps)(Login);
