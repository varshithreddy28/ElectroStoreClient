//
const initialState = {
    products: [],
    users: []
}

export default function Admin(state = initialState, action) {
    switch (action.type) {
        case "SET_BOUGHTPRODUCTS":
            return {
                ...state,
                products: action.details
            }
        case "SET_BOUGHTUSER":
            return {
                ...state,
                user: action.user
            }
        default:
            return state
    }
}