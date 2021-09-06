const initialState = {
    user: [],
}

export default function User(state = initialState, action) {
    switch (action.type) {
        case "SET_USER":
            console.log(action.user)
            return {
                ...state,
                user: action.user
            }
        case "SET_LOGOUT":
            return {
                user: ""
            }
        default:
            return state
    }
}