var socket = io.connect();
  jQuery(function($){
    
    var $contenu = $('#contenu');
    var $messageForm = $('#send-message');
    
    $messageForm.submit(function(e){
      e.preventDefault();
      var tab_temp = [];
      tab_temp.push(document.getElementById('interim_span').textContent);
      socket.emit('send message',tab_temp);
    });
    
    socket.on('new message', function(data){
      var select = document.createElement('SELECT')  
      for (var i = 0; i < data.length; ++i) { 
        var option = document.createElement('OPTION')  
        option.text = data[i];
        option.value = i;
        select.options.add(option)
      }
      document.getElementById('contenu').appendChild(select);
    });

    socket.on('get update', function(data){
      console.log(data);
      myNotes = data;
      noteFirstSlide();
    });

  });