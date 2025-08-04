// firebase.js - conecta ao Firestore e busca os logs de cliques
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collectionGroup, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_FIREBASE_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchAllClicks() {
  const clicks = [];
  const querySnapshot = await getDocs(collectionGroup(db, "clicks"));
  querySnapshot.forEach(doc => {
    clicks.push(doc.data());
  });
  return clicks;
}
