import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup as div,
  Label,
  Input,
  Container,
  Alert,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import { setAllProducts } from "../../actions/product";

import "./editForm.css";

export const EditForm = (props) => {
  const [details, setDetails] = useState({
    name: "",
    type: "",
    quantity: 0,
    colors: "",
    price: 0,
    brand: "",
    discription: "",
  });
  const history = useHistory();
  const [isAvailable, setisAvailable] = useState(false);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [check, setCheck] = useState(false);

  const handleChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    // console.log({ ...details, [inputName]: inputValue });
    // IMPORTANT STEP FOR TAKING INPUTS
    setDetails({ ...details, [inputName]: inputValue });
  };

  const handleCheck = (e) => {
    setDetails({ ...details, isAvailable: !details.isAvailable });
    setisAvailable(!details.isAvailable);
    console.log(e.target.value, details);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editUrl = `https://electro--store.herokuapp.com/api/v1/product/edit/${details._id}`;
    try {
      const response = await axios({
        method: "patch",
        url: editUrl,
        data: details,
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      if (!response.data.success) {
        setVisible(true);
        setMessage(response.data.message);
      } else {
        const products = props.products;
        const index = props.products.findIndex((pdt) => pdt._id == details._id);
        products[index] = details;

        history.push(`/product/${details._id}`);
      }
    } catch (error) {
      console.log(error.message);
    }
    console.log(details);
  };

  useEffect(() => {
    setDetails({ ...props.productEdit });
    console.log(".........................................");
  }, []);

  useEffect(() => {
    console.log(details);
  }, [details]);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      // s("");
    }, 5000);
  }, [message]);

  const handleUpdate = (e) => {
    setDetails({ ...details, highlight: !details.highlight });
    setCheck(!details.highlight);
  };

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
        <div className="editName">
          Editing
          <span style={{ fontWeight: "600", marginLeft: "10px" }}>
            {props.productEdit.name}
          </span>
        </div>
        <div className="inputs_add_edit">
          <div className="rowAdd row">
            <div className="eleA col-md-5">
              <label htmlFor="name">Product Name</label>
              <Input
                type="text"
                value={details.name}
                name="name"
                onChange={handleChange}
                id="name"
                placeholder="Product Name"
              ></Input>
            </div>
            <div className="eleB col-md-5">
              <label htmlFor="type">Product Type</label>
              <Input
                type="type"
                value={details.type}
                name="type"
                onChange={handleChange}
                id="type"
                placeholder="Product Type"
              ></Input>
            </div>
          </div>
          <div className="rowAdd row">
            <div className="eleA col-md-5">
              <label htmlFor="quantity">Quantity</label>
              <Input
                type="number"
                value={details.quantity}
                name="quantity"
                onChange={handleChange}
                id="quantity"
                placeholder="Quantity"
              ></Input>
            </div>
            <div className="eleB col-md-5">
              <label htmlFor="Colors">Colors</label>
              <Input
                type="text"
                value={details.colors}
                name="colors"
                onChange={handleChange}
                id="Colors"
                placeholder="Colors"
              ></Input>
            </div>
          </div>
          <div className="rowAdd row">
            <div className="eleA col-md-5">
              <label htmlFor="Price">Price</label>
              <Input
                type="number"
                value={details.price}
                name="price"
                onChange={handleChange}
                id="Price"
                placeholder="Price"
              ></Input>
            </div>
            <div className="eleB col-md-5">
              <label htmlFor="Brand">Brand</label>
              <Input
                type="text"
                value={details.brand}
                name="brand"
                onChange={handleChange}
                id="Brand"
                placeholder="Brand"
              ></Input>
            </div>
          </div>
          <div className="eleDisc col-md-10">
            <label htmlFor="Discription">Discription</label>
            <Input
              type="textarea"
              id="Discription"
              placeholder="Discription"
              name="discription"
              onChange={handleChange}
              value={details.discription}
            ></Input>
          </div>
          <div className="rowdisc row">
            {/* <div className="col-md-5">
              <div style={{ marginTop: "15px" }} className="img_input">
                
                <Input
                  type="file"
                  name="image"
                  onChange={handleImage}
                  id="exampleFile"
                  multiple
                />
                <Button color="info" onClick={imageUpload}>
                  <span style={{ color: "white" }}>{btnText}</span>
                </Button>{" "}
                
              </div>
            </div> */}
            <div className="col-md-5 my-2">
              <div className="available">
                <label className="switch">
                  <input
                    value={details.isAvailable}
                    onChange={handleCheck}
                    type="checkbox"
                    name="isAvailable"
                    id="exampleCheck"
                    checked={details.isAvailable}
                  />
                  <span className="slider round"></span>
                  <div style={{ marginTop: "10px" }}>
                    <span className="delivered">Available</span>
                  </div>
                </label>
              </div>
              <div className="orderUpdate">
                <label className="switch">
                  <input
                    type="checkbox"
                    value={details.highlight}
                    checked={details.highlight}
                    name="highlight"
                    onClick={() => handleUpdate()}
                  />
                  <span className="slider round"></span>
                  <div style={{ marginTop: "10px" }}>
                    <span className="delivered">Highlight</span>
                  </div>
                </label>
              </div>
            </div>
            {/* <div className="inputs_add_"> */}

            {/* </div> */}

            {/* </FormGroup> */}
          </div>
          <div className="submitBtn row">
            <div className=""></div>
            <Button
              className="col-md-10 BtnSubmit"
              color="info"
              onClick={handleSubmit}
            >
              <span style={{ color: "white" }}>Edit product</span>
            </Button>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  productEdit: state.products.productEdit,
  products: state.products.products,
});

const mapDispatchToProps = (dispatch) => ({
  setAllProducts: (products) => dispatch(setAllProducts(products)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditForm);
