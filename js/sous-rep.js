var chap = localStorage.getItem("chapitre"); // recuperation de l'index du chapitre

if(localStorage.getItem('unite')==='analyse'){
  $('nav').css('background-color','#ee6e73');
  $('p:last').css('color','red');
}else {
  $('p:last').addClass('blue');
  $('nav').addClass('blue');
};
var q = new Array;
var x = new Array;
var path = window.location.href.replace('sous-rep.html','');
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
  document.addEventListener("backbutton", onBackKeyDown, false);
  // Chargement du fichier json
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: path+'js/data/'+localStorage.getItem('unite')+'.json',
    success: function(data){
      for(var i=0; i<data[chap].contenu.length; i++){
        $(".scrolling-wrapper").append("<div class='card center'><div class='card-image waves-effect waves-block waves-light'><img id='"+i+"' class='activator' onclick='choixQuestion(this)' src='img/unlock.jpg' /></div><div class='card-content'><p> Question </p><p>"+data[chap].contenu[i].type+"</p></div></div>");
      };
      $('#titre').text(data[chap].chapitre); // recuperation du nom du chapitre et affichage;
      $('#titre').append("<img src='css/icons/ic_arrow_back_white_48dp.png' onclick=\"window.location='repertoire.html'\"/>");
      for(var i=0; i<data[chap].contenu.length; i++){ // recuperation de la liste des questions du chapitre pour une utilisation ulterieure
        x[i] = data[chap].contenu[i];
      }
    },
    error: function(){
      console.log("C'est le ndem!");
    }
  });
  // Chargement de angularJs apres les API de phonegap
  angular.bootstrap(document, ['sous-rep']);
};

function onBackKeyDown(){
  window.location = 'repertoire.html';
};
console.log("q: ", q); // test
console.log("x: ", x); // test

var app = angular.module("sous-rep", []);
app.controller("intitule", function($scope){
    var nc = angular.fromJson(q);
    $scope.nomChapitre = nc[0];
});

function choixQuestion(index){
  var idx = $(index).attr('id'); //obtenir la valeur de l'index
  localStorage.setItem("question", idx);
  console.log("question: "+localStorage.getItem("question")); // test
  console.log("type: "+x[idx].type); // test
  if(x[idx].type == "dnd"){
    window.location = "jeu-dnd.html";
  }
  if (x[idx].type == "qcm"){
    window.location = "jeu-qcm.html";
  }
};
