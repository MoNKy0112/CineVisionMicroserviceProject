import { ADD_USER_TO_STATE, REMOVE_USER_FROM_STATE } from "../actions/userActions";

const initialState = { payload: null }

export default function userReducer(state=initialState, {type, payload}){
    switch (type) {
        case ADD_USER_TO_STATE:
            return {
                payload: payload
            }
        
        case REMOVE_USER_FROM_STATE:
            return {
                payload: null
            }
    
        default:
            return state;
    }
}