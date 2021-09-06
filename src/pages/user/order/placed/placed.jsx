import React from "react";
import { connect } from "react-redux";

export const Placed = (props) => {
  return (
    <React.Fragment>
      <div>Order Placed Successfully</div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Placed);
