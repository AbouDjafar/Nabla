"use strict"
function appui(elem){
  if($(elem).parent().hasClass('sousPanier') === true){ // verification de l'emplacement de l'element
    if($('ul:empty').hasClass('reponse') === true){ // si la destination est vide
      $(elem).clone(true,true).prependTo($('ul#sortable')); // creation du clone et positionnement
      $(elem).remove(); // Suppression de l'original
    }else {
      $(elem).clone(true,true).appendTo($('ul#sortable'));
      $(elem).remove();
    }
  }else {
    console.log('il est pas dans le panier!');
    if($('p:empty').hasClass('sousPanier') === true){ // si la destination est vide
      $(elem).clone(true,true).prependTo($('ul#sortable2 p')); // creation du clone et positionnement
      $(elem).remove(); // Suppression de l'original
    }else {
      $(elem).clone(true,true).appendTo($('ul#sortable2 p'));
      $(elem).remove();
    }
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
  console.log("nbp: "+nbp); // test
  console.log("tempo: "+tempo);
  if(tempo < 45){
    score = 100 + nbp ;
  }else if(tempo < 60){
    score = 75 + nbp ;
  } else if(tempo < 120){
    score = 50 + nbp ;
  }else if(tempo >= 120){
    score = 20 + nbp ;
  };
  return(score);
};

// Recuperation des donnes de l'aiguillage
var ue = localStorage.getItem("unite");
var chap = localStorage.getItem("chapitre");
var indexQuestion = localStorage.getItem("question");

document.addEventListener('deviceready', onDeviceReady, false);
var path = window.location.href.replace('jeu-dnd.html','');
function onDeviceReady(){
  document.addEventListener("backbutton", onBackKeyDown, false);
  // attribution des couleurs en fonction de l'ue choisie
  setTimeout(function () {
    if(localStorage.getItem('unite')==='analyse'){
      $('#horloge, #notif, .btn, .btn-floating, .piece,').css('background-color','#ee6e73');
      $('.reponse').css('border-color', '#ee6e73');
    }else {
      $('#horloge, #notif, .btn, .btn-floating, .piece').addClass('blue');
      $('.reponse').css('border-color','blue');
    };
  }, 1100);
  // Chargement du fichier json
  var q = new Array;
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: path+'js/data/'+ue+'.json',
    success: function(data){
      for(var i=0; i<data[chap].contenu[indexQuestion].elements.length; i++){ // listage des pieces specifiques
        $('.panier p').append("<li class='btn piece' onclick='appui(this)'>"+data[chap].contenu[indexQuestion].elements[i]+"</li>");
      };
      $('#question').text(data[chap].contenu[indexQuestion].question); // affichage de l'enonce
      rep = data[chap].contenu[indexQuestion].reponse; // recuperation de la reponse
      nbp = data[chap].contenu[indexQuestion].elements.length;
      nbp *= 2; // specialement pour le dnd
    },
    error: function(){
      console.log("C'est le ndem!");
    }
  });
  angular.bootstrap(document, ['nabla']);
  // Pour le typage des éléments créés dynamiquement
  setTimeout(function () {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    console.log("Typeset accompli!"); // test
  // elargissement de la zone de reponse en fonction du nombre de pieces
    var l = $('li.btn.piece').length + 5;
    var t = $('li.btn.piece').css('width');
    t = t.split('px').join('');
    t = parseInt(t);
    console.log("nombre pieces: "+l); // test
    var w = t*l+'px';
    console.log("nouvelles dim des conteneurs: "+w); // test
    console.log("dim ecran: "+$(document).width()); // test
    $('.panier p').css('width', $(document).width()+'px');
    if($(document).width() <= parseInt(w)){
      $('#g1').css('min-width', w);
      $('.panier').css('width', w);
    }else {
      $('#g1').css('width', w);
      $('.panier').css('width', '100%');
    }
  }, 1000);

  setTimeout(function tuto() {
    var niv = angular.fromJson(localStorage.joueur).niveau;
    console.log("niveau: "+niv);
    if(niv < 2){
      $('#nab_msg').text("Le principe de ce jeu est très simple: appuyer sur chaque pièce dans l'ordre afin de constituer la formule vallant la réponse à la question posée. Ensuite appuyer sur le bouton avec le signe de l'oeil a l'extreme droite droite pour afficher votre formule et enfin sur le bouton avec le pouce en l'air pour valider votre réponse");
      $('#nab_msg').css('top','85%');
      $('#nab').css('top','35%');
      setTimeout(function () {
        $('#nab_msg').css('top','100%');
        $('#nab').css('top','100%');
        setTimeout(function () {
          $('#nab').css('display','none');
          $('#nab_msg').css('display','none');
        }, 3000);
      }, 25000);
    }
  }, 4000);
};

function onBackKeyDown(){
  window.location = 'sous-rep.html';
};

/* _______AngularJS_______ */
var app = angular.module("nabla", []);

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

var tmp = "";
// Fonction de traitement de la reponse
angular.element("a#checkeur").on("click", function(){
  $(document).scrollLeft(0);
  if(angular.element("ul.reponse").html() == ""){ // Lorsqu'il n'y a aucune reponse
    console.log("Vide!!!"); //test
  }else {    // Lorsqu'il y a un element de reponse
    console.log("Non vide!!"); //test
    tmp = angular.element("ul.reponse [type='math/tex; mode=display']").text();
    angular.element("ul.reponse").css("display", "none"); // Masquage l'original
    angular.element("ul.reponse").clone(true, true).insertAfter(angular.element("div#box")).text(tmp).css("border", "none");  // Creation du clone
    if(angular.element(this).hasClass("vue") == true){
      angular.element("a#validateur").css("display", "block"); // apparition du bouton de validation qui initialement absent
      angular.element(this).css("background-image", "url('css/icons/ic_visibility_off_white_36dp.png')");
      /* Debut partie MathJax (Ne pas toucher a moins de maitriser un temps soit peu l'API MathJax) */
      var QUEUE = MathJax.Hub.queue;
      var math = null, box = null;
      var HIDEBOX = function () {box.style.display = "none"};
      var SHOWBOX = function () {box.style.display = "block"};
      QUEUE.Push(function () {
        math = MathJax.Hub.getAllJax("MathOutput")[0];
        box = document.getElementById("box");
        SHOWBOX();
      });
      window.UpdateMath = function (TeX) {
        QUEUE.Push(
            HIDEBOX,
            ["resetEquationNumbers",MathJax.InputJax.TeX],
            ["Text",math,TeX],
            SHOWBOX
        );
      };
      /* Fin partie MathJax */
      var elem_id = angular.element("#sortable").text();
      UpdateMath(elem_id);
      angular.element("ul.reponse")[0].remove(); // Suppression du clone
      angular.element(this).removeClass("vue"); // Suppression de la classe vue
    }else {
      angular.element(this).css("background-image", "url('css/icons/ic_visibility_white_36dp.png')");
      angular.element("ul.reponse")[0].remove(); // Suppression du clone
      angular.element("ul.reponse").css("border", "solid green 1px");
      angular.element("a#validateur").css("display", "none");
      angular.element("div#box").css("display", "none");
      angular.element(this).addClass("vue"); // Ajout de la classe vue
      angular.element("ul.reponse").css("display", "block"); // reapparition du block des reponses
    };
  }
});

var rep = "";
// Fonction de verification de la reponse
angular.element("a#validateur").on("click", function(){
  tmp = angular.element("div#MathOutput script[type='math/tex; mode=display']").text();
  var r = tmp.split(' ').join('');
  r = "$$"+r+"$$";
  var verif = true; // verificateur
  rep = rep.split(' ').join('');
  if((rep.split('\\:').join('')) != (r.split('\\:').join(''))){
    verif = false;
  };
  if(verif == true){
    setTimeout(function () {
      victory();
    }, leveling());
  }else {
    lose();
  }
});

var donnees = angular.fromJson(localStorage.joueur);
function lose(){
  $('#rideau').css('display', 'block');
  $('#notif').css('display', 'block');
  $('#notif').css('display', 'block');
  $('#notif').css('-webkit-animation-name', 'bond');
  $('#notif').css('-webkit-animation-duration', '0.5s');
  $('#notif').css('-webkit-animation-iteration-count', '1');
  $('#notif .corps .msg').text("Echec").css('color','red');
  $('#notif .corps .recap').append("<input type='button' value='Retour' onclick=\"window.location='sous-rep.html'\">");
  $('#notif .corps .recap').append("<input type='button' value='Réessayer' onclick=\"window.location=window.location.href\">");
  var t = $('#horloge').text();
  $("<p>temps mis: "+t+"<br/> score: "+0+"</p>").prependTo($('.recap'));
  donnees.echec++;
  localStorage.setItem('joueur', angular.toJson(donnees));
};

function victory(){
  $('#rideau').css('display', 'block');
  $('#notif').css('display', 'block');
  $('#notif').css('display', 'block');
  $('#notif').css('-webkit-animation-name', 'bond');
  $('#notif').css('-webkit-animation-duration', '0.5s');
  $('#notif').css('-webkit-animation-iteration-count', '1');
  $("input[type='button']").css('margin','0 30% 0 30%');
  $('#notif .corps .msg').text("Reussite").css('color','green');
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
