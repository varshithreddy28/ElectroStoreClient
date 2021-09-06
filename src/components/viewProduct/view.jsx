import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Product from "./product/product";
import axios from "axios";
import Revadd from "../review/add/revadd";

export const View = (props) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const id = useParams();
  //   console.log(id.id);
  useEffect(() => {
    const getProductDetails = async () => {
      console.log("Eeeeeeeeeeeeeee");
      const response = await axios.get(
        `https://electro--store.herokuapp.com/api/v1/product/${id.id}`
      );
      if (response.data.success) {
        console.log("FFfffffffffff");
        console.log(response.data.message);

        setProduct(response.data.message);
      } else {
        console.log(response.data.message);
      }
    };
    //
    const foundPdt = props.products.filter((pdt) => {
      console.log(pdt._id, id);
      return pdt._id == id.id;
    });
    if (foundPdt.length != 0) {
      setProduct(foundPdt);
    } else {
      getProductDetails();
    }
  }, []);
  useEffect(() => {
    if (product) {
      console.log(product);
      setLoading(true);
    }
  }, [product]);
  return (
    <React.Fragment>
      {console.log(
        loading && product ? (product.length != 0 ? "true" : product) : null
      )}
      <div>
        {" "}
        {loading && product ? (
          product.length > 0 ? (
            <Product product={product[0]} />
          ) : (
            <Product product={product} />
          )
        ) : (
          console.log("Not Yet Done")
        )}{" "}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  products: state.products.products,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(View);
