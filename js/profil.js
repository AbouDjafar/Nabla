var app = angular.module("nabla", []);

$("<img src='css/icons/ic_arrow_back_white_48dp.png' class='waves-effect waves-light retour' onclick=\"window.location='index.html'\" />").prependTo('nav');
var data = angular.fromJson(localStorage.joueur);
app.controller('infos', function($scope){
  $scope.userName = data.nom;
  $scope.userLevel = data.niveau;
  $scope.userScore = data.scoreTotal;
  $scope.tentatives = data.victoires + data.echec;
  $scope.victories = data.victoires;
  $scope.loses = data.echec;
  $scope.ratio = parseInt(data.victoires / data.echec);
  if($scope.ratio <= 0){
    $scope.avis = "Votre niveau est franchement médiocre, des révisions intensives s'imposent et heureusement pour vous nab!a est là";
  }else if (($scope.ratio == 0) && (data.echec < data.victoires)) {
    $scope.avis = "votre niveau est passablement bien néanmons, faire un peu plus d'effort serait preferable";
  }else if($scope.ratio > 0){
    $scope.avis = "bon rythme! Continuez ainsi.";
  }
});
$("<img src='img/success.png' class='entete' />").insertBefore($('#groupe'));
$("<img src='css/icons/ic_create_white_48dp.png' class='waves-effect waves-light' onclick='modif()'/>").appendTo($('#groupe span.flow-text'));

function enreg(){
  // TAF: verif des donnees saisies
  var nom = $('#user_name').val();
  if(nom == '' || nom ==' '){
    nom = "Inconnu";
    data.nom = "Inconnu";
  }else {
    data.nom = nom;
  };
  localStorage.setItem('joueur', angular.toJson(data));
  angular.element('span.flow-text').html(nom+"<img src='css/icons/ic_create_white_48dp.png' onclick='modif()'/>");
  $('#inscription').css('z-index', '-2');
  angular.element('#inscription').css('display', 'none');
  angular.element('#rideau').css('display', 'none');
  StatusBar.hide();
  window.plugins.toast.show('modification éffectuée avec succès','short','bottom',function(bien){console.log('toast effectué: '+bien);},function(mal){console.log('toast échoué: '+mal);});
};
function modif(){
  angular.element('#rideau').css('display', 'block');
  angular.element('#inscription').css('display', 'block');
  angular.element('#inscription').css('zIndex', '30');
};

$('#user_name').on('focus', function(){
  $('#inscription').css('top','0%');
});
