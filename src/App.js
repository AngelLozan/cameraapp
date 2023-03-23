import React, { useRef, useEffect, useState } from "react";


function App() {

    const videoRef = useRef(null);
    //const photoRef = useRef(null);
    const audioRef = useRef(null);
    let blobsRecorded = [];
    let stream = null;
    let mediaRecorder;
    let audioCtx;
   
    

    const [hasPhoto, setHasPhoto] = useState(false);
    const [link, setLink] = useState('');
    
    //const [videoProp, setVideoProp] = useState({photo: false, recordOn: false})

    const getVideo = async () => {
        try {
            //stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: true })
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
            visualize(stream);
        } catch (e) {
            alert("Cannot detect your camera for some reason, try switching ports 🤔")
            console.log('Error in getVideo: ', e);
        }
    }

    const captureVideo = async () => {

      await getVideo();

        try {
            
            
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorder.addEventListener('dataavailable', function(e) {
                console.log('Recorded blob: ', e.data);
                blobsRecorded.push(e.data);
                
            });

            mediaRecorder.addEventListener('stop', function() {
                console.log("creating video local");
                let blob = new Blob(blobsRecorded, { type: 'video/webm' });
                let videoLocal = URL.createObjectURL(blob);
                let downloadLink = videoLocal;
                setLink(downloadLink);
                

                console.log('Download link is: ', downloadLink);
            });

            mediaRecorder.start(1000);
            console.log("Recorder started: ", mediaRecorder.state);

            
        } catch (e) {
            console.log('Error in start video: ', e);
        }

    }

    const stopVideo = async () => {

        try {
            
            mediaRecorder.stop();
            setHasPhoto(true);
            console.log("Recorder stopped: ", mediaRecorder.state);
        } catch (e) {
            alert('Video not started yet 🥲')
            console.log('Error in stop method: ', e);
        } 
    }


    // const takePhoto = () => {
    //     let width = 414;
    //     let height = width / (4 / 3); // Ratio from above camera setting. 

    //     let video = videoRef.current;
    //     let photo = photoRef.current;

    //     photo.width = width;
    //     photo.height = height;

    //     let ctx = photo.getContext('2d') //Context is getting a canvas
    //     ctx.drawImage(video, 0, 0, width, height);
    //     setHasPhoto(true);
    // }

    const deletePhoto = async () => {
        setHasPhoto(false);
        mediaRecorder = null;
    }

function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {

    let canvas = audioRef.current;

    const canvasCtx = canvas.getContext("2d");

    const WIDTH = canvas.width
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;


    for(let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

    // <canvas ref={photoRef}></canvas>
    //  <button onClick={deletePhoto}>Anular</button>
    //<button onClick={takePhoto}>Tire foto</button>

    
    useEffect(() => {
        getVideo();
    }, [videoRef, audioRef])

    return (
    <div className="App">

      <div className="camera">
      <video ref={videoRef}></video>
      <button className='start' onClick={captureVideo}>Start</button>
      <button className='stop' onClick={stopVideo}>Stop</button>
      </div>

      <div style = {{ display: hasPhoto ? 'none' : 'block'}}className="blob"> </div> 


     <canvas className="visualizer" ref={audioRef} height="60px"></canvas>

     
     
     <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
     
     <a href={link} download="video.webm">Download Video</a>

     <button onClick={deletePhoto}>Anular</button>
     </div>

   </div>
    );
}

export default App;