import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";

// import styles from "./dropzone.css";

import "./add.css";
import axios from "axios";
import { setAllProducts } from "../../../../actions/product";

export const AddProduct = (props) => {
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();
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
  const [urls, setUrls] = useState([]);
  const [allProducts, setProducts] = useState(null);

  const [btnText, setBtnText] = useState("Upload");
  const [imageURLS, setImageURLS] = useState();
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [check, setCheck] = useState(false);

  // const [i, setI] = useState(1);
  // const len = imgs.length;
  let i = 1;
  var imgs = [];
  var images = [];

  // const [image, setImage] = useState([]);

  const handleChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    // console.log({ ...details, [inputName]: inputValue });
    // IMPORTANT STEP FOR TAKING INPUTS
    setDetails({ ...details, [inputName]: inputValue });
  };
  let uri = [];

  const imageDetails = async (imgs) => {
    // var uri = [];
    const len = imgs.length;
    // let i = 1;
    // console.log(imgs, "////////////////////////////////");
    const uploaders = await imgs.map((image) => {
      const data = new FormData();
      data.append("file", image);
      data.append("tags", `codeinfuse, medium, gist`);
      data.append("upload_preset", "ecommers");
      // data.append("cloud_name", "degyw2spa");
      return axios
        .post("https://api.cloudinary.com/v1_1/degyw2spa/image/upload", data, {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        })
        .then((response) => {
          const data = response.data;
          const fileURL = data.secure_url; // You should store this URL for future references in your app
          // console.log([data.url, ...urls]);
          console.log(data);
          uri.push({ url: data.url, publicId: data.public_id });
          setUrls([...urls, uri]);
          console.log(uri);
          setBtnText(`Uploaded ${i} of ${len}`);
          console.log("Uploading", `${i} of ${len}`);
          i++;
          console.log(data, ".........", i);
          return fileURL;
        })
        .catch((error) => {
          setVisible(true);
          setMessage(error.message);
          console.log(error.message);
        });
    });
    images = [];
  };

  // useEffect(() => {
  //   console.log(urls);
  // }, [urls]);

  const handleImage = (e) => {
    const length = e.target.files.length;
    let files = e.target.files;
    for (let i = 0; i < length; i++) {
      // console.log(files[i]);
      imgs.push(files[i]);
    }
    // Removing duplicated images Copied from google
    // https://www.geeksforgeeks.org/how-to-remove-duplicates-from-an-array-of-objects-using-javascript/
    // Declare an empty object
    let uniqueObject = {};
    // Loop for the array elements
    for (let i in imgs) {
      // Extract the title
      const objTitle = imgs[i]["name"];
      // Use the title as the index
      uniqueObject[objTitle] = imgs[i];
    }

    // Loop to push unique object into array
    for (let i in uniqueObject) {
      images.push(uniqueObject[i]);
    }
    // console.log(images);
    window.imageFiles = images;
  };

  const imageUpload = () => {
    if (window.imageFiles.length > 0) {
      setBtnText("Uploading");
      imgs = window.imageFiles;
      window.imageFiles = [];
      imageDetails(imgs);
    } else {
      setBtnText("No Images selected");
    }
  };

  useEffect(() => {
    if (i == imgs.length) {
      setBtnText("Uploaded");
    }
  }, [btnText]);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      // s("");
    }, 5000);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addData = {
      ...details,
      isAvailable,
      highlight: check,
      image: urls[0],
    };
    console.log(addData);
    const newProduct =
      "https://electrostore-zqml.onrender.com/api/v1/product/new";
    try {
      const response = await axios({
        method: "post",
        url: newProduct,
        data: addData,
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      if (!response.data.success) {
        setVisible(true);
        setMessage(response.data.message);
      } else {
        // SET_NEWPRODUCT;
        dispatch({
          type: "SET_ALLPRODUCTS",
          products: [...products, response.data.newProduct],
        });
        setTimeout(() => {
          history.push("/");
        }, 500);

        setProducts(response.data.newProduct);
        console.log(response.data);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }

    setUrls(uri);
    console.log({ ...details, isAvailable }, urls[0]);
  };

  const handleCheck = (e) => {
    setisAvailable(!isAvailable);
    console.log(e.target.value);
  };

  useEffect(() => {
    console.log(products);
  }, []);

  const handleUpdate = () => {
    setCheck(!check);
  };

  // useEffect(() => {
  //   props.setAllProducts([...props.products, products]);
  // }, [products]);

  return (
    <React.Fragment>
      <Form>
        <Container>
          {/* <div className="add_header_">
            <h3 className="add_header">Add Product </h3>
          </div> */}

          {visible && (
            <div className="alert_signUp">
              <Alert className="" color="danger" isOpen={visible}>
                {message}
              </Alert>
            </div>
          )}

          <div className="inputs_add">
            <div className>
              <h3 className="add_header_">Add Product </h3>
            </div>
            <div className="rowAdd row">
              <div className="eleA col-md-5 offset-md-1 offset-lg-0">
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
              <div className="eleB col-md-5 ">
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
              <div className="eleA col-md-5 offset-md-1 offset-lg-0">
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
              <div className="eleA col-md-5 offset-md-1 offset-lg-0">
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
            <div className="eleDisc col-md-10 offset-md-1 offset-lg-0">
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
              <div className="col-md-5 offset-md-1 offset-lg-0">
                <div style={{ marginTop: "15px" }} className="img_input">
                  {/* <Label for="exampleFile" sm={2}>
                    Image's
                  </Label> */}
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
                  {/* </Col> */}
                </div>
              </div>
              <div className="col-md-5 my-2 offset-md-1 offset-lg-0">
                {/* <div check>
                  <Input
                    value={isAvailable}
                    onChange={handleCheck}
                    type="checkbox"
                    name="isAvailable"
                    id="exampleCheck"
                  />
                  <Label for="exampleCheck" check>
                    Available
                  </Label>
                </div> */}
                <div className="available">
                  <label className="switch">
                    <input
                      value={isAvailable}
                      onChange={handleCheck}
                      type="checkbox"
                      name="isAvailable"
                      id="exampleCheck"
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
                      value={check}
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
                className="col-md-10 BtnSubmit offset-md-1 offset-lg-0"
                color="info"
                onClick={handleSubmit}
              >
                <span style={{ color: "white" }}>Add product</span>
              </Button>
            </div>
          </div>
        </Container>
      </Form>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  products: state.products.products,
});

const mapDispatchToProps = (dispatch) => ({
  setAllProducts: (products) => dispatch(setAllProducts(products)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
