var app = angular.module("nabla", []);
localStorage.setItem('sortie', false);

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
  document.addEventListener("backbutton", onBackKeyDown, false);
};
function onBackKeyDown(){ // Pour quitter l'appli
  if(localStorage.sortie === false){
    localStorage.setItem('sortie', true);
    console.log("appuiyez une seconde fois pour quitter"); // Normalement avec un toast
    window.plugins.toast.showShortBottom("appuiyez une seconde fois pour quitter");
  }else {
    if(navigator.app){
      navigator.app.exitApp();
    }else if (navigator.device){
      navigator.device.exitApp();
    }
  }
};

function aiguillage(){
  $("#rideau").css("display", "block");
  $("#aiguilleur").css("display", "block");
};

angular.element(document).ready(function(){
  if(localStorage.getItem('joueur') === null){
    angular.element('#rideau').css('display', 'block');
    angular.element('#inscription').css('display', 'block');
    angular.element('#inscription').css('z-index', '30');
  }
});

function enreg(){
  // TAF: verif des donnees saisies
  var nom = $('#user_name').val();
  $('#inscription').css('z-index', '-2');
  angular.element('#inscription').css('display', 'none');
  angular.element('#rideau').css('display', 'none');
  nouveauJoueur();
  var n = angular.fromJson(localStorage.joueur);
  n.nom = nom;
  localStorage.setItem('joueur', angular.toJson(n));
  StatusBar.hide();
};

function nouveauJoueur(){
  var data = {nom: '', niveau: 1, scoreTotal: 0, victoires: 0, echec: 0};
  localStorage.setItem('joueur', angular.toJson(data));
  console.log("nouveau joueur enregistré avec succès");
}

$('#user_name').on('focus', function(){
  $('#inscription').css('top','0%');
});
