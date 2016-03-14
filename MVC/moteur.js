var sio;
var SessionSocket;

exports.startSession = function(io,socket){
	sio = io;
	SessionSocket=socket;
	SessionSocket.emit('connected',{message : "un prof est connecte!"});
	
	
	//Host events
	
	//Student events
}

var currentH;
var currentV;
var BD=[];
/*
var mot = { 
	'text' : string,
	'score' : int
};

var slide = { 
	'H' = int,
	'V' = int,
	'note': [mot,mot,mot,...]
};

var BD = [slide, slide, slide,...]
*/

/* 	*****************************
	*							*
	*			CREATE			*
	*							*
	*****************************	*/


function motCREATE(text,score){
	return mot = { 
		'text' : text,
		'score' : score
	};
}

function slideCREATE(H,V,note){
	return slide = { 
		'H' : H,
		'V' : V,
		'note': note
	};
}



/* 	*****************************
	*							*
	*			GET				*
	*							*
	*****************************	*/

function SlideGET(H,V){
	for (slide in BD) {
		if(slide.H == H && slide.V == V){
			return slide;
		}
	}
	return false;
}




/* 	*****************************
	*							*
	*			ADD				*
	*							*
	*****************************	*/


function slideADDBD(slide){
	for (var i in BD) {
		if(BD[i].H == slide.H && BD[i].V == slide.V){
			BD[i].note = BD[i].note.concat(slide.note);
			return;
		}
	}
	console.log("La diapo n'existe pas encore");
	BD.push(slide);
	
}

function noteADDBD(H,V,note){
	for (i in BD) {
		if(BD[i].H == H && BD[i].V == V){
			BD[i].note = BD[i].note.concat(note);
			return;
		}
	}
	console.log("La diapo n'existe pas encore");
	BD.push(slideCREATE(H,V,note));
}

//noteADDBD(0,0,[{mot: "coucou", score: 0}]);


var noteTemp= [];
for(var i = 0; i<10;i++){
	motTemp = motCREATE("test",i);
	noteTemp.push(motTemp);
}
slideTemp = slideCREATE(1,1,noteTemp);
slideADDBD(slideTemp);
slideADDBD(slideTemp);


/*
exports.startSession = function (startIo, socket){
	io = startIo;
	SessionSocket = socket;
}
*/