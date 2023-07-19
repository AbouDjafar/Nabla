var app = angular.module("repertoire", []);

app.controller("intitule", function($scope){
  $scope.nomMenu = localStorage.getItem("unite");
});
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
  document.addEventListener("backbutton", onBackKeyDown, false);
  // Chargement du fichier json
  var path = window.location.href.replace('repertoire.html','');
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: path+'js/data/'+localStorage.getItem('unite')+'.json',
    success: function(data){
      for(var i=0; i<data.length; i++){
        $(".scrolling-wrapper").append("<div class='card center'><div class='card-image waves-effect waves-block waves-light'><img id='"+i+"' class='activator' onclick='choixChap(this)' src='img/chap.png' /></div><div class='card-content'>"+data[i].chapitre+"</div></div>");
      };
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert("status: "+jqXHR.status+"\n textstatus: "+textStatus+"\n errorThrown: "+errorThrown); // test
      console.log("C'est le ndem!");
    }
  });
};
if(localStorage.getItem('unite')==='analyse'){
  $('nav').css('background-color','#ee6e73');
}else {
  $('nav').addClass('blue');
};

function onBackKeyDown(){
  window.location = 'index.html';
};

function choixChap(index){
  var idx = $(index).attr('id'); // test --obtenir la valeur de l'index
  localStorage.setItem("chapitre", idx);
  window.location = "sous-rep.html";
};
