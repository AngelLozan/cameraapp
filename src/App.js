import React, { useRef, useEffect, useState } from "react";


function App() {

    const videoRef = useRef(null);
    //const photoRef = useRef(null);
    let blobsRecorded = [];
    let stream = null;
    let downloadLink = '';
    let mediaRecorder;


    const [hasPhoto, setHasPhoto] = useState(false);

    const getVideo = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: true })
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        } catch (e) {

            console.log('Error in getVideo: ', e);
        }
    }

    const captureVideo = async () => {


        try {
            await getVideo();

            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorder.addEventListener('dataavailable', function(e) {
                console.log('Recorded blob: ', e.data);
                blobsRecorded.push(e.data);
            });

            mediaRecorder.addEventListener('stop', function() {
                console.log("creating video local");
                let blob = new Blob(blobsRecorded, { type: 'video/webm' });
                let videoLocal = URL.createObjectURL(blob);
                downloadLink = videoLocal;
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
            await mediaRecorder.stop();
            await setHasPhoto(true);
            console.log("Recorder stopped: ", mediaRecorder.state);
        } catch (e) {
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

    const deletePhoto = () => {
        setHasPhoto(false);
        mediaRecorder = null;
    }

    // <canvas ref={photoRef}></canvas>
    //  <button onClick={deletePhoto}>Anular</button>
    //<button onClick={takePhoto}>Tire foto</button>

    useEffect(() => {
        getVideo();
    }, [videoRef])

    return (
        <div className="App">
      <div className="camera">
      <video ref={videoRef}></video>
      <button className='start' onClick={captureVideo}>Start</button>
      <button className='stop' onClick={stopVideo}>Stop</button>
      
      
     </div>

     <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
     
     <a href="downloadLink" download="video.webm">Download Video</a>

     <button onClick={deletePhoto}>Anular</button>
     </div>

   </div>
    );
}

export default App;