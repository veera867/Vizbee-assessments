import { useState, useEffect,useRef } from "react";
import React, { createRef } from "react";
import { Row, Col, Button, Modal } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import Webcam from "react-webcam";
import { useScreenshot } from "use-react-screenshot";
import "../../App.css";
import SendAssessmentStatusAPI from "../../Apis/SendAssessmentStatusAPI";
import LoadQuestionsAPI from "../../Apis/LoadQuestionsAPI";

const Assessment = () => {
  const [timer, setTimer] = useState(60); // Set timer to 60 seconds
  const [isRecording, setIsRecording] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const ref = createRef(null);
  const [image, setImagetakeScreenshot] = useScreenshot();

  const getImage = () => {
    setImagetakeScreenshot(ref.current);
  }

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState();

  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  //const [mediaRecorder, setMediaRecorder] = useState(null);
  //const [audio, setAudio] = useState(null);
  //const [audioBlob, setAudioBlob] = useState(null);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [elapsedMin, setElapsedMin] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [flag, setFlag] = useState(false);

  const sendData = async (audio) => {
    console.log('audio : ',audio);
    try {
    //const formData = new FormData();
    //formData.append("audio", audio);
    //formData.append('audiourl', audioUrl);
    //console.log("Form Data is created : ",formData);

      //sample payload
      const payload = {
        question_id: questions[currentQuestion].QuestionID,
        question: questions[currentQuestion].Question,
        test_id: 1122,
        audio: audio,
        image: image ? image : "",
      };
      console.log(payload);

      const apiResponse = await SendAssessmentStatusAPI(payload);
      console.log(apiResponse);

      //According to the status from API
      if (apiResponse.status === 200) {
        if (apiResponse.data.d.status === 200) {
          console.log(apiResponse);
          console.log(apiResponse.data.d.Data);
        } else {
          console.log("Error!!");
        }
      } else {
        console.log("Error!!");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    // Decrement timer every second
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Clear interval when timer reaches 0
    if (timer === 0) {
      // Handle logic for when timer reaches 0
      //setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      //setTimer(60);
      //setElapsedTime(0);
      //setElapsedMin(0);
      setIsRecording(false);
      setAnimation(false);
      setTimeUp(true);
      setFlag(true);
      clearInterval(interval);
    }

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [timer]);

  // UseEffect hook to update the elapsed time every second when recording is on
  useEffect(() => {
    let intervalId;
    if (isRecording) {
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    if (elapsedTime === 60) {
      setElapsedMin((prevState) => prevState + 1);
      setElapsedTime(0);
    }

    return () => clearInterval(intervalId);
  }, [isRecording]);

  const handleRecordClick = async () => {
    setIsRecording(true);
    setAnimation(true);
    setFlag(true);
    getImage()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorder.start();
    } catch (error) {
      console.log("Error accessing media devices:", error);
    }
  };

  const handleStopClick = () => {
    setIsRecording(false);
    setAnimation(false);
    mediaRecorderRef.current.stop();
  };

  const handleDataAvailable = (event) => {
    console.log(event);
    const blobData = new Blob([event.data], { type: event.data.type });

    if (blobData.size > 0) {
      setAudioChunks((prevChunks) => [...prevChunks, blobData]);
    }
  };
  
  useEffect(()=>{
    console.log('Audio chunks : ',audioChunks);
  },[audioChunks])

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };  

  const handleNextClick = async () => {
    // Make API request to get next question and send current audio file
    // Update state with new question and reset timer
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(blob);
    console.log("blob", blob, audioUrl);
    const audioBlob = await fetch(audioUrl).then((r) => r.blob());
    const audioFile = new File([audioBlob], "answer.webm", {
      type: "audio/webm",
    });
    console.log("audioBlob", audioBlob);

    // Convert the audio Blob to a base64 string
    const base64Audio = await convertBlobToBase64(blob);
    
    //const formData = new FormData();
    //formData.append("audio", audioFile);
    //formData.append('audiourl', audioUrl);
    //console.log("Form Data is created : ",formData);
    // await sendData(audioBlob);

    //sending audio file
    //await sendData(audioFile);

    //sending base64
    await sendData(base64Audio);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setTimer(60);
    } else {
      setShowConfirmation(true);
    }
    setAudioChunks([]);
    setIsRecording(false);
    setElapsedMin(0);
    setElapsedTime(0);
    setAnimation(false);
    setTimeUp(false);
    setFlag(false);
  };

  const handleFinishClick = () => {
    setShowConfirmation(true);
    setIsRecording(false);
    setAnimation(false);
  };

  const handleConfirm = async () => {
    // Make API request to submit exam and redirect to result page
    setShowConfirmation(false);

    const blob = new Blob(audioChunks, { type: "audio/webm;codecs=opus" });
    const audioUrl = URL.createObjectURL(blob);
    await sendData(audioUrl);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleSkip = () => {
    setIsRecording(false);
    setAnimation(false);
    setElapsedMin(0);
    setElapsedTime(0);
    setAudioChunks([]);
    setFlag(false);

    if (currentQuestion < 9) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setTimer(60);
    } else {
      setShowConfirmation(true);
    }
  };

  //For initial data loading as questions
  useEffect(() => {
    async function fetchData() {
      try {
        const test_id = 1122;
        const apiResponse = await LoadQuestionsAPI(test_id);
        console.log("response", apiResponse);
        setQuestions(apiResponse.data.questions);
      } catch (err) {
        console.log(err.message);
      }
    }

    fetchData();
  }, []);

  const webcamOptions = {
    height: 180,
    width: 240,
    screenshotFormat: "image/jpeg",
    videoConstraints: {
      facingMode: "user",
    },
  };

  //console.log("questions", image);

  return (
    <>
      {/* <Button style={{ margin: "10px" }} onClick={getImage}>
        <CameraOutlined /> Take Snapshot
      </Button> */}
      {/* <img style={{textAlign:"center"}} src={image} width="320" height="280"  alt="image"/> */}
      <div className="layout-outer">
        <div className="layout-inner flexer live-assessment">
            <div className="question-wrapper">
              <div className="question-card">
                <div className="time-wrapper">
                  <p className="timer">
                    <ClockCircleOutlined className="icon-clock" /> Timer: { questions ? timer: "60"}
                  </p>
                </div>
                <div className="row-flexer">
                  <p>
                    {questions && questions[currentQuestion].QuestionID}.{" "}
                    {questions && questions[currentQuestion].Question}
                  </p>
                  {/* {questions && questions.map((item, index) => {
                  return (
                    <>
                      <p className="question-text">{`${index + 1} ${item.Question}`}</p>
                    </>
                  );
                })} */}
                </div>
                <div className="audio-animation">
                  {animation ? (
                    <div className="animation running">
                      <span className="first"></span>
                      <span className="second"></span>
                      <span className="third"></span>
                      <span className="fourth"></span>
                      <span className="fifth"></span>
                    </div>
                  ) : (
                    <div className="animation">
                      <span className="first"></span>
                      <span className="second"></span>
                      <span className="third"></span>
                      <span className="fourth"></span>
                      <span className="fifth"></span>
                    </div>
                  )}
                  <p>
                    0{elapsedMin}:{elapsedTime}
                  </p>
                </div>
              </div>
              <div className="button-wrapper">
                {isRecording ? (
                  <Button onClick={handleStopClick}>Stop</Button>
                ) : timeUp ? (
                  <Button onClick={handleRecordClick} disabled>
                    Record
                  </Button>
                ) : (
                  <Button onClick={handleRecordClick}disabled={questions ? false : true} >Record</Button>
                )}
                {isRecording ? (
                  <Button onClick={handleSkip} disabled>
                    Skip
                  </Button>
                ) : elapsedTime > 0 ? (
                  <Button onClick={handleSkip} disabled>
                    Skip
                  </Button>
                ) : (
                  <Button onClick={handleSkip} disabled={questions ? false : true}>Skip</Button>
                )}
                {!isRecording && flag ? (
                  <Button onClick={handleNextClick}>Next</Button>
                ) : (
                  <Button onClick={handleNextClick} disabled>
                    Next
                  </Button>
                )}
                <Button onClick={handleFinishClick} disabled={questions ? false : true}>Finish</Button>
              </div>
            </div>
            {/*
              <audio src={audio} controls={true}></audio>
            */}
            <Modal
              title="Confirm submission"
              open={showConfirmation}
              onOk={handleConfirm}
              onCancel={handleCancel}
            >
              <p>Are you sure you want to submit your exam?</p>
            </Modal>

          <div className="right-wrapper">
            <div ref={ref}>
              <Row>
                <Col  span={10}>               
                  <Webcam {...webcamOptions} />
                </Col>
              </Row>
              </div>
              <div className="instruction-box">
                <h3>Instructions</h3>

                <h5>
                  1. Please Precsiely to the question as data is evaluated by bot. 
                </h5>
                <h5>2. Test your audio device before starting the discussion</h5>
                <h5>3. Test Duration is 45 minutes</h5>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Assessment;