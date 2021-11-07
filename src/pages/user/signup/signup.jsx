import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import { setUserDetails } from "../../../actions/user";
import { connect } from "react-redux";

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert,
  // UncontrolledAlert as Alert,
} from "reactstrap";

import "./signup.css";

function SignUp(props) {
  const history = useHistory();
  const [details, setDetails] = useState({ name: "", email: "", password: "" });
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updatingMessage, setUpdatingMessage] = useState(
    "HANG ON!LOADING DATA"
  );

  // PasswordErr
  let passwordErr =
    "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/";

  const register_user =
    "https://electro--store.herokuapp.com/api/v1/user/register";
  const user_details =
    "https://electro--store.herokuapp.com/api/v1/user/details";

  const addCartItem = async (cartitems) => {
    const addCartUrl = `https://electro--store.herokuapp.com/api/v1/user/cart/local/add`;
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

  const handleSignup = async (e) => {
    e.preventDefault();
    // console.log(details);
    // console.log(email);
    try {
      const response = await axios.post(register_user, details);
      if (!response.data.success) {
        setVisible(true);
        // console.log(
        //   response.data.message,
        //   response.data.message.includes(passwordErr)
        // );
        if (response.data.message.includes(passwordErr)) {
          setMessage(
            "Password must contain atleast length of 8 Characters and must contain-1 UpperCase,1 LowerCase,1 Special Charecter and 1 Number"
          );
        } else {
          setMessage(response.data.message);
        }
      } else {
        localStorage.setItem("token", `bearer ${response.data.token}`);
        try {
          const response = await axios({
            method: "get",
            url: user_details,
            headers: {
              authorization: localStorage.getItem("token"),
            },
          });
          // console.log(response.data);
          if (!response.data.success) {
            setVisible(true);
            setMessage(response.data.message);
          } else {
            setUser(response.data.message);
            const items = JSON.parse(localStorage.getItem("cart"));
            // console.log(items);
            // console.log(items != null, items.length != 0);
            // console.log(items != null && items != []);

            if (items != null && items.length != 0) {
              setUpdatingMessage("UPDATING CART PLEASE WAIT");
              let cartitems = [];
              items.forEach((item, i) => {
                const newObj = { id: item.product._id, qty: item.qty };
                cartitems.push(newObj);
              });
              await addCartItem(cartitems);
            } else {
              // console.log("No items in cart");
            }
            history.push("/");
          }
        } catch (error) {
          setVisible(true);
          setMessage(response.data.message);
        }
      }
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
    }
  };
  const onDismiss = () => setVisible(false);
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
    props.setUserDetails(user);
  }, [user]);

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
            <p className="welcome">Welcome to Electro Store!</p>
            <h3 className="loginHeader">Register</h3>
          </div>
          <div className="loginInput">
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="exampleEmail" className="mr-sm-2">
                Email
              </Label>
              <Input
                onChange={handleChange}
                value={details.email}
                // setValue={setEmail}
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="something@idk.cool"
              />
            </FormGroup>
          </div>
          <div className="loginInput">
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="exampleEmail" className="mr-sm-2">
                User Name
              </Label>
              <Input
                onChange={handleChange}
                value={details.name}
                type="text"
                name="name"
                id="username"
                placeholder="What should we call you
                ?"
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
                id="password"
                placeholder="Password"
              />
            </FormGroup>
          </div>
          <Button onClick={handleSignup} className="submitLogin">
            Submit
          </Button>
          <div className="new">
            <p>
              <span>
                <Link className="new_sign" to="/login">
                  Login
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
});

export default connect(null, mapDispatchToProps)(SignUp);
