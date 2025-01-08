
const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=991b3bbe638c4e2083f71c4d4a5dacf2&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280"
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const movieContainer = document.querySelector(".movies-container");
const checkInput = document.querySelector("#check");
const textArea = document.querySelector("textarea");
const labelText = document.querySelector(".enable-search label");
const speakBtn = document.querySelector("#mic");


checkInput.addEventListener("change",(e) => {
     if(checkInput.checked){
          textArea.removeAttribute("disabled")
          textArea.setAttribute("placeholder","Enter your movie name?")
          labelText.innerHTML = "Disable Search"
          speakBtn.disabled = true;
     }
     else{
          textArea.setAttribute("disabled","")
          textArea.setAttribute("placeholder","Click to Speak button!")
          labelText.innerHTML = "Enable Search"
          speakBtn.disabled = false;
          textArea.value = ""
          renderMovies(APIURL)
     }
})

textArea.addEventListener("keyup",(e) => {
     if(textArea.value.length){
          renderMovies(SEARCHAPI + textArea.value)
     }
     else if(!textArea.value.length){
          renderMovies(APIURL)
     }
})

const renderMovies = async (URL) => {
     movieContainer.innerHTML = ""
     const res = await fetch(URL);
     const data = await res.json();
     const allMovies = data.results;
    
     allMovies.forEach((movie) => {
          const imagePath = movie.poster_path === null ? null : IMGPATH + movie.poster_path;
          movieContainer.innerHTML += `
          <div class="card">
               <div class="poster">
                    <div class="layer"></div>
                    <img src=${imagePath} alt="">
               </div>
               <div class="movie-content">
                    <h1>${movie.title}</h1>
                    <div class='imdb'>
                    <h2>${movie.vote_average.toFixed(1)}</h2>
                    <img src='star.svg'>
                    </div>
                    <h3>${movie.release_date.toLocaleString("en-IN")}</h3>
               </div>
          </div>
          `
     })
}


renderMovies(APIURL)

function voiceCapture() {
     let recognition =  new webkitSpeechRecognition();
     recognition.lang = "en-GB"
     recognition.onresult = function(event) {
          let text = document.getElementById("text-voice").value = event.results[0][0].transcript;
          let mic = new SpeechSynthesisUtterance;
          mic.text = event.results[0][0].transcript;
          mic.voice = speechSynthesis.getVoices()[1];
          
          mic.lang = "en-GB"
          speechSynthesis.speak(mic)

          setTimeout(() => {
               renderMovies(SEARCHAPI + event.results[0][0].transcript)
               text.value = ""
               document.querySelector("#text").innerHTML = `The Result of "<b>${event.results[0][0].transcript}</b>"`
          }, 500);
     }

     recognition.start()
}