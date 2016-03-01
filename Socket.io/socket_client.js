var socket = io.connect();
var myNotes = []; //num_diapo_h, num_diapo_v, text

		//jQuery(function($){
			
			var $contenu = $('#contenu');
			var $messageForm = $('#send-message');
      var data_opt=[];

      var currentIndexH = 0;
      var currentIndexV = 0;
			
			$messageForm.submit(function(e){
				e.preventDefault();
				socket.emit('send message',document.getElementById('interim_span').textContent);
			});
			
      /* 
      reçois un tableau contenant toute les variantes de ce qui a été reconnu par Google Speech
      */
			socket.on('new message', function(data){
          data_opt=[];
          traitementData(data);
          traitementEvent();
          fillMyNotes();
          console.log('update');
          socket.emit('set update',myNotes);
			});

      /* 
      reçois un tableau contenant le n° dela slide horizontale puis verticale courante 
      */
      socket.on('get current slide', function(data){
          console.log(data);
          traitementSlide(data);
      });

      
     //$(contenu).css('background','red').css('color','yellow');
		//});
  


    /* 
    reçois un tableau contenant le n° dela slide horizontale puis verticale courante 
    envoie le texte courant à reveal, puis change les numéro de slide
    */
    function traitementSlide(data){

      //on remplis le tableau avant de changer les indices
      fillMyNotes();

      console.log('update');
      socket.emit('set update',myNotes);

      currentIndexH = data[0];
      currentIndexV = data[1];
      //$('#contenu').empty();
   
    }


    /* 
    ajoute le texte corrigé dans le tableau myNotes en fonction de la slide courante
    */
    function fillMyNotes(){

      function checkIndice(tab){
        return tab[0] == currentIndexH && tab[1] == currentIndexV;
      }
      //findIndex Returns the index of the first element in an array that pass a test
      var firstCheckIndice = myNotes.findIndex(checkIndice);
      if (myNotes.findIndex(checkIndice) != -1){
        myNotes[firstCheckIndice][2] = toText();
      }
      else{
        myNotes.push([currentIndexH,currentIndexV,toText()]);
      }

    }


    /* 
    Ajoute une fonction onChange au select afin d'actualiser côté Reveal
    */
    function traitementEvent(){

        $('select').change(function() { 
            fillMyNotes();
            console.log('update');
            console.log($('select option:selected').val())
            socket.emit('set update',myNotes);
        } );

        $(contenu).fadeOut("slow",function(){
          $(this).fadeIn("slow");
        });    

    }




    /* 
    Reçois un tableau contenant toute les variantes de ce qui a été reconnu par Google Speech
    Optimise ces données puis les affichent dans la page HTML
    */
    function traitementData(data){

        //parser chaque alternative de data dans data_parse
        data_parse = parseData(data);

        //remplis data_opt avec toutes les alternatives de chaque mot
        data_opt = optData(data_parse);

        //Affiche le contenu de data_opt dans la page HTML
        printData();
        
    }

    /*
    retourne sous forme de texte ce qui est écris dans les selects et les spans
    */
    function toText(){
      console.log(data_opt);
      var text_temp = "";
      //selectionne chaque "enfant" de contenu et lui applique une fonction (comme un for)
      $("#contenu").children().each(function(mot){
          var alter=0;
          //si l'élement est un select, on récupère le texte sélectionné du select
          if($(this).is('select')){
            alter = $(this, 'option:selected').val();
          }
          text_temp += data_opt[mot][alter]+" ";
      });
      return text_temp;
    }



    /*
    Prends en entrée un tableau et parse son contenu dans le tableau retourné
    exemple:
    Entrée : 
    ["salut ça va", "Salut ça va", "SALUT ça"]
    Sortie :
    [["salut", "ça", "va"],
    ["Salut", "ça", "va"],
    ["SALUT", "ça"]]
    */
    function parseData(data){
      var data_parse=[];
      for (var i = 0; i < data.length; ++i) {
        data_parse.push(data[i].split(" "));
      }
      return data_parse;
    }



    /*
    Remplis data_opt avec toutes les alternatives de chaque mot
    exemple:
    Entrée : 
    [["salut", "ça", "va"],
    ["Salut", "ça", "va"],
    ["SALUT", "ça"]]
    Sortie :
    [["salut","SALUT"],
    ["ça"],
    ["va"]] 
    */
    function optData(data_parse){
      //En terme de nombre de mot, on prends comme référence la première alternative, soit data_parse[0]
      var max_taille = data_parse[0].length;

      var taille_initiale = data_opt.length;
      //pour chaque mot
      for (var mot = 0; mot < max_taille; ++mot) {
        data_opt.push(Array());

        var nb_alter = data_parse.length;
        //pour chaque alternative du mot
        for (var alter = 0; alter < nb_alter; ++alter) {
          if (!(data_opt[taille_initiale+mot].includes(data_parse[alter][mot]))){
              data_opt[taille_initiale+mot].push(data_parse[alter][mot]);
          }
        }
      }
      console.log(data_opt);
      return data_opt;
    }

    /*
    Affiche le contenu de data_opt dans les balises adéquat de la page HTML
    Créer un select si il y a plusieurs alternative, un span sinon
    */
    function printData(){

      //écris le résultat dans la bonne balise h3
      var temp = '#'+currentIndexH+''+currentIndexV;
      if($(temp).length == 0){
        div = document.createElement('DIV');
        div.id = currentIndexH+""+currentIndexV;
        h3 = document.createElement('h3');
        h3.textContent = "Slide "+currentIndexH+";"+currentIndexV;
        div.appendChild(h3);
      }else{
        div = $(temp)[0];
      }

      //créer un select si il y a plusieurs alternative, un span sinon
      for (var mot = 0; mot < data_opt.length; ++mot) {
        //Si il y a plus d'une alternative, on créer un Select
        if(data_opt[mot].length>1){
          select = document.createElement('SELECT')
          for (var alter = 0; alter < data_opt[mot].length; ++alter) {
            var option = document.createElement('OPTION')  
            option.text = data_opt[mot][alter];
            option.value = alter;
            select.options.add(option);
          }
          div.appendChild(select);
        }
        else{
          span = document.createElement('SPAN');
          span.innerHTML = data_opt[mot][0]+" ";
          div.appendChild(span);
        }
        document.getElementById('contenu').appendChild(div);
      }

    }