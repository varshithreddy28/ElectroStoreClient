const initialState = {
    reviews: [],
}

export default function Reviews(state = initialState, action) {
    switch (action.type) {
        case "SET_ALLREVIEWS":
            // console.log(action.user)
            return {
                ...state,
                reviews: action.reviews
            }
        default:
            return state
    }
}