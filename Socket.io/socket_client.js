var socket = io.connect();
		jQuery(function($){
			
			var $chat = $('#chat');
			var $messageForm = $('#send-message');
			
			$messageForm.submit(function(e){
				e.preventDefault();
				socket.emit('send message',document.getElementById('interim_span').textContent);
			});
			
			socket.on('new message', function(data){
          traitementData(data);
			});
		});

    function traitementData(data){

        //parser chaque alternative dans data_parse
        var data_parse=[];
        for (var i = 0; i < data.length; ++i) {
          data_parse.push(data[i].split(" "));
        }

        //remplis data_opt avec les alternatives de chaque mot
        var data_opt=[];
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
            var select = document.createElement('SELECT') 
            for (var j = 0; j < data_opt[i].length; ++j) {
              var option = document.createElement('OPTION')  
              option.text = data_opt[i][j];
              option.value = j;
              select.options.add(option)
            }
            document.getElementById('chat').appendChild(select);
          }
          else{
            document.getElementById('chat').innerHTML += " "+data_opt[i][0]+" ";
          }
        }


    }