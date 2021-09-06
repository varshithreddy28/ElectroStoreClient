import React, { useState, useEffect, useRef } from "react";
import {
  Card as div,
  CardImg,
  CardText,
  CardBody,
  // CardTitle as div className="cardtitle",
  CardSubtitle,
  Button,
  Container,
  Alert,
  Col,
  Row,
} from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import laptop from "../../assets/laptop.jpg";
import { Link } from "react-router-dom";

import Loading from "../../components/loading/loading";

import { setAllProducts } from "../../actions/product";

import { setUserDetails } from "../../actions/user";

import MOBILEHOME from "../../assets/mobile_home.svg";

import Bottomnav from "../../components/navbar/bottom/bottomnav";

import "./home.css";

const Home = (props) => {
  const ourValues = [
    {
      icon: "fas fa-hand-holding-usd",
      header: "Affordable",
      details: "We sell every Gadget at the lowest price possible.",
    },
    {
      icon: "fas fa-search-dollar",
      header: "Transparent",
      details:
        "No extra fee is required upon checkout. We will even walk you through how we monetize you!",
    },
    {
      icon: "fas fa-shield-alt",
      header: "Transparent",
      details:
        "Our private carriage ensure your order's safety. Breaking your package is equivalent to breaking our own heart!",
    },
    // {
    //   icon: "fas fa-shield-alt",
    //   header: "Transparent",
    //   details:
    //     "Our private carriage ensure your order's safety. Breaking your package is equivalent to breaking our own heart!",
    // },
    {
      icon: "fas fa-stopwatch",
      header: "Fast Delivery",
      details:
        "We ship out every single weekend. You will receive your order within 2 days!",
    },
  ];

  // <i class="fas fa-stopwatch"></i>

  // const products = useRef(" ");
  const [products, setProducts] = useState(null);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState(ourValues);

  const viewProducts = "https://electro--store.herokuapp.com/api/v1/product";
  const user_details =
    "https://electro--store.herokuapp.com/api/v1/user/details";

  useEffect(() => {
    const response = async () => {
      try {
        const response = await axios.get(viewProducts);
        console.log(response.data);

        // products.current.value = response.data.message;
        if (!response.data.success) {
          setVisible(true);
          setMessage(response.data.message);
        } else {
          props.setAllProducts(response.data.message);
          // console.log(response.data);
          setProducts(response.data.message);
        }
        // return res;
      } catch (error) {
        console.log(error.message);
      }
    };
    if (props.products.length == 0) {
      console.log("No lenght");
      response();
    } else {
      setProducts(props.products);
    }
    // USER details
    const userDetails = async () => {
      if (localStorage.getItem("token")) {
        // const token = localStorage.getItem("token");
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
            // history.push("/");
          }
        } catch (error) {
          setVisible(true);
          setMessage(response.data.message);
        }
        // console.log();
      }
    };
    userDetails();
  }, []);
  useEffect(() => {
    if (products == null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [products]);

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
    <div>
      <Container>
        {visible && (
          <div className="alert_signUp">
            <Alert className="" color="danger" isOpen={visible}>
              {message}
            </Alert>
          </div>
        )}
        {props.user && props.user.isAdmin && (
          <div className="admin">
            {/* /product/orders */}
            <Link to="/admin/orders">
              <Button color="secondary">Dashboard</Button>
            </Link>
            <Link to="/admin/add">
              <Button color="success">Add new product</Button>
            </Link>
          </div>
        )}

        <div className="p1">
          <div className="details_home">
            <div className="store">ELECTRO STORE</div>
            <div className="storeDis">Best Products For Best Price</div>
            <div style={{ marginTop: "0" }} className="allPdts shopnow">
              <Link to="/products">
                <button id="allbtnpdts" style={{ fontSize: "15px" }}>
                  SHOP NOW
                </button>
              </Link>
            </div>
          </div>
          <div className="img_home">
            <img id="homeImg" src={MOBILEHOME} alt="" />
          </div>
        </div>
      </Container>

      <div className="p2">
        <div className="featuredPdts">
          <h2>FEATURED PRODUCTS</h2>
          <div className="underline"></div>
        </div>

        {loading ? (
          <div className="loading_ani1">
            <Loading />
          </div>
        ) : (
          ""
        )}

        <div className="products_featured">
          {products &&
            props.products &&
            props.products.map((product) => {
              if (product.highlight) {
                return (
                  <div className="cardProduct ">
                    <div className="card_Img">
                      <img
                        className="card_image"
                        top
                        width="100%"
                        src={product.image[0].url}
                        alt="Card image cap"
                      />
                    </div>
                    <div className="cardbody_home">
                      <div className="cardtitle_home" tag="h5">
                        {product.name}
                      </div>
                      <div className="pdt_price_view">
                        <div
                          tag="h6"
                          className="mb-2 text-muted CardSubtitle_home"
                        >
                          ₹{product.price}
                        </div>
                        {/* <CardText>{product.discription}</CardText> */}{" "}
                        <Link to={`/product/${product._id}`}>View</Link>{" "}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
        </div>
        <div className="allPdts">
          <Link to="/products">
            <button id="allbtnpdts">ALL PRODUCTS</button>
          </Link>
        </div>
      </div>
      <>
        <div className="p3">
          <div className="p3_header">
            <h2>Some Values We Provide</h2>
          </div>
          <div className="p3_values">
            {values.map((item) => {
              return (
                <div className="val">
                  <div className="icon_values">
                    <i className={item.icon}></i>
                  </div>
                  <h3 className="val_header">{item.header}</h3>
                  <div className="val_details">
                    <span>{item.details}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
      <Bottomnav></Bottomnav>
    </div>
  );
};

const mapStateToProps = (state) => ({
  products: state.products.products,
  user: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  setAllProducts: (products) => dispatch(setAllProducts(products)),
  setUserDetails: (user) => dispatch(setUserDetails(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
