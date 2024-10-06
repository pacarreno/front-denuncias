import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCCXdtLnofhEoodS4FJIfZThP58pIuQ3Kw",
  authDomain: "front-denuncias.firebaseapp.com",
  projectId: "front-denuncias",
  storageBucket: "front-denuncias.appspot.com",
  messagingSenderId: "568498047151",
  appId: "1:568498047151:web:63e62292686d7905cbac5a",
  measurementId: "G-WLN41MDZCP"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Para usar Firebase Storage
const storage = getStorage(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, storage, auth, analytics };
