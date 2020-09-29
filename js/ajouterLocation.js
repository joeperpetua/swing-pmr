var map;
var geocoder;
var marker;
var geolocation;
var res;
let sendBtn;
let poly;
let photos = [];
let photosRef = [];

function initMap() {
    let mapDiv = document.getElementById('map');
    if (mapDiv) {
        map = new google.maps.Map(mapDiv, {
            center: 
                {lat: 48.8907605, lng: 2.2439413},
                zoom: 14
            }
        );
    }
}

function show(){

    var coordonnees = document.getElementById('coordonnees').value;
    var msg = document.getElementById('msg');
    if (window.FileList && window.File) {
        for (const iterator of document.getElementById('file-selector').files) {
            photos.push(iterator);
        }
        
        console.log(photos, photos.length);
    }

    let LatLang = coordonnees.split(','); 
    console.log(LatLang);

    try {
        marker = new google.maps.Marker({
            map: map,
            position: {lat: parseFloat(LatLang[0]), lng: parseFloat(LatLang[1])}
        });

        map.panTo(marker.position);
        smoothZoom(map, 17, map.getZoom());
        sendBtn = document.getElementById('send-btn');
        sendBtn.removeAttribute('disabled');
    } catch (error) {
        msg.innerHTML = "Il y a un erreur dans les coordonnées, reesayez s'il vous plaît.";
        console.log(error);
    }

}

function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- 
    }
} 


function sendLocation(){
    var nom = document.getElementById('nom').value;
    var coordonnees = document.getElementById('coordonnees').value;
    var marque = document.getElementById('marque').value;
    var tel = document.getElementById('tel').value;
    var enPanneArray = document.getElementsByName('enPanne');
    var enPanne;

    for (let i = 0; i < enPanneArray.length; i++) {
        if (enPanneArray[i].checked) {
            enPanne = enPanneArray[i].value;
        }
    }

    console.log(nom,coordonnees,marque,tel,enPanne);

    
    if(coordonnees != ""){
        if (photos.length > 0) {
            let charged = 0;
            let list = document.getElementById('list');
            let items = [];
            for (let j = 0; j < photos.length; j++) {
                photosRef.push(`${coordonnees}--${j}`);
                items.push(`<li id="item-${j}"><p>Le téléchargement est en cours -- 0 / 100</p></li>`)
                list.innerHTML += items[j];
            }

            for (let i = 0; i < photos.length; i++) {

                getBase64(photos[i]).then(
                    data => {

                        let upload;
                        if (nom == "TEST") {
                            upload = imagesRef.child(`TEST--${i}`).putString(data, 'data_url');
                        }else{
                            upload = imagesRef.child(`${coordonnees}--${i}`).putString(data, 'data_url');
                        }
                        
                        upload.on('state_changed', function(snapshot){
                            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            document.getElementById(`item-${i}`).innerHTML = `<p>Le téléchargement est en cours -- ${Math.floor(progress)}%</p>`;
                            //console.log('Upload is ' + Math.floor(progress) + '% done');
        
                          }, 
                          //on error
                          function(error) {
                            console.log(error);
                          }, 
                          //on finish
                          function() {
                            charged++;
                            if(charged == photos.length){
                                alert("Ascenseur ajouté correctement.");
                                window.open('/index.html', '_self');
                            }
                            document.getElementById(`item-${i}`).innerHTML =  `<p>Photo ${i+1} téléchargé !</p>`;
                        });
                    }
                ).catch(error => console.log(error));
            }
        }

        if (nom != 'TEST') {
            db.collection("locations").add({
                nom: nom,
                coordonnees: coordonnees,
                marque: marque,
                telephone: tel,
                enPanne: enPanne,
                photos: photosRef
            })
            .then(function(docRef) {
                console.log("Document written successfully");
            }).catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }


    }


}

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}
