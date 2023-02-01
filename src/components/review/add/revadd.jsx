import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import {
  Button,
  Alert,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { connect } from "react-redux";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import ShowMoreText from "react-show-more-text";

import Edit from "../../../assets/Edit.svg";
import Delete from "../../../assets/Delete.svg";
import { setAllReviews } from "../../../actions/review";

import "./revadd.css";
import "../star.css";

function Revadd({ productView, user, reviews, setAllReviews }) {
  const history = useHistory();

  const [review, setReview] = useState("");
  const [allReviews, setallReview] = useState([]);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [product, setProduct] = useState(null);
  const [revEdit, setRevEdit] = useState("");
  const [revId, setRevId] = useState("");
  const [revIndex, setRevIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [revRating, setRevRating] = useState(0);
  const [revEditRatings, setRevEditRatings] = useState(0);

  const [revEditRating, setRevEditRating] = useState(null);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [focusAfterClose, setFocusAfterClose] = useState(true);

  const toggle = () => setOpen(!open);
  //   console.log(product);
  const getProductDetails = async () => {
    const response = await axios.get(
      `https://electrostore-zqml.onrender.com/api/v1/product/${productView._id}`
    );
    if (response.data.success) {
      setProduct(response.data.message);
      setallReview(response.data.message.reviews);
      setAllReviews(response.data.message.reviews);
    } else {
      setVisible(true);
      setMessage(response.data.message);
      return true;
    }
  };
  useEffect(() => {
    if (review.length <= 0) {
      getProductDetails();
    } else {
      console.log("gfgfgfgfgffjfjfkfl");
      setallReview(reviews);
    }
  }, []);

  const handleAdd = async (e) => {
    const addUrl = `https://electrostore-zqml.onrender.com/api/v1/product/${product._id}/review/new`;
    setLoading(true);
    setVisible(true);

    setMessage("UPDATING REVIEWS PLEASE WAIT");

    try {
      const response = await axios({
        method: "post",
        url: addUrl,
        data: { review: review, rating: revRating },
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      if (!response.data.success) {
        setVisible(true);
        setMessage(
          response.data.message == "rating must be a number"
            ? "Rating is Required"
            : response.data.message
        );
      } else {
        // console.log(review, user);
        // console.log(response.data.message);
        console.log(reviews);
        let newRev = { owner: user, review: review, rating: rating };
        let allrevs = reviews;
        allrevs.push(newRev);

        setRevRating(null);
        setAllReviews(allrevs);
        setallReview(allrevs);
        await getProductDetails();
        setReview("");
        setLoading(false);
        //   setAllReviews(response.data.message.reviews);
        // history.push("/");
      }
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
    }
    console.log(review);
  };

  useEffect(() => {
    // setTimeout(() => {
    //   setVisible(false);
    //   // s("");
    // }, 5000);
    if (loading) {
    }
  }, [allReviews]);

  const handleEdit = (i) => {
    // console.log(allReviews);
    let editingReviews = allReviews;
    // console.log(editingReviews[i]);
    setRevEditRatings(editingReviews[i].rating);
    setRevEdit(editingReviews[i].review);
    setRevId(editingReviews[i]._id);
    setRevIndex(i);
    setOpen(!open);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setVisible(false);
  //     // s("");
  //   }, 3000);
  // }, [message]);

  // Review update to backend
  const handleEditRev = async () => {
    setLoading(true);
    setMessage("HANG ON UPDATING DATA!");
    const editUrl = `https://electrostore-zqml.onrender.com/api/v1/product/${productView._id}/review/edit/${revId}`;
    try {
      const response = await axios({
        method: "patch",
        url: editUrl,
        data: { review: revEdit, rating: revEditRatings },
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      if (!response.data.success) {
        // setOpen(!open);
        setVisible(true);
        setMessage(response.data.message);
      } else {
        setVisible(true);
        setMessage(response.data.message);
        //   Updating
        let editingReviews = allReviews;
        editingReviews[revIndex].review = revEdit;
        editingReviews[revIndex].rating = revEditRatings;

        console.log(editingReviews);
        setRevEdit(editingReviews);
        setLoading(false);
        console.log(response.data.message);
        // history.push("/");
      }
      console.log(response.data);
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
    }
    setOpen(!open);
  };

  const handleRevUpdate = (e) => {
    setRevEdit(e.target.value);
  };

  const handleDelete = async (id, i) => {
    setLoading(true);
    setVisible(true);

    setMessage("HANG ON UPDATING DATA!");
    const delUrl = `https://electrostore-zqml.onrender.com/api/v1/product/${productView._id}/review/delete/${id}`;
    try {
      const response = await axios({
        method: "delete",
        url: delUrl,
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      if (!response.data.success) {
        // setOpen(!open);
        setVisible(true);
        setMessage(response.data.message);
      } else {
        //   Updating
        let editingReviews = allReviews;
        editingReviews.splice(i, 1);
        console.log(editingReviews);
        setRevEdit(editingReviews);
        setVisible(true);
        setMessage(response.data.message);
        setLoading(false);
        // history.push("/");
      }
      console.log(response.data);
    } catch (error) {
      setVisible(true);
      setMessage(error.message);
    }
  };

  return (
    <div>
      {loading && visible ? (
        <div className="alert_signUp">
          <Alert className="" color="info" isOpen={visible}>
            {message}
          </Alert>
        </div>
      ) : null}

      {/* {loading ? (
        <div className="alert_signUp">
          <Alert className="" color="info" isOpen={loading}>
            {message}
          </Alert>
        </div>
      ) : null} */}
      {user && (
        <div className="reviewAdd">
          <div className="revadd col-md-12">
            <div className="rating">
              <h4 id="ratingHead">Rating: </h4>
              {
                // create 5 untitled array elements
                [...Array(5)].map((star, i) => {
                  const ratingValue = i + 1;
                  // console.log(ratingValue, i);
                  return (
                    <label>
                      <input
                        type="radio"
                        name="rating"
                        id={i}
                        value={ratingValue}
                        onClick={() => setRevRating(ratingValue)}
                      />
                      <FaStar
                        className="star"
                        color={ratingValue <= revRating ? "gold" : "grey"}
                        size={30}
                      />
                    </label>
                  );
                })
              }
            </div>

            <label id="revaddlable" htmlFor="add">
              Add Review
            </label>

            <div className="addrev">
              <input
                id="add"
                type="text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></input>
              <Button onClick={handleAdd} outline color="info">
                Add
              </Button>{" "}
            </div>
          </div>
        </div>
      )}

      <div className="reviews col-md-12">
        <h3 style={{ margin: "10px", fontWeight: "400" }}>Reviews :</h3>
        <hr />

        {product && allReviews && allReviews.length > 0 ? (
          allReviews.map((review, i) => {
            return (
              <div className="revView">
                <div className="review">
                  {/* <span className="rev">{review.review}</span> */}
                  <div className="revdata">
                    <span>
                      <span className="revowner">{review.owner.username}</span>{" "}
                    </span>
                    <span className="revRating">
                      <p class="starability-result" data-rating={review.rating}>
                        Rated: {review.rating} stars
                      </p>
                    </span>
                    <span className="rev">
                      <ShowMoreText>{review.review}</ShowMoreText>
                    </span>
                  </div>
                  {(user && user._id === review.owner._id) || user.isAdmin ? (
                    <div className="revBtns">
                      <button className="editrev" onClick={() => handleEdit(i)}>
                        <img src={Edit} alt="" />
                        <span>Edit</span>
                      </button>
                      <button
                        className="deleteRev"
                        onClick={() => handleDelete(review._id, i)}
                      >
                        <img src={Delete} alt="Delete image" />
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
                <hr />
              </div>
            );
          })
        ) : (
          <div>No Reviews</div>
        )}
      </div>
      <Modal returnFocusAfterClose={focusAfterClose} isOpen={open}>
        <ModalBody>
          <h4>Edit Review :</h4>
          <div className="rating_edit">
            <h4 id="ratingHead">Rating: </h4>
            {
              // create 5 untitled array elements
              [...Array(5)].map((star, i) => {
                const revEditRating = i + 1;
                // console.log(ratingValue, i);
                return (
                  <label>
                    <input
                      type="radio"
                      name="ratingEdit"
                      id={i}
                      value={revEditRating}
                      onClick={() => setRevEditRatings(revEditRating)}
                    />
                    <FaStar
                      className="star"
                      color={revEditRating <= revEditRatings ? "gold" : "grey"}
                      size={30}
                    />
                  </label>
                );
              })
            }
          </div>
          <h4>Review:</h4>
          <Input
            type="textarea"
            value={revEdit}
            onChange={handleRevUpdate}
            name="text"
            id="exampleText"
          ></Input>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEditRev}>
            Submit
          </Button>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
const mapStateToProps = (state) => ({
  product: state.products.productEdit,
  user: state.user.user,
  reviews: state.reviews.reviews,
});

const mapDispatchToProps = (dispatch) => ({
  setAllReviews: (productEdit) => dispatch(setAllReviews(productEdit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Revadd);
