import React from "react";
import { connect } from "react-redux";
import EditForm from "../../../../components/productEdit/editForm";

export const Edit = (props) => {
  return (
    <div>
      {" "}
      <EditForm />{" "}
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
