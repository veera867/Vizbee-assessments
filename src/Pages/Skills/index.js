import React from 'react';
import { AudioRecorder,useAudioRecorder } from 'react-audio-voice-recorder';


function Skills() {

    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        console.log(blob);
        console.log(url);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        document.body.appendChild(audio);
    };    

    const recorderControls = useAudioRecorder()
    
    return (
        <div>
            <AudioRecorder 
                onRecordingComplete={(blob) => addAudioElement(blob)}
                recorderControls={recorderControls}
            />
        </div>
    )
}

export default Skills