import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import firebaseConfig from './config'

firebase.initializeApp(firebaseConfig)

export default firebase
export const db = firebase.firestore()
// export const cardsRef = db.collection("");
