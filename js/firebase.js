// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDghDoaQo77TyRJGm6goeIGr2Uh9nI4BBc",
    authDomain: "budget-app-project-c88e4.firebaseapp.com",
    projectId: "budget-app-project-c88e4",
    storageBucket: "budget-app-project-c88e4.appspot.com",
    messagingSenderId: "178345164263",
    appId: "1:178345164263:web:abed04957ffe412b709142"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });