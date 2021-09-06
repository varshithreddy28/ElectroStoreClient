import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { UncontrolledCarousel, Container, Button, Alert } from "reactstrap";
import "./product.css";
import { setEditProduct } from "../../../actions/product";
import { connect } from "react-redux";
import axios from "axios";
import Revadd from "../../review/add/revadd";
import { setAllReviews } from "../../../actions/review";
import ShowMoreText from "react-show-more-text";
import Loading from "../../loading/loading";
import Buy from "../../buy/buy";

function Product({ product, setEditProduct, user, setAllReviews, cartItems }) {
  const history = useHistory();

  const [productEdit, setProductEdit] = useState(null);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [reviews, setReviews] = useState("");

  const [loading, setLoading] = useState(true);

  const items = product.image.map((item, i) => {
    return {
      src: item.url,
      altText: `Slide ${i + 1}`,
      //   caption: "Slide 1",
      //   header: "Slide 1 Header",
      key: `${i + 1}`,
    };
  });
  useEffect(() => {
    setProductEdit(product);
  }, []);
  useEffect(() => {
    setEditProduct(productEdit);
  }, [productEdit]);
  setEditProduct(product);
  // const getProductDetails = async () => {
  //   const response = await axios.get(
  //     `https://electro--store.herokuapp.com/api/v1/product/${product._id}`
  //   );
  //   if (response.data.success) {
  //     console.log(response.data.message.reviews);
  //     setReviews(response.data.message.reviews);
  //   } else {
  //     setVisible(true);
  //     setMessage(response.data.message);
  //   }
  // };
  const handleDelete = async (e) => {
    e.preventDefault();
    const deleteUrl = `https://electro--store.herokuapp.com/api/v1/product/delete/${product._id}`;
    try {
      const response = await axios({
        method: "delete",
        url: deleteUrl,
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      if (!response.data.success) {
        setVisible(true);
        setMessage(response.data.message);
      } else {
        // console.log(response.data.message);
        history.push(`/`);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      // s("");
    }, 5000);
  }, [message]);

  // const handleAdd = async (e) => {
  //   const addUrl = `https://electro--store.herokuapp.com/api/v1/product/${product._id}/review/new`;

  //   try {
  //     const response = await axios({
  //       method: "post",
  //       url: addUrl,
  //       data: { review: review },
  //       headers: {
  //         authorization: localStorage.getItem("token"),
  //       },
  //     });
  //     if (!response.data.success) {
  //       setVisible(true);
  //       setMessage(response.data.message);
  //     } else {
  //       getProductDetails();
  //       // setReviews(response.data.message.reviews);
  //     }
  //   } catch (error) {
  //     setVisible(true);
  //     setMessage(error.message);
  //   }
  // };

  useEffect(() => {
    setAllReviews(reviews);
  }, [reviews]);

  // Image Click
  const handleFullImage = (src) => {
    const fullImage = document.getElementById("fullimg");
    fullImage.src = src;
  };

  const handlePdtEdit = () => {
    history.push(`/product/edit/${product._id}`);
  };

  const handleImageLoad = (src) => {
    const fullImage = document.getElementById("fullimg");
    console.log(fullImage.clientWidth);
  };

  return (
    <Container>
      <div className="product_details row offset">
        {visible && (
          <div className="alert_signUp">
            <Alert className="" color="danger" isOpen={visible}>
              {message}
            </Alert>
          </div>
        )}
        <div className="images_carousel">
          <div className="imgLg">
            <img
              id="fullimg"
              // onLoad={handleImageLoad(items.src)}
              src={items[0].src}
              alt=""
            />
          </div>
          <div className="imgsml">
            {items.map((item) => {
              return (
                <div className="imageSamll">
                  <img
                    src={item.src}
                    alt=""
                    onClick={() => handleFullImage(item.src)}
                  />
                </div>
              );
            })}
          </div>
          {/* <UncontrolledCarousel items={items}></UncontrolledCarousel> */}
          {user && user.isAdmin && (
            <div className="adminBtnsProduct_">
              <Button color="info" onClick={handlePdtEdit}>
                EDIT
              </Button>
              <Button color="danger" onClick={handleDelete}>
                DELETE
              </Button>
            </div>
          )}
          {productEdit && <Buy />}
        </div>
        <div className="details_products">
          <div className="details_pdt">
            <div className="pdtName">{product.name}</div>
            {/* <div className="rating">Rating</div> */}
            <div className="pdtBrand">
              Brand :{" "}
              <span
                style={{
                  fontWeight: "400",
                  fontStyle: "italic",
                  textTransform: "uppercase",
                }}
              >
                {product.brand}
              </span>{" "}
            </div>
            <div className="pdtPrice">
              <span className="price"> Price:</span>{" "}
              <span className="price.price"> ₹{product.price}</span>
            </div>
            <div className="pdtColors">
              <span className="pdtC">Color : </span>

              <span
                style={{ backgroundColor: `${product.colors}` }}
                className="dot"
              ></span>
            </div>
            <div className="pdtDiscription">
              <div className="discriptionHeader">Discription </div>
              <div className="discriptionBody">
                <ShowMoreText>{product.discription}</ShowMoreText>
              </div>
            </div>
          </div>
        </div>
      </div>
      {productEdit && <Revadd productView={productEdit} />}
    </Container>
  );
}

const mapStateToProps = (state) => ({
  productEdit: state.products.productEdit,
  user: state.user.user,
  cartItems: state.products.cartItems,
});

const mapDispatchToProps = (dispatch) => ({
  setEditProduct: (productEdit) => dispatch(setEditProduct(productEdit)),
  setAllReviews: (reviews) => dispatch(setAllReviews(reviews)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
