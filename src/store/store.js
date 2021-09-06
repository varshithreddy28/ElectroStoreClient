import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import Products from '../reducers/products'
import User from '../reducers/userReducer'
import Reviews from "../reducers/reviews";
import Admin from "../reducers/admin";


const logger = createLogger();

const middlewares = [thunk, logger];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configStore = () => {
    const store = createStore(
        combineReducers({
            products: Products,
            user: User,
            reviews: Reviews,
            admin: Admin
        }),
        composeEnhancers(applyMiddleware(...middlewares))
    )
    return store
}

export default configStore