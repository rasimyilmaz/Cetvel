import * as types from '../constants/ActionTypes'


export const setUser= (uid,displayName)=>({
    type: types.setUser,
    uid,
    displayName
})

export const setUserConfig = config =>({
    type: types.setUserConfig,
    config
})
export const setRememberMe = () =>({
    type:types.setRememberMe
})

export const setSignedIn = ()=>({
    type: types.setSignedIn,
})

export const signOut = ()=>({
    type: types.signOut,
})