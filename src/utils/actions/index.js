//import * as creators from '../creators'
import { db } from '../firebase'
export const Sign_In= (val) =>{
    return (dispatch,getState)=>{
        db.collection('papers').doc('settings').update({isLogged:val}).then(
            ()=>{
                dispatch()
            }
        )
    }
}