import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Container, Alert, Col, Row } from "reactstrap";
import ShowMoreText from "react-show-more-text";
import axios from "axios";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { setAllProducts } from "../../actions/product";

import { setUserDetails } from "../../actions/user";

import "./product.css";

import Loading from "../../components/loading/loading";

const Products = (props) => {
  // const products = useRef(" ");
  let category = [];
  let company = [];
  let color = [];
  // Final
  let FinalCategory = [];
  let Finalcompany = [];
  let FinalColor = [];

  const [products, setProducts] = useState(null);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState(null);
  const [comp, setComp] = useState(null);
  const [col, setColor] = useState(null);

  const history = useHistory();

  const viewProducts = "https://electrostore-zqml.onrender.com/api/v1/product";
  const user_details =
    "https://electrostore-zqml.onrender.com/api/v1/user/details";

  useEffect(() => {
    const response = async () => {
      try {
        setLoading(true);
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
          setLoading(false);
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
    console.log(products);
    // props.setAllProducts(products);
  }, [products]);

  // useEffect(() => {
  //   console.log(products);
  //   props.setAllProducts(products);
  // }, [products]);
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      // s("");
    }, 5000);
  }, [message]);
  useEffect(() => {
    props.setUserDetails(user);
  }, [user]);

  const handleProductView = (id) => {
    history.push(`/product/${id}`);
  };

  useEffect(() => {
    products &&
      props.products &&
      props.products.forEach((product) => {
        category.push(product.type);
        company.push(product.brand);
        color.push(product.colors);
      });

    // console.log(category, company);
    FinalCategory = [...new Set(category)];
    Finalcompany = [...new Set(company)];
    FinalColor = [...new Set(color)];

    setCat(FinalCategory);
    setComp(Finalcompany);
    setColor(FinalColor);
    // console.log(FinalCategory, Finalcompany);
  }, [products]);

  useEffect(() => {
    console.log(cat, "are cateogrys::::)");
  }, [cat]);

  const handleCategory = (category) => {
    const newPdts = props.products.filter((pdt) => {
      if (pdt.type.toLowerCase().includes(category.toLowerCase())) {
        return pdt;
      } else {
      }
    });
    setProducts(newPdts);
  };

  const handleClear = () => {
    setSearch("");
    setProducts(props.products);
  };

  return (
    <>
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
      {loading ? <Loading /> : ""}
      <div className="productPage">
        <div className="allFilters">
          <h3>Filter:</h3>
          <div className="serach">
            <Input
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              name="search"
            />
          </div>
          <div className="category">
            <h4>Category</h4>
            <>
              {products &&
                props.products &&
                cat &&
                cat.map((category) => {
                  return (
                    <li
                      onClick={() => handleCategory(category)}
                      className="cat"
                    >
                      <span>{category}</span>
                    </li>
                  );
                })}
            </>
          </div>

          <div className="clearFilters">
            <button onClick={() => handleClear()}>Clear Filter</button>{" "}
          </div>
        </div>
        <div className="allProducts">
          <Row>
            {products &&
              props.products &&
              products

                // props.products
                .filter((product) => {
                  if (search == "") return product;
                  else if (
                    product.name.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return product;
                  }
                })
                .map((product) => {
                  return (
                    <div
                      onClick={() => handleProductView(product._id)}
                      className="productView"
                    >
                      <div className="productName">
                        <div className="productUpdate">
                          <div className="productimg">
                            <img
                              src={product.image[0].url}
                              alt="Product Item Image"
                            />
                          </div>
                          <div className="">
                            <div className="productDetail">
                              <span className="productPrice">
                                ₹{product.price}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="">
                          <span className="productName_">{product.name}</span>
                          <div className="pdtDis">
                            {product.discription.length > 150 ? (
                              <span>
                                {product.discription.slice(0, 150)}.....
                              </span>
                            ) : (
                              product.discription
                            )}
                          </div>
                        </div>
                        {/* <div className="">
                        <div className="productDetail">
                          <span className="productPrice">₹{product.price}</span>
                        </div>
                      </div> */}
                      </div>
                    </div>
                  );
                })}
          </Row>
        </div>
      </div>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Products);
