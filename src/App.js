import React, {useRef, useEffect, useState} from "react";


function App() {

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {width:640, height: 480} })
    .then(stream => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      console.error('Error', err);
    }); 
  }

  const takePhoto = () => {
    const width = 414;
    const height = width / (4/3); // Ratio from above camera setting. 

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d') //Context is getting a canvas
    ctx.drawImage(video, 0 ,0, width, height);
    setHasPhoto(true);
  }

  const deletePhoto = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext('2d');

    // Make sure to clear the cam 

    ctx.clearRect(0,0,photo.width, photo.height)
    setHasPhoto(false);
  }

  useEffect(() => {
    getVideo();
  }, [videoRef])

  return (
    <div className="App">
     <div className="camera">
      <video ref={videoRef}></video>
      <button onClick={takePhoto}>Tire foto</button>
     </div>
     <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
     <canvas ref={photoRef}></canvas>
     <button onClick={deletePhoto}>Anular</button>
     </div>
    </div>
  );
}

export default App;
