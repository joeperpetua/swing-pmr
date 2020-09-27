firebase.initializeApp({
    apiKey: "AIzaSyBxrObksPhyoqYDl4S-KL_WB2Fp4F4umxc",
    authDomain: "swing-pmr.firebaseapp.com",
    databaseURL: "https://swing-pmr.firebaseio.com",
    projectId: "swing-pmr",
    storageBucket: "swing-pmr.appspot.com",
    messagingSenderId: "524528803069",
    appId: "1:524528803069:web:64aa27f9013eb992c03294",
    measurementId: "G-3D4MGLNBC4"
});

var auth = firebase.auth();
var storage;
var imagesRef;
var db = firebase.firestore();
let url = window.location.pathname;
if (url != "/ajouter-route.html" && url != "/apropos.html" && url != "/login.html") {
    storage = firebase.storage();
    imagesRef = storage.ref().child('asc-photos');
}

