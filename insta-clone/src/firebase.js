import firebase from 'firebase'
const firebaseApp=firebase.initializeApp({

    apiKey: "AIzaSyCBR0IefxtyeBm04gZUL3jATKulGyJElFk",
    authDomain: "instagram-clone-b39e6.firebaseapp.com",
    projectId: "instagram-clone-b39e6",
    storageBucket: "instagram-clone-b39e6.appspot.com",
    messagingSenderId: "968966799873",
    appId: "1:968966799873:web:531f7ef8fc8f926ab23600"
  });
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

  export{db,auth,storage} 