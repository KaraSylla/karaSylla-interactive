
window.onload = function(){

  var spriteRobotAnimeArret = window.document.getElementById('spriteRobotAnimeArret');
  var playerFond = window.document.getElementById('audioPlayerFond');
  var PlayerOuverturePortail = window.document.getElementById('OuverturePortail');
  var playerBoom = window.document.getElementById('playerBoomJeu');
  var playerReady = window.document.getElementById('playerReadyJeu');

  // Gestion du sprite pour l'animation du robot avant de start le jeu
  var sequenceDanimation = {
    valeurX: [
      '-5px',
      '-118px',
      '-231px',
      '-344px',
      '-457px',
      '-570px',
      '-680px',
      '-793px',
      '-907px',
      '-1019px',
      '-1131px',
      '-1244px',
      '-1356px',
      '-1469px',
      '-1581px',
      '-1694px',
      '-1807px',
      '-1920px',
      '-2031px',
      '-2144px',
      '-2257px',
      '-2369px',
      '-2482px',
      '-2595px'
   ]
 }//Fin objet gestion d'animation


 // Animation du robot lorsqu'il est à l'arrêt
 var stopAnimationRobot;

 var animationRobot = function (indexX) {

   spriteRobotAnime.style.left = sequenceDanimation.valeurX[indexX];

   stopAnimationRobot = window.setTimeout(function () {

     if (sequenceDanimation.valeurX[indexX]) {
       animationRobot(indexX + 1);
     }
     else {
       animationRobot(0);
     }
   },130);

 };




 $('nav ul li a').mouseover(function () {

  $(this).css({'opacity': '1', 'font-size': '1.4em'});

  $(this).mouseout(function () {

    $(this).css({'opacity': '0.9', 'font-size': '1.3em'});

   });

 });

  var start = function () {

    // Objet Robot
    leRobot = {

      positionLeft: 0,
      positionTop: 416,
      heightRobot: 125,
      widthRobot: 103,
      $robot: $('#robot'),
      $sprite: $('#spriteRobotDeplacement'),
      positionSprite: 0,
      positionDuRobot: "droite",
      score: 0,
      pouce:0,
      life:3,


      droite: function(){

        // inversement sprite (robot qui marche de gauche a dorite)
        if(this.positionDuRobot == "gauche"){
          this.$sprite.css({'transform': 'scaleX(1)'});
          this.positionDuRobot = "droite";
        };

        // incrémentation de 20 px à droite et délimitation droit de la zone de déplacement max pour le robot
        if(this.positionLeft < (700 - this.widthRobot)){
          this.positionLeft += 20;
          this.$robot.css({'left': this.positionLeft + "px"});
        };

        // décrémentation sprite et remise à 0 (première etat img)
        this.positionSprite -= 226;
        if(this.positionSprite <= -2712){
          this.positionSprite = 0;
        };

        // application css
        this.$sprite.css({'left': this.positionSprite + "px"});

      },

      gauche: function(){

        // inversement sprite (robot qui marche de dorite gauche)
        if(this.positionDuRobot == "droite"){
          this.$sprite.css({'transform': 'scaleX(-1)'});
          this.positionDuRobot = "gauche";
        };

        // décrémentation de -20 px à à gauche et délimitation gauche de la zone de déplacement max pour le robot
        if(this.positionLeft > 0){
          this.positionLeft -= 20;
          this.$robot.css({'left': this.positionLeft + "px"});
        };

        // incrémentation sprite et remise à -2712 (dernière etat img)
        this.positionSprite += 226;
        if(this.positionSprite >= 0){
          this.positionSprite = -2712;
        };

        // application css
        this.$sprite.css({'left': this.positionSprite + "px"});

      },

      // remise à 0 sprite au relachement de la touche clavier
      resetSprite: function(){

        if(this.positionDuRobot == "droite"){
          this.$sprite.css({'left': '0px'});
        }else{
          this.$sprite.css({'left': '-2712px'});
        };

      }

    }; // Fin de l'objet



    // Gestion touche sur clavier (execution méthode de l'objet leRobot)
    window.onkeydown = function(event){

      var code = event.keyCode;

      switch(code){

        case 39:
          leRobot.droite();
        break;

        case 37:
          leRobot.gauche();
        break;
        case 70:
          on = false;
        break;

      };

    };// Fin Gestion touche sur clavier

    window.onkeyup = function(){
      leRobot.resetSprite();
    };


    // Fonction constructeur d'objets
    var constructeurObjects = function(elementHTML, speed, aleatoireLeft, type, id){

      this.elementHTML = elementHTML;  // objet descendant en axe Y
      this.speed = speed;  // vitesse de déplacement de mes objets
      this.positionLeft = aleatoireLeft;  // position aleatoire des objets en x
      this.positionTop = -50;  // position à -50 des objets
      this.typeObj = type;    // connaitre le type de l'objet
      this.choc  = false;  // savoir si y'a déjà eu collision avec le robot
      this.widthObj = 50;  // largeur de l'élement
      this.heightObj= 50;  // hauteur de l'élément
      this.uniqueId = id;  // index de mon tableau

      this.move = function(){

        // incrémentation elements ennemies/amis, axe Y
        this.positionTop += this.speed;
        this.elementHTML.css({'top': this.positionTop + "px"});

        // that permet de récupérer la référence à l'objet
        var that = this;

        // condition lorsque les objets touchent le sol ils disparaissent sinon la fonction est éxecuté (boucle)
        if(this.positionTop > 490){
          this.deleteObject();
        }else{
          window.setTimeout(function(){
            that.move();
          }, 100);
        };
      };
      // gestion des scores / affichage des compétences / affichage des pouces / disparition des pouces
      this.collected = function(){
        this.elementHTML.remove();
        delete lesObjets[this.uniqueId];
        if(this.typeObj == 0){
            leRobot.score++;
            leRobot.pouce++
            playerReady.play();
            playerReady.volume = 0.1;

            $('#scoreHTML').html(leRobot.score + ' Points');
            if(leRobot.pouce == 5){
              $('.pouce5').css('visibility','visible');
              $('.competence1').css('visibility','visible');
              $('.competence1 img').show();
            }
            if(leRobot.pouce == 10){
              $('.pouce4').css('visibility','visible');
              $('.competence2').css('visibility','visible');
              $('.competence2 img').show();
            }
            if(leRobot.pouce == 15){
              $('.pouce3').css('visibility','visible');
              $('.competence3').css('visibility','visible');
              $('.competence3 img').show();
            }
            if(leRobot.pouce == 20){
              $('.pouce2').css('visibility','visible');
              $('.competence4').css('visibility','visible');
              $('.competence4 img').show();
            }
            if(leRobot.pouce == 25){
              $('.pouce1').css('visibility','visible');
              $('.competence5').css('visibility','visible');
              $('.competence5 img').show();

              $('#cacheZoneDeJeu').fadeIn('slow', function () {

                $(this).css('opacity', '1');

                var $topTextGagne = $('#cacheZoneDeJeu').html('<p>VOUS AVEZ GAGNE AVEC ' + leRobot.score + ' POINTS.</p>');

                $topTextGagne.css({'padding-top' : '300px', 'padding-left' : '150px'});
                choixUser = confirm('BRAVO!!! Souhaitez vous télécharger mon cv');

                if (choixUser) {
                   window.open("./src/cv/Kara-Sylla.pdf", "_self");
                }else {
                  location.reload()
                }
              });
            }
        }if(this.typeObj == 1){
          leRobot.score--;
          leRobot.life--;
          playerBoom.play();;
          playerBoom.volume = 0.1;
          $('#scoreHTML').html(leRobot.score + ' Points');
          if(leRobot.life == 2){
            $('.life3').hide();
            $('#spriteRobotDeplacement').fadeOut('fast').fadeIn('fast');
          }
          if(leRobot.life == 1){
            $('.life2').hide();
            $('#spriteRobotDeplacement').fadeOut('fast').fadeIn('fast');
          }
          if(leRobot.life == 0){
            $('.life1').hide();

            $('#spriteRobotDeplacement').fadeOut('faste').fadeIn('fast');
            $('#cacheZoneDeJeu').fadeIn('slow', function () {

              $(this).css('opacity', '1');

              var $topTextPerdant = $('#cacheZoneDeJeu').html('<p>VOUS AVEZ PERDU AVEC ' + leRobot.score + ' POINTS.</p>');
              $topTextPerdant.css({'padding-top' : '300px', 'padding-left' : '150px'});

              choixUser = confirm('DOMMAGE!!! Souhaitez vous retenter votre chance?');

              if (choixUser) {
                location.reload();
              }else {
                window.open("./src/cv/Kara-Sylla.pdf", "_self");
              }
            });
          }

        }
      };

      // suppression des objets
      this.deleteObject = function(){
        this.elementHTML.remove();
        delete lesObjets[this.uniqueId];
      };
    }; //Fin Fonction constructeur d'objets


    // Générateurs d'objets
    var $mesObjets = $('#mesObjets');  // Div qui va recevoir les objets

    window.setInterval(function(){

      var $elementHTML = $('<div class="carrer"></div>');

      $mesObjets.append($elementHTML);


      // gestion des nombres aléatoires
      var tabSpeedAleatoire = [5,10,15,20]; //vitesse de mes objets chanferment du pas
      var speedAleatoire = tabSpeedAleatoire[Math.floor(Math.random() * 4)]; //vitesse de mes objets chanferment du pa

      var leftAleatoire = Math.floor(Math.random() * 650); //position aléatoire dans la largeur de ma zone de jeu

      var tabType = [0, 1]; // 0 représente à éviter et 1 représente à rammaser
      var typeAleatoire = tabType[Math.floor(Math.random() * 2)]; //type aléatoire bonus/malus

      // Style/ Ajout image

      if(typeAleatoire == 0){
        $elementHTML.css({'background': "url('./src/img/pouceDsJeu.png')", 'left': leftAleatoire});
      }else{
        $elementHTML.css({'background': "url('./src/img/bombe.png')", 'left': leftAleatoire});
      }

      var idObject = lesObjets.length;

      var newObjet = new constructeurObjects($elementHTML, speedAleatoire, leftAleatoire, typeAleatoire, idObject);

      newObjet.move();

      lesObjets.push(newObjet);

    }, 600);


    // Gestion des collisions et événements
    window.setInterval(function(){
      for(var i = 0; i < lesObjets.length; i++){
        if(lesObjets[i]){
          if((lesObjets[i].positionLeft >= leRobot.positionLeft + leRobot.widthRobot) || (lesObjets[i].positionLeft + lesObjets[i].widthObj <= leRobot.positionLeft) || (lesObjets[i].positionTop >= leRobot.positionTop + leRobot.heightRobot) || (lesObjets[i].positionTop + lesObjets[i].heightObj <= leRobot.positionTop)){
          }else{
            if(!lesObjets[i].choc){
              lesObjets[i].choc = true;
              lesObjets[i].collected();
            }
          };
        };
      };
    }, 50);

    var lesObjets = [];
  };

  // Lancement du site
  var lancementSite = function () {

    // lancement du son

    playerFond.play();
    playerFond.volume = 0.1;
    var booleanMusic = true;

      $('.soundBtn').click(function () {
        if(booleanMusic) {
          playerFond.pause();

          booleanMusic = false;
        }else {
          playerFond.play();

          booleanMusic = true;
        }
      });


    window.clearTimeout(stopAnimationRobot);

    //Portail de bienvenue
    $('#textePresentation').fadeToggle(2000,function () {

      //Apparition bouton
      $('#btnEnSavoirPlus').fadeToggle(1000, function () {

      });//Fin apparition bouton

    });//Fin portail de bienvenue

    //Survol entrant sur le btn
    $('#btnEnSavoirPlus').mouseover(function () {

      //Application de style sur btn
      $(this).css({'background': 'white', 'color': 'black', 'border': '4px solid brown'});

      $(this).mouseout(function () {

        $(this).css({'background': 'none', 'color': 'white', 'border': '4px solid white'});

      });

    });//Fin survol entrant/sortant sur le btn

    // Fonction click accès au contenu du site
    $('#btnEnSavoirPlus').click(function () {

      PlayerOuverturePortail.play();
      PlayerOuverturePortail.volume = 0.1;
      
      $('#accueil').slideUp(600, function () {

        $(this).css('display', 'none');


      //Execution fonction animation du robot lorsqu'il est en pause
      animationRobot();

      });

    });//Fonction click s'arrête ici

    //Jeu d'opacité sur zone de jeu
    $('#cacheZoneDeJeu').mouseover(function () {

      $(this).css({'opacity': '0.9'});

      $(this).mouseout(function () {

        $(this).css({'opacity': '0.7'});

      });

    });

    //Start du jeu
    $('#btnStart').click(function () {

      //Arrêt fonction animation du robot lorsqu'il est en pause
      clearTimeout(stopAnimationRobot);
      $(this).fadeOut('slow');

      $('#cacheZoneDeJeu').fadeOut('slow');

      window.setTimeout(function () {

        start();

      },100);

    });

  };//Fin lancement du site

  lancementSite(); //Execution lancement du site

};//Fin fonction chargement de la page
