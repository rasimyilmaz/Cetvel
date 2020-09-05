import * as types from '../constants/ActionTypes'
const initialState ={}
export const authReducer = (state=initialState,action)=>{
    switch(action.type){
        case types.setUser:
            return {
                ...state,
                uid:action.uid,
                displayName:action.displayName
            }
        case types.setUserConfig:
            return {
                ...state,
                ...action.config
            }
        case types.setRememberMe:
            return {
                ...state,
                rememberMe:true,
            }
        case types.setSignedIn:
            return {
                ...state,
                signedIn:true
            }
        case types.signOut:
            return {

            }
        default:
            return state
    }
}
