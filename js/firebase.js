// firebase.js - conecta a dois Firestores e busca os logs de cliques

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collectionGroup, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Config Firebase do projeto 1
const firebaseConfig1 = {
  apiKey: "AIzaSyB2THszVcMge2Al4puPXrDpcLbzjCw1xPY",
  authDomain: "affiliatedata.firebaseapp.com",
  projectId: "amazonaffiliatedata",
  storageBucket: "amazonaffiliatedata.appspot.com",
  messagingSenderId: "228063504995",
  appId: "1:228063504995:web:7a79f177e8de39e202a656"
};

// Config Firebase do projeto 2
const firebaseConfig2 = {
  apiKey: "AIzaSyDY4ripKlTwQ8n7gsabBibq5e6Mtlei9EU",
  authDomain: "youneedthistool-93178.firebaseapp.com",
  projectId: "youneedthistool-93178",
  storageBucket: "youneedthistool-93178.appspot.com",
  messagingSenderId: "844231154258",
  appId: "1:844231154258:web:5fef186c9ebd3adcec9d8b",
  measurementId: "G-9FG1PV7TX4"
};

// Inicializa apps distintos com nomes únicos
const app1 = initializeApp(firebaseConfig1, "project1");
const app2 = initializeApp(firebaseConfig2, "project2");

// Instancia Firestore para cada app
const db1 = getFirestore(app1);
const db2 = getFirestore(app2);

// Função para coletar todos os cliques de ambos os Firestores
export async function fetchAllClicks() {
  const clicks1 = [];
  const clicks2 = [];

  const snapshot1 = await getDocs(collectionGroup(db1, "clicks"));
  snapshot1.forEach(doc => clicks1.push(doc.data()));

  const snapshot2 = await getDocs(collectionGroup(db2, "clicks"));
  snapshot2.forEach(doc => clicks2.push(doc.data()));

  // Junta os dados dos dois projetos
  const allClicks = clicks1.concat(clicks2);

  return allClicks;
}
