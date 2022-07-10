// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCHqv_ZnJYxltiwqrldhrtHcMx6NV-wp-w',
  authDomain: 'vehicletracker-1a081.firebaseapp.com',
  projectId: 'vehicletracker-1a081',
  storageBucket: 'vehicletracker-1a081.appspot.com',
  messagingSenderId: '43614455509',
  appId: '1:43614455509:web:e4d4e4b68d27a6663e445c',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export default getFirestore()
