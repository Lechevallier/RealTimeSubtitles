
var reco = new WebSpeechRecognition();
reco.statusText('status');
reco.statusImage('status_img');
reco.finalResults('final_span');
reco.interimResults('interim_span');
reco.continuous = true;
reco.maxAlternatives = 10;

// Handler for speech recognition results.
reco.recognition.onresult = function(event) {
  var interim_transcript = '';
  // Process all new results, both final and interim.
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      appendSelectOptions('final_span', event.results[i]);
      var tab_res = [];
      for (var i = 0; i < document.getElementById('final_span').getElementsByTagName('OPTION').length; ++i) { 
      	tab_res.push(document.getElementById('final_span').getElementsByTagName('OPTION')[i].text);
      }
      console.log(tab_res);
      socket.emit('send message', tab_res);
      $('#final_span').empty();
    } else {
      console.log(interim_transcript);
      interim_transcript += event.results[i][0].transcript;
    }
  }
  document.getElementById('interim_span').innerHTML = interim_transcript;
};

// Create a new <select> element containing an <option> for each of the
// speech_recognition_result alternatives.
// Then append this <select> element to destination_id.
function appendSelectOptions(destination_id, speech_recognition_result) {
  var select = document.createElement('SELECT')  
  for (var i = 0; i < speech_recognition_result.length; ++i) {
    var option = document.createElement('OPTION')  
    option.text = speech_recognition_result[i].transcript;
    option.value = i;
    select.options.add(option)  
  } 
  document.getElementById(destination_id).appendChild(select);
}

// Handler when user clicks microphone button.
function microphoneButton() {
  reco.lang = select_dialect.value;
  reco.toggleStartStop();
}

var create_email_on_end = false;

// Handler when speech recognition completes.
reco.onEnd = function() {
  if (create_email_on_end) {
    create_email_on_end = false;
    createEmail(reco.final_transcript);
  }
};


var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Türkçe',          ['tr-TR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['Lingua latīna',   ['la']]];

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 9;
updateCountry();
select_dialect.selectedIndex = 6;