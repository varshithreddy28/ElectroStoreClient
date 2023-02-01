import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { connect } from "react-redux";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import "./navbar.css";
import { setUserDetails } from "../../actions/user";

import Bottomnav from "./bottom/bottomnav";

const NavBar = (props) => {
  const dispatch = useDispatch();

  const history = useHistory();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [path, setPath] = useState(null);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const pathname = window.location.pathname;
    setPath(location.pathname);
    console.log(location, "HEYYYYY WATCH ME YA!");
  }, []);
  const handleLogout = async () => {
    const logoutURL =
      "https://electrostore-zqml.onrender.com/api/v1/user/logout";
    try {
      const res = await axios.get(logoutURL);
      localStorage.clear();
      dispatch({ type: "SET_LOGOUT", user: "" });
      history.push("/");
      setClose(!close);
    } catch (error) {
      console.log(error.message);
    }
  };

  // NAV
  const handleLogo = () => {
    if (prev) {
      const act = document.getElementById(`${prev}`);
      act && act.classList.remove("active");
    }
    setPrev(1);
    const name = document.getElementById(1);
    name && name.classList.add("active");
    history.push("/");
  };

  const [close, setClose] = useState(false);
  const [prev, setPrev] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDrop = () => setDropdownOpen((prevState) => !prevState);
  const [lastClicked, setLastClicked] = useState(null);

  const handleNav = (id, pathNav) => {
    console.log(location, "HEYYYYY WATCH ME YA!");
    const pathname = window.location.pathname;
    setPath(pathNav);
    setClose(!close);
    if (prev) {
      const act = document.getElementById(`${prev}`);
      act && act.classList.remove("active");
    }
    setPrev(id);
    const name = document.getElementById(`${id}`);
    name && name.classList.add("active");
  };

  useEffect(() => {
    console.log(path, "is path");
  }, [path]);

  const handleDrop = () => {
    setClose(!close);
  };

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <div>
      <nav>
        <input
          onClick={handleNav}
          checked={close}
          type="checkbox"
          name=""
          id="check"
        />
        <label htmlFor="check" className="checkbtn">
          {close ? (
            <i class="fas fa-times"></i>
          ) : (
            <i className="fas fa-bars"></i>
          )}
        </label>
        <label
          style={{ cursor: "pointer" }}
          htmlFor=""
          onClick={handleLogo}
          className="logo"
        >
          Electro Store
        </label>
        <ul>
          <li>
            <Link
              className={path === "/" ? "active" : ""}
              id="1"
              onClick={() => handleNav(1, "/")}
              to="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={path === "/products" ? "active" : ""}
              id="3"
              onClick={() => handleNav(3, "/products")}
              to="/products"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              className={path === "/cart" ? "active" : ""}
              id="2"
              onClick={() => handleNav(2, "/cart")}
              to="/cart"
            >
              Cart
            </Link>
          </li>
          <li>
            <Link onClick={handleNav} to="/contact">
              Contact
            </Link>
          </li>
          <li>
            {/* <Link onClick={handleNav} to="/">
              USER
            </Link> */}
            <Dropdown isOpen={dropdownOpen} toggle={toggleDrop}>
              <div style={{ color: "white" }} className="userStyle">
                <DropdownToggle caret color="">
                  <i
                    style={{ fontSize: "2rem" }}
                    className="far fa-user-circle"
                  ></i>
                </DropdownToggle>
              </div>

              {props.user ? (
                <DropdownMenu container="body">
                  <Link onClick={handleDrop} to="/history">
                    <DropdownItem>
                      {" "}
                      <i
                        style={{ marginRight: "8px", color: "#b48cdada" }}
                        class="fas fa-history"
                      ></i>
                      History
                    </DropdownItem>
                  </Link>
                  <Link onClick={handleLogout}>
                    <DropdownItem>
                      <i
                        style={{ marginRight: "8px", color: "#b48cdada" }}
                        class="fas fa-sign-out-alt"
                      ></i>
                      Log Out
                    </DropdownItem>
                  </Link>
                </DropdownMenu>
              ) : (
                <DropdownMenu container="body">
                  <Link onClick={handleDrop} to="/login">
                    <DropdownItem>
                      {" "}
                      <i
                        style={{ marginRight: "8px", color: "#b48cdada" }}
                        class="fas fa-sign-in-alt"
                      ></i>
                      Login
                    </DropdownItem>
                  </Link>
                  <Link onClick={handleDrop} to="/signup">
                    <DropdownItem>
                      <i
                        style={{ marginRight: "8px", color: "#b48cdada" }}
                        class="fas fa-user-plus"
                      ></i>
                      Sign Up
                    </DropdownItem>
                  </Link>
                </DropdownMenu>
              )}
            </Dropdown>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUserDetails: (user) => dispatch(setUserDetails(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
