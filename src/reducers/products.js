const initialState = {
    products: [],
    productEdit: {},
    cartItems: null,
    newProduct: {}
}

export default function Products(state = initialState, action) {
    switch (action.type) {
        case "SET_ALLPRODUCTS":
            // console.log(action.products)
            return {
                ...state,
                products: action.products
            }
        case "SET_EDITPRODUCT":
            // console.log(action.products)
            return {
                ...state,
                productEdit: action.product
            }
        // SET_CARTITEMS
        case "SET_CARTITEMS":
            return {
                ...state,
                cartItems: action.items
            }
        case "SET_NEWPRODUCT":
            return {
                ...state,
                newProduct: action.newProduct
            }
        default:
            return state
    }
}