;
jQuery(function($){    
    'use strict';
	
	 var IO = {
		 
		 init:function(){
			 IO.socket = io.connect();
			 IO.bindEvents();
		 },
		 
		 
		 bindEvents:function(){
			 //Nouvelle session d'utilisation
			IO.socket.on('connected',IO.onConnected);
		 }
		 
	var App= {
		//Attribut ici
		myRole:'',
		
		Host: {
		}
		
		Player : {
		}
		
	
	}
	
	IO.init();
    App.init();
}