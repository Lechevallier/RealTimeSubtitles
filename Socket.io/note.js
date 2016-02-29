Reveal.initialize({showNotes: true});

var myNotes = []; //num_diapo_h, num_diapo_v, text

var num_diapo_h = 0;
var num_diapo_v = 0;
var currentIndexH = 0;
var currentIndexV = 0;

countSlide();
function countSlide(){

	var nb_diapo_v = 0;
	var size_section = $('section').length;

	for(i=0;i<size_section;i++){

		var size_subsection = $('section')[i].getElementsByTagName('section').length;

		//Si il y a des sous-sections
		if (size_subsection != 0){
			nb_diapo_v = size_subsection;
		}
		else{
			if ($('section')[i].getElementsByClassName('notes').length != 0){
				myNotes.push([num_diapo_h,num_diapo_v,"Ceci est un note à afficher à la diapo "+num_diapo_h+" "+num_diapo_v]);
			}
			//console.log("num_diapo_v = "+num_diapo_v+" num_diapo_h "+num_diapo_h+ " nb_diapo_v "+nb_diapo_v);
			//si c'est encore une sous-section
			if(nb_diapo_v > 1){
				nb_diapo_v--;
				num_diapo_v++;
			}else{
				num_diapo_h++;
				num_diapo_v = 0;
			}
		}

	}
}



Reveal.addEventListener( 'ready', function( event ) {
    // event.currentSlide, event.indexh, event.indexv
    noteFirstSlide();
});


Reveal.addEventListener( 'slidechanged', function( event ) {

	currentIndexH = event.indexh;
	currentIndexV = event.indexv;
	socket.emit('set current slide', [currentIndexH,currentIndexV]);
	//si il y une note à afficher
	//if (document.getElementsByTagName('section')[event.indexh].getElementsByClassName('notes').length != 0){
		//on cherche dans le tableau à deux dimensions le numéro de slide correspondant à la note en Q
		for(i=0;i<myNotes.length;i++){
			var num_diapo_h = myNotes[i][0];
			var num_diapo_v = myNotes[i][1];
			var textContent = myNotes[i][2];

			console.log(myNotes[i][0] +" == "+ event.indexh +" && "+ myNotes[i][1] +" == "+ event.indexv);
			if(num_diapo_h == currentIndexH){
				//si il y a des sous-diapos
					if (num_diapo_v == currentIndexV){
						console.log("i = "+i+" myNotes[i][0] = "+myNotes[i][0]+" myNotes[i][1] = "+myNotes[i][1]+" Affiche le texte "+myNotes[i][2]);
						$('.notes')[i].textContent = textContent;
					}
			}
		}
	//}
});


function noteFirstSlide(){
	var size_subsection = $('section')[0].getElementsByTagName('section').length;

	//Si il y a des sous-sections
	if (size_subsection != 0){
		if ($('section')[0].getElementsByTagName('section')[0].getElementsByClassName('notes').length != 0){
			$('.speaker-notes')[0].textContent = myNotes[0][2];
		}	
	}
	else{
		if ($('section')[0].getElementsByClassName('notes').length != 0){
			$('.speaker-notes')[0].textContent = myNotes[0][2];
		}
	}
}