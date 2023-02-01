import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from 'reactstrap'

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from 'react-redux'
import axios from 'axios'
import "./App.css";

import NavBar from './components/navbar/nav';
import { AddProduct } from "./pages/admin/products/add/add";

import Home from "./pages/home/home";
import Login from "./pages/user/Login/login";
import SignUp from "./pages/user/signup/signup";
import View from './pages/view/view'

import { setAllProducts } from './actions/product'
import { setUserDetails } from './actions/user'
import { setCartItems } from './actions/product'
import { Edit } from "./pages/admin/products/edit/edit";
import Cart from './pages/user/cart/cart'
import { Placed } from "./pages/user/order/placed/placed";
import { All } from "./pages/user/order/allorders/all";
import Admin from "./pages/admin/dashboard/admin";
import ViewOrder from "./pages/admin/dashboard/view/view";
import Products from './pages/products/product'
import Contact from "./pages/contact/contact";

function App(props) {
    const viewProducts = "https://electrostore-zqml.onrender.com/api/v1/product";
    const user_details = "https://electrostore-zqml.onrender.com/api/v1/user/details";
    const addCartUrl = `https://electrostore-zqml.onrender.com/api/v1/user/cart`;


    const [products, setProducts] = useState({});
    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState("");

    useEffect(() => {

        const response = async () => {
            try {
                const response = await axios.get(viewProducts);
                // products.current.value = response.data.message;
                if (!response.data.success) {
                    setVisible(true);
                    setMessage(response.data.message);
                } else {
                    const token = localStorage.getItem("token");
                    setProducts(response.data.message);
                }
                // return res;
            } catch (error) {
                setVisible(true);
                setMessage(error.message);
            }
        };
        response();
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
                    setMessage(error.message);
                }
                // console.log();
            }
        };
        userDetails();
        const userCart = async () => {
            if (localStorage.getItem("token")) {
                try {
                    const response = await axios({
                        method: "get",
                        url: addCartUrl,
                        headers: {
                            authorization: localStorage.getItem("token"),
                        },
                    });
                    console.log(response.data.success);
                    if (!response.data.success) {
                        console.log(response.data, "NOT SUCCESSSSSSSS");
                        setVisible(true);
                        setMessage(response.data.message);
                    } else {
                        const items = response.data.message.items;
                        props.setCartItems(response.data.message);
                    }
                } catch (error) {
                    setVisible(true);
                    setMessage(error.message);
                }
            }
        }
        userCart()
    }, []);

    useEffect(() => {
        props.setAllProducts(products);
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
        <React.Fragment>
            <Router>
                <NavBar />
                {visible && (
                    <div className="alert_signUp">
                        <Alert className="" color="danger" isOpen={visible}>
                            {message}
                        </Alert>
                    </div>
                )}
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/products" component={Products} />

                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path={`/product/:id`} component={View} />
                    <Route exact path={`/cart`} component={Cart} />
                    <Route exact path={`/ordersuccess`} component={Placed} />
                    <Route exact path={`/history`} component={All} />
                    <Route exact path={`/contact`} component={Contact} />




                    {/* Admin */}
                    {
                        props.user ? props.user.isAdmin && <Route exact path="/admin/add" component={AddProduct} /> : null
                    }
                    {
                        props.user ? props.user.isAdmin && <Route exact path={`/product/edit/:id`} component={Edit} /> : null
                    }
                    {
                        props.user ? props.user.isAdmin && <Route exact path={`/admin/orders`} component={Admin} /> : null
                    }
                    {
                        props.user ? props.user.isAdmin && <Route exact path={`/order/:id`} component={ViewOrder} /> : null
                    }

                </Switch>

            </Router>
        </React.Fragment>
    )

}

const mapStateToProps = (state) => ({
    products: state.products.products,
    user: state.user.user,
})

const mapDispatchToProps = (dispatch) => ({
    setAllProducts: (products) => dispatch(setAllProducts(products)),
    setUserDetails: (user) => dispatch(setUserDetails(user)),
    setCartItems: (items) => dispatch(setCartItems(items)),
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
