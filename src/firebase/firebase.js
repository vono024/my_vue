import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBfv8EFVp3V3EOtrSbhJiZ9CMRSAejFOwM",
    authDomain: "plantcareapp-b90bf.firebaseapp.com",
    projectId: "plantcareapp-b90bf",
    storageBucket: "plantcareapp-b90bf.appspot.com",
    messagingSenderId: "658710368869",
    appId: "1:658710368869:web:630a61333af79781c4ac8c"
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
