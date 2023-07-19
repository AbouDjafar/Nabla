// Recuperation des donnees
var ue = localStorage.getItem('unite');
var chap = localStorage.getItem('chapitre');
var indexQuestion = localStorage.getItem('question');
var q = new Array;

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
  document.addEventListener("backbutton", onBackKeyDown, false);
  // Chargement du fichier json
  var path = window.location.href.replace('jeu-qcm.html', '');
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: path+'js/data/'+ue+'.json',
    success: function(data){
      for(var i=0; i<data[chap].contenu[indexQuestion].elements.length; i++){ // affichage des pieces specifiques
        $(".panier div").append("<li class='btn piece' onclick='traitement(this)'>"+data[chap].contenu[indexQuestion].elements[i]+"</li>");
      };
      $('#question').text(data[chap].contenu[indexQuestion].question); // Affichage de l'enonce de la question
      R = data[chap].contenu[indexQuestion].reponse; // recuperation de la reponse
      nbp = data[chap].contenu[indexQuestion].elements.length;
    },
    error: function(){
      console.log("C'est le ndem!");
    }
  });
  angular.bootstrap(document, ['qcm']);
  // Typeset des elements MathJax creees dynamiquement
  setTimeout(function () {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    console.log("Typeset effectue!"); // test
  }, 1000);
  // attribution de la coouleur adequate
  setTimeout(function () {
    if(localStorage.getItem('unite')==='analyse'){
      $('#horloge, #notif, .btn, .btn-floating, .btn-large, .piece').css('background-color','#ee6e73');
      $('.reponse').css('border-color','#ee6e73');
    }else {
      $('#horloge, #notif, .btn, .btn-floating, .piece').addClass('blue');
      $('.reponse').css('border-color','blue');
    };
  }, 1100);
  document.addEventListener("backbutton", onBackKeyDown, false);
  function onBackKeyDown(){
    var p = angular.fromJson(localStorage.joueur);
    p.echec++;
    localStorage.setItem('joueur', angular.toJson(p));
    window.location = 'sous-rep.html';
  };
  setTimeout(function tuto() {
    var niv = angular.fromJson(localStorage.joueur).niveau;
    console.log("niveau: "+niv);
    if(niv < 2){
      $('#nab_msg').text("Le principe de jeu est connu de tous: celui du QCM. Choisir la réponse juste parmis celles proposées");
      $('#nab_msg').css('top','85%');
      $('#nab').css('top','35%');
      setTimeout(function () {
        $('#nab_msg').css('top','100%');
        $('#nab').css('top','100%');
        setTimeout(function () {
          $('#nab').css('display','none');
          $('#nab_msg').css('display','none');
        }, 3000);
      }, 20000);
    }
  }, 4000);
};

function onBackKeyDown(){
  window.location = 'sous-rep.html';
};

var app = angular.module("qcm", []);
//Timer
app.controller("chrono", function($scope, $timeout, $interval){
  angular.element(document).ready(function(){
    $scope.min = 0;
    $scope.sec = 0;
    $timeout(function(){
      angular.element('#horloge').css('top','0px');
    }, 4000);
    $timeout(function(){
      $interval(function(){
        $scope.sec++;
        minute(30);
      }, 1000);
      function minute(x){
        if($scope.sec == x){
          $timeout(function(){
            $scope.min++;
            $scope.sec = 0;
          }, x*1000);
        }
      }
    }, 5000);
  });
});

var R = "";
//Traitement de la reponse
var r = "";
function traitement(toi){
  r =$(toi).find("[type='math/tex; mode=display']").text().split(' ').join('');
  r = "$$"+r+"$$";
  R = R.split(' ').join('');
  console.log("R: "+R+"\n r: "+r); // test
  if(r == R){
    setTimeout(function () {
      victory();
    }, leveling());
  }else {
    lose();
  }
};

var nbp = 0;  // le nombre de pieces specifiques a la question
function scoring(){
  var tmps = $('#horloge').text();
  var m = ""; var s = "";
  var pos = 0;
  for(var i=0; i<tmps.length; i++){
    m += tmps[i];
    if(tmps[i] === ':'){
      pos = i;
      break;
    }
  };
  m = parseInt(m);
  for(var i=pos+1; i<tmps.length; i++){
    s += tmps[i];
  };
  s = parseInt(s);
  var tempo = parseInt(60*m+s);
  var score = 0;
  if(tempo < 15){
    score = 50 + nbp ;
  }else if(tempo < 30){
    score = 25 + nbp ;
  } else if(tempo < 60){
    score = 15 + nbp ;
  }else if(tempo >= 60){
    score = 10 + nbp ;
  };
  return(score);
};
var donnees = angular.fromJson(localStorage.joueur);
function lose(){
  $('#rideau').css('display', 'block');
  $('#notif').css('display', 'block');
  $('#notif').css('-webkit-animation-name', 'bond');
  $('#notif').css('-webkit-animation-duration', '0.5s');
  $('#notif').css('-webkit-animation-iteration-count', '1');
  $('#notif .corps .msg').text("Echec").css('color','red');
  $('#notif .corps .recap').append("<input type='button' value='Retour' onclick=\"window.location='sous-rep.html'\">");
  $('#notif .corps .recap').append("<input type='button' value='Réessayer' onclick='window.location=window.location.href'>");
  var t = $('#horloge').text();
  $("<p>temps mis: "+t+"<br/> score: "+0+"</p>").prependTo($('.recap'));
  donnees.echec++;
  localStorage.setItem('joueur', angular.toJson(donnees));
};

function victory(){
  $('#rideau').css('display', 'block');
  $('#notif').css('display', 'block');
  $('#notif').css('-webkit-animation-name', 'bond');
  $('#notif').css('-webkit-animation-duration', '0.5s');
  $('#notif').css('-webkit-animation-iteration-count', '1');
  $('#notif .corps .msg').text("Reussite").css('color','green');
  $("input[type='button']").css('margin','0 30% 0 30%');
  $('#notif .corps .recap').append("<input type='button' value='OK' onclick=\"window.location='sous-rep.html'\">");
  var t = $('#horloge').text();
  $("<p>temps mis: "+t+"<br/> score: "+scoring()+"</p>").prependTo($('.recap'));
  donnees.victoires++;
  donnees.scoreTotal += scoring();
  localStorage.setItem('joueur', angular.toJson(donnees));
};

function poplvl(niv){
  $('#rideau').css('display','block');
  $('#imglvl').css('display','block');
  $('#msglvl').css('display','block');
  $('#msglvl').text("Niveau "+niv+" atteint!");
  $('#imglvl').css('-webkit-animation-name','popout');
  $('#msglvl').css('-webkit-animation-name','popout');
  setTimeout(function () {
    $('#imglvl').css('display','none');
    $('#msglvl').css('display','none');
  }, 2000);
};
function leveling(){
  var x = donnees.niveau;
  var y = donnees.scoreTotal;
  var delai = 0;
  if (x === 1 && y >= 50){
    poplvl(2);
    donnees.niveau++;
    localStorage.setItem('joueur', angular.toJson(donnees));
    delai = 2200;
  };
  if (x === 2 && y >= 200){
    poplvl(3);
    donnees.niveau++;
    localStorage.setItem('joueur', angular.toJson(donnees));
    delai = 2200;
  };
  if (x === 3 && y >= 300){
    poplvl(4);
    donnees.niveau++;
    localStorage.setItem('joueur', angular.toJson(donnees));
    delai = 2200;
  };
  if (x === 4 && y >= 400){
    poplvl(5);
    donnees.niveau++;
    localStorage.setItem('joueur', angular.toJson(donnees));
    delai = 2200;
  };
  if (x === 5 && y >= 500){
    poplvl(6);
    donnees.niveau++;
    localStorage.setItem('joueur', angular.toJson(donnees));
    delai = 2200;
  };
  if (x === 6 && y >= 1000){
    poplvl(7);
    donnees.niveau++;
    localStorage.setItem('joueur', angular.toJson(donnees));
    delai = 2200;
  };
  if (x === 7 && y >= 1500){
    poplvl(8);
    donnees.niveau++;
    localStorage.setItem('joueur', angular.toJson(donnees));
    delai = 2200;
  };
  if (x === 8 && y >= 2000){
    poplvl(9);
    donnees.niveau++;
    localStorage.setItem('joueur', angular.toJson(donnees));
    delai = 2200;
  };
  if (x === 9 && y >= 3000){
    poplvl(10);
    donnees.niveau++;
    localStorage.setItem('joueur', angular.toJson(donnees));
    delai = 2200;
  };
  return(delai);
};
