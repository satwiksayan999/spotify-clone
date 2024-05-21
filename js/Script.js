console.log("hello");
let curr_song=new Audio();
let curr_folder;
let some;

async function get_songs(folder)
{
    curr_folder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    some=[];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3"))
            {
                some.push(element.href.split(`/${folder}/`)[1]);
            }
        
    }

     // to display all songs in a list 
     let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0];
     songUL.innerHTML="";
     for (const i of some) {
         songUL.innerHTML=songUL.innerHTML+ `<li> 
         
                             <img class="invert" src="image/Music.svg" alt="music">
                             <div class="info">
                                 <div> ${i}</div>
                                 <div>Harry</div>
                             </div>
                             <div class="playnow">
                                 <span>Play Now</span>
                                 <img class="invert" src="image/Play.svg" alt="play">
                             </div>
                  </li>`;
     }

     //attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        console.log(e);
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })


   return some;

}

const playmusic = (track,pause=false) =>{
    //let audio = new Audio("/Songs/" + track);
    curr_song.src=`/${curr_folder}/` + track;

    if(!pause)
        {
            curr_song.play();
            play.src="image/pause.svg";
        }

    document.querySelector(".songinfo").innerHTML=track;
    document.querySelector(".songtime").innerHTML="00:00 / 00:00" ;
}


function convertSecondsToMinutes(seconds) {
    // Ensure the input is an integer

    if(isNaN(seconds) || seconds<0)
        {
            return "00:00"
        }
    seconds = Math.floor(seconds);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayalbum(){

    let a = await fetch(`http://127.0.0.1:3000/Songs/`);
    let response = await a.text();
    console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    console.log(div);
    let anchors=div.getElementsByTagName("a");
    let cardcontainer=document.querySelector(".cardcontainer");
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if(e.href.includes("/Songs")){
            console.log(e.href.split("/").slice(-2)[0]);
            let folder = e.href.split("/").slice(-2)[0] ;
            let b= await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`) ;
            let response= await b.json();
            console.log(response);
            cardcontainer.innerHTML=cardcontainer.innerHTML + ` <div data-folder="${folder}" class="cards ">
            <div class="play">
                <svg width="38" height="38" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="100" fill="lime" />
                    <polygon points="70,55 145,100 70,145" fill="black" />
                </svg>

            </div>

            <img src="/Songs/${folder}/Cover.jpeg" alt="card">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div> `

        }
    }
     
    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("cards")).forEach(e=>{
        console.log(e);
        e.addEventListener("click",async item=>{
            some = await get_songs(`Songs/${item.currentTarget.dataset.folder}`)
            playmusic(some[0]);
        })
     })


}


async function main()
{
    // to get the list or array of all songs 
    await get_songs("Songs/cs");
    console.log(some);

    playmusic(some[0],true)

   

    // now play the first song
   // var audio = new Audio(some[0]);
    //audio.play();

    //audio.addEventListener("loadeddata", () => {
      //  console.log(audio.duration,audio.currentSrc,audio.currentTime);
        // The duration variable now holds the duration (in seconds) of the audio clip
    //  });
   
    //display all the albums on the page
    displayalbum();

    // add an event listener to play,next and previous

    play.addEventListener( "click", ()=>{
        if(curr_song.paused)
            {
                curr_song.play();
                play.src="image/pause.svg";
            }
            else
            {
            curr_song.pause();
            play.src="image/Play.svg";
            }
    })

    //listen for time update function
    curr_song.addEventListener("timeupdate" ,()=>{
        console.log(curr_song.currentTime,curr_song.duration);
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(curr_song.currentTime)}/${convertSecondsToMinutes(curr_song.duration) }` ;
        document.querySelector(".circle").style.left=(curr_song.currentTime/curr_song.duration) * 100 + "%" ;
    })

    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click" , e=>{
        console.log(e);
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".circle").style.left = percent + "%" ;
        curr_song.currentTime = ((curr_song.duration)*percent)/100;
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })

    //add an event listener for closeing the hamburger
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    //add an event listener for previous and next
     previous.addEventListener("click",()=>{
        console.log("previous clicked");
        console.log(curr_song);
        let index=some.indexOf(curr_song.src.split("/").slice(-1)[0]);
        console.log(index);
        if(index-1>=0)
            {
                playmusic(some[index-1]);
            }
     })

    // add an event listener for next
    next.addEventListener("click",()=>{
        curr_song.pause();
        console.log("next clicked");
        console.log(curr_song.src);

        let index=some.indexOf(curr_song.src.split("/").slice(-1)[0]);
        console.log(index);

        if(index+1>length)
            {
                playmusic(some[index+1]);
            }

            if(index+1>=some.length)
                {
                    playmusic(some[0]);
                }
     })

     //add an event to volume
     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e,e.target,e.target.value);
        curr_song.volume = parseInt(e.target.value)/100;
     })

     // add an event listener to mute the track
     document.querySelector(".volume > img").addEventListener("click" , e=>{
        console.log(e.target);

        if(e.target.src.includes("Volume.svg")){
            e.target.src=e.target.src.replace("Volume.svg" , "Mute.svg");
            curr_song.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("Mute.svg" , "Volume.svg");
            curr_song.volume=0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
     })

}

main();



