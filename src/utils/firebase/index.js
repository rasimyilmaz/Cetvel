
import {config} from '../constants/Firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export const instance = firebase.initializeApp(config)
export const db = instance.firestore()
export const auth = instance.auth()
