
let currentSong=new Audio();
let songs;
let currFolder;
console.log("lets write javascript");

async function getSongs(folder) {
  
    currFolder = folder;

   let a = await fetch(`./${folder}/`);
    let response = await a.text();
 
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
     songs = [];
console.log("Folder:", folder);

for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
        let url = new URL(element.href);

        let clean = decodeURI(url.pathname).replaceAll("\\", "/");

        let fileName = clean.split("/").pop();

        songs.push(fileName);
    }
}

console.log("Songs:", songs);
    
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML=" "
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="music">
                            <div class="info">

                                <div>${song.replaceAll("%5C", " ")} </div>
                                <div>ncs</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="play">
                            </div>
                        </li>`;
    }
    // attach eventListner in each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    });
    return songs;
}
const playMusic = (track, pause=false) => {
currentSong.src =
`./${currFolder}/${encodeURIComponent(track)}`;

    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};
function toMMSS(seconds) {
    if (isNaN(seconds)|| seconds<0) {
        return "00:00";
    }
    const totalSeconds = Math.floor(seconds); // ignore decimals

    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    const mm = String(minutes).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');

    return `${mm}:${ss}`;
}
async function displayAlbum() {

    let a = await fetch("./songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cardcontainer");

    cardcontainer.innerHTML = "";

    let array = Array.from(anchors);

    for (const e of array) {
        let href = e.href.replaceAll("%5C", "/");

        if (!href.endsWith("/")) continue;

        let folder = href.split("/").slice(-2)[0];

        if (folder === "songs") continue;

        let b = await fetch(`./songs/${folder}/info.json`);

        if (!b.ok) continue;

        let data = await b.json();

        cardcontainer.innerHTML += `
        <div class="card" data-folder="${folder}">
            <div class="play">▶</div>
            <img src="./songs/${folder}/cover.jpg">
            <h2>${data.title}</h2>
            <p>${data.description}</p>
        </div>`;
    }
    

    
    // Attach listeners AFTER cards are created
    Array.from(document.querySelectorAll(".card")).forEach(card => {
        card.addEventListener("click", async () => {
            songs = await getSongs(`songs/${card.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}


async function main() {
    // get song list
  await getSongs("songs/ncs");
    playMusic(songs[0],true) 
    // disply albums
    displayAlbum()
    
    // attach event listner to play,next ,previous
    play.addEventListener("click",()=>{
        if (currentSong.paused) {
            currentSong.play();
            play.src="pause.svg"
        }
        else{
            currentSong.pause();
            play.src="play.svg"
        }
    })
// listen for timeupdate envent
currentSong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML=`${toMMSS(currentSong.currentTime)}/${toMMSS(currentSong.duration)}`
    document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration)*100 +"%";
    
}) ;

// add eventlistner to seekbar
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent =(e.offsetX/e.target.getBoundingClientRect().width)* 100;
    document.querySelector(".circle").style.left=percent +"%";
currentSong.currentTime=((currentSong.duration)*percent)/100

})
// add eventlistner for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
})

// add EventListener for close
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-125%"
})
// add event listner in previous
previous.addEventListener("click",()=>{
    console.log("previous clicked");
   let current = decodeURIComponent(currentSong.src.split("/").pop());
let index = songs.indexOf(current);
    if ((index-1)>-1) {
       playMusic(songs[index-1]) 
    }
    
    

})
// add event listner in  next
next.addEventListener("click",()=>{
    console.log("Next Cliked");
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index+1)<songs.length) {
       playMusic(songs[index+1]) 
    }
});
// add eventlistner on volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume=parseInt(e.target.value)/100
    if (currentSong.volume>0) {
        document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
    }
    
});
// add eventlisner in volume to mute
document.querySelector(".volume>img").addEventListener("click",e=>{

console.log(e.target.src);
if (e.target.src.includes("volume.svg")) {
    e.target.src=e.target.src.replace("volume.svg","mute.svg")
    currentSong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0;
}else{
    
   e.target.src= e.target.src.replace("mute.svg","volume.svg")
    currentSong.volume=.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value=10;
}


})

}
main();







