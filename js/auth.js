var provider = new firebase.auth.GoogleAuthProvider();
let session;

login = () => {
  let email = document.getElementById('email').value;
  let pass = document.getElementById('pass').value;
  firebase.auth().signInWithEmailAndPassword(email, pass).then(()=>{
      window.location.href = "index.html";
  }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
  });
}

logout = () => {
  firebase.auth().signOut().then(function() {
      window.location.href = "index.html";
    }).catch(function(error) {
      console.log(error);
    });
}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    session = true;
    render(true);
    //console.log(user);
    // ...
  } else {
    session = false;
    render(false);
    console.log('loggedout');
    console.log(provider);
  }
});

render = (isLogged) => {
  let nav = document.getElementById('nav');
  
  if (isLogged && nav) {
    renderNav(nav, true);

    if(window.location.pathname == "/login.html"){ 
       let message = document.getElementById('AlreadyLogged');      
       message.setAttribute("style", "display: block");      
    }

    if (window.location.pathname == "/ajouter-location.html") {
      let wrapper = document.getElementById('wrapper');
      if (wrapper) {
        wrapper.innerHTML = `
        <section class="container-fluid">
          <form class="container-md form" onsubmit="return false">
            
            <div class="form-group">
              <label for="person_name">Nom d'ascenseur</label>
              <input type="text" class="form-control" id="nom" aria-describedby="emailHelp">
            </div>

            <div class="form-group">
              <label for="">Coordennées</label>
              <input type="text" class="form-control" id="coordonnees" required>
              <small id="direccionHelp" class="form-text text-muted">latitude / longitude</small>
            </div>

            <div class="form-group">
                <label for="">Marque d'ascenseur</label>
                <input type="text" class="form-control" id="marque">
            </div>

            <div class="form-group">
                <label for="">Telephone de contact</label>
                <input type="text" class="form-control" id="tel">
            </div>

            <div class="form-group">
              <label for="">Photos</label>
              <input type="file" class="form-control-file" id="file-selector" multiple/>
            </div>

            <label>Est en panne ?</label>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="enPanne" value="non" checked>
                <label class="form-check-label" for="enPanne">
                    Non
                </label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="enPanne" value="oui">
                <label class="form-check-label" for="enPanne">
                    Oui
                </label>
            </div>

            

            <br>


            
          </form>
          <div class="mx-auto">
            <button type="submit" class="btn btn-primary mx-auto" onclick="show()">Montrer dans la carte</button>
            <button type="submit" class="btn btn-primary" onclick="sendLocation()" id="send-btn" disabled>Confirmer et envoyer</button>
          </div>

          <br>

          <h5 id="msg"></h5>
      </section>

      <div class="mx-auto">
          
      </div>`;
      }
    }

    if (window.location.pathname == "/ajouter-route.html") {
      let wrapper = document.getElementById('wrapper');
      if (wrapper) {
        wrapper.innerHTML = `
        <section class="container-fluid">
          <form class="container-md form" onsubmit="return false">
            
            <div class="form-group">
              <label for="person_name">Nom d'itineraire</label>
              <input type="text" class="form-control" id="nom">
            </div>

            <div class="form-group">
                <label for="">Zone</label>
                <input type="text" class="form-control" id="zone">
            </div>

            <label>Etat</label>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="etat" value="indisponible" checked>
                <label class="form-check-label" for="etat">
                  Indisponible
                </label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="etat" value="disponible">
                <label class="form-check-label" for="etat">
                  Disponible
                </label>
            </div>

            <br>

            <div class="form-group">
              <label for="favcolor">Choisir couleur de l'itineraire:</label>
              <select class="form-control" id="couleur">
                <option value="#cc0000">Rouge</option>
                <option value="#00cc00">Vert</option>
                <option value="#000000">Noir</option>
                <option value="#ff0000">Blanche</option>
              </select>
            </div>



            <br>
            
          </form>
          <div class="mx-auto">
            <button type="submit" class="btn btn-primary" onclick="sendPath()" id="send-btn">Confirmer et envoyer</button>
          </div>

          <br>

          <h5 id="msg"></h5>
      </section>

      <div class="mx-auto">
          
      </div>`;
      }
    }

  }else if(nav){
    renderNav(nav, false);
    if (window.location.pathname == "/ajouter-location.html") {
      let wrapper = document.getElementById('wrapper');
      if (wrapper) {
        wrapper.innerHTML = `
        <section class="container-fluid">
          <h1>Access interdit</h1>
        </section>`;
        document.getElementById('map').classList.add('d-none');
      } 
    }

    if(window.location.pathname == "/login.html"){ 
      let form = document.getElementById('Form');      
      form.setAttribute("style", "display: block");      
      }    

    if (window.location.pathname == "/ajouter-route.html") {
      let wrapper = document.getElementById('wrapper');
      if (wrapper) {
        wrapper.innerHTML = `
        <section class="container-fluid">
          <h1>Access interdit</h1>
        </section>`;
        document.getElementById('map').classList.add('d-none');
      } 
    }
  }
  
  
}

renderNav = (nav, render) => {

  nav.innerHTML += `
    <li class="nav-item">
      <a class="nav-link" href="apropos.html">A Propos</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="partenaires.html">Partenaires</a>
    </li>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Projets
      </a>
      <div class="dropdown-menu" aria-labelledby="navbarDropdown">
        <a class="dropdown-item" href="https://sites.google.com/view/blouse-masque-vie/" target="_blank">Blouse Masque Vie</a>
      </div>
    </li>
  `;

  if (render) {
    nav.innerHTML += `
    <li class="nav-item">
      <a class="nav-link" href="ajouter-location.html">Ajouter location</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="ajouter-route.html">Ajouter route</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" onclick="logout()">Logout</a>
    </li>`;  
  }
  
}




