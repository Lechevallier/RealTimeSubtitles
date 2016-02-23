var socket = io.connect();
		//jQuery(function($){
			
			var $chat = $('#chat');
			var $messageForm = $('#send-message');
      var data_opt=[];
			
			$messageForm.submit(function(e){
				e.preventDefault();
				socket.emit('send message',document.getElementById('interim_span').textContent);
			});
			
			socket.on('new message', function(data){
          traitementData(data);
          traitementEvent();
			});

      
     //$(chat).css('background','red').css('color','yellow');
		//});

    function traitementEvent(){

        $('select').change(function() { 
            console.log('update');
            socket.emit('set update',update());
        } );

        $(chat).fadeOut("slow",function(){
          $(this).fadeIn("slow");
        });


        
    }


    function traitementData(data){

        //parser chaque alternative dans data_parse
        var data_parse=[];
        for (var i = 0; i < data.length; ++i) {
          data_parse.push(data[i].split(" "));
        }

        //remplis data_opt avec les alternatives de chaque mot
        var max_taille = data_parse[0].length;
        for (var i = 0; i < max_taille; ++i) {
          data_opt[i]= Array();

          for (var j = 0; j < data_parse.length; ++j) {
            if (!(data_opt[i].includes(data_parse[j][i]))){
                data_opt[i].push(data_parse[j][i]);
            }
          }
        }
        console.log(data_opt);



        for (var i = 0; i < data_opt.length; ++i) {
          //On créé une selection si il y a d'autres alternatives
          if(data_opt[i].length>1){
            select = document.createElement('SELECT')
            for (var j = 0; j < data_opt[i].length; ++j) {
              var option = document.createElement('OPTION')  
              option.text = data_opt[i][j];
              option.value = j;
              select.options.add(option)
            }
            document.getElementById('chat').appendChild(select);
          }
          else{
            span = document.createElement('SPAN');
            span.innerHTML = data_opt[i][0]+" ";
            document.getElementById('chat').appendChild(span);
          }
        }
    }

     function update(){
        var text_temp = "";
        $("#chat").children().each(function(index){
            var num=0;
            if($(this).is('select')){
              num = $(this, 'option:selected').val();
            }
            text_temp += data_opt[index][num]+" ";
        });
        return text_temp;
     }
