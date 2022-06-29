'use strict'

let canvas = document.getElementById("audio_visual");

// next we create a context variable based on 2D or webGl[3D]


let ctx = canvas.getContext("2d");

// the context is very important as it is what will be used to draw shapes onto the canvas

/* the size of the canvas element can only be changed within the canvas tag in html, if it is changed in the css then the canvas would only shrink in it's height or width doing this will make the canvas automatically adjust it's internal grid to resize. */


// next we create an audio elemnt to get a song to visualize

// now we grab the audio from html

let audioElem = document.getElementById("audio_source");

// now we set up a new audio context node to allow us to connect other nodes


let audioCtx = new AudioContext();

/** we need to make the analyser node, which is very important as it will provide us the frequency data that we can visualize */

let analyser = audioCtx.createAnalyser();

analyser.fftSize = 2048;

/** now we need our audio source node, as our analyser can not work on the DOM, so we need to convert our audio element to a node to make it work */

let source = audioCtx.createMediaElementSource(audioElem);

/** next we need to connect all the nodes together so they can reach others data */

source.connect(analyser);

// this connect the music back to the default output such as the speakers.

source.connect(audioCtx.destination);

/**
 we need to create an array to store our data, the array should be unsigned-meaning it should have no negative numbers, that has a lenght of the fftSize we set earlier divied by 2
 */

 let data = new Uint8Array(analyser.frequencyBinCount);

 /**
  * Everything is now ready for use to start our render loop. Every x amount of times per second, we want to update our canvas will the new data from our audio element, so we can draw a different visual. You could do this in a setInterval, but there is a much better method.

requestAnimationFrame is a global function that takes a callback function as an argument. It will call this function usually 60 times a second, and it does it before the paint event happens. This is useful so there arnt any weird lags or artifacts that get drawn to the screen.
  */

requestAnimationFrame(loopingFunction);

/**
 * Our looping function should do a few things.

First we need to call requestAnimationFrame recursively inside our function. This is done because requestAnimationFrame only calls your callback function once. So in order to loop, we have to call it again inside.


 */

requestAnimationFrame(loopingFunction);


/**
 * next we populate our data array with sounds from our audio, by using the getByteFrequencyData on our analyser node and passing it in an array to put the data in.
 */

analyser.getByteFrequencyData(data); //passing the unit data array

function loopingFunction() {

    requestAnimationFrame(loopingFunction);
    analyser.getByteFrequencyData(data);

    draw(data);
}






function draw(data) {


    data = [...data];

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);


    let space = canvas.width / data.length;

    data.forEach((value, i) => {

        ctx.beginPath();
        ctx.moveTo(space*i, canvas.height); 
        ctx.lineTo(space*i, canvas.height-value);
        ctx.stroke();


    })

}

audioElem.onplay = ()=> {
    audioCtx.resume();
}