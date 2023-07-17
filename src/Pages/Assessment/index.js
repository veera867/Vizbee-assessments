import { useState, useEffect, useRef } from "react";
import React, { createRef } from "react";
import { Layout, Row, Col, Button, Modal, message, Spin, Result, Progress } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { ClockCircleOutlined } from "@ant-design/icons";
import Webcam from "react-webcam";
import { useScreenshot } from "use-react-screenshot";

import SendAssessmentStatusAPI from "../../Apis/SendAssessmentStatusAPI";
import LoadQuestionsAPI from "../../Apis/LoadQuestionsAPI";
import FinalResultApi from '../../Apis/Assessments/finalResultApi';

import "../../App.css";

const { Header } = Layout;

const Assessment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [messageApi, contextHolder] = message.useMessage();

  const assessementCode = location.state;
  //console.log("assessementCode", assessementCode);

  const [loading, setLoading] = useState(false);
  const [hasErr, setHasErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [timer, setTimer] = useState(60); // Set timer to 60 seconds

  const [isRecording, setIsRecording] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [flag, setFlag] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [finishLoading, setFinishLoading] = useState(false);

  const ref = createRef(null);
  const [image, setImagetakeScreenshot] = useScreenshot();

  const getImage = () => {
    setImagetakeScreenshot(ref.current);
  }

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState();
  const [questionsStatus, setQuestionsStatus] = useState([]);

  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  //const [mediaRecorder, setMediaRecorder] = useState(null);
  //const [audio, setAudio] = useState(null);
  //const [audioBlob, setAudioBlob] = useState(null);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [elapsedMin, setElapsedMin] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [nextQuestionFlag, setNextQuestionFlag] = useState(false);

  //const pathName = location.pathname;
  //const scheduleId = pathName.substring(pathName.lastIndexOf('/') + 1)

  const sendData = async (audio) => {
    console.log('audio : ', audio);
    try {
      const formData = new FormData();

      formData.append("question_id", questions[currentQuestion].QuestionID)
      formData.append("question", questions[currentQuestion].Question)
      formData.append("skillName", questions[currentQuestion]?.SkillName)
      formData.append("test_id", assessementCode?.code)
  
      formData.append("audio", audio);
      formData.append("image", image)

      const apiResponse = await SendAssessmentStatusAPI(formData);
      console.log(apiResponse);

      //According to the status from API
      if (apiResponse.status === 200) {
        console.log(apiResponse);
        console.log(apiResponse.data.message);


        if (currentQuestion < questions.length - 1) {
          questionsStatus[currentQuestion].status = 'success';
          setCurrentQuestion((prevQuestion) => prevQuestion + 1);
          setTimer(60);
        } else {
          setShowConfirmation(true);
        }
        setNextQuestionFlag(false);
        setConfirmLoading(false);
        messageApi.open({
          type: 'success',
          content: 'Your response saved!',
        });

        setAudioChunks([]);
        setIsRecording(false);
        setElapsedMin(0);
        setElapsedTime(0);
        setAnimation(false);
        setTimeUp(false);
        setFlag(false);
      } else {
        console.log("Error!!");
        setNextQuestionFlag(false);
        setConfirmLoading(false);

        messageApi.open({
          type: 'error',
          content: apiResponse.message,
        });
      }
    } catch (err) {
      console.log(err.message);
      setNextQuestionFlag(false);
      setConfirmLoading(false);

      messageApi.open({
        type: 'error',
        content: err.message,
      })
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

      //This is causing error for next click saving!!
      mediaRecorderRef?.current?.stop();

      //setFlag(true);
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
    mediaRecorderRef?.current?.stop();
  };

  const handleDataAvailable = (event) => {
    console.log(event);
    const blobData = new Blob([event.data], { type: event.data.type });

    if (blobData.size > 0) {
      setAudioChunks((prevChunks) => [...prevChunks, blobData]);
    }
  };

  useEffect(() => {
    console.log('Audio chunks : ', audioChunks);
  }, [audioChunks])

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const handleNextClick = () => {
    setNextQuestionFlag(true)
  }

  const handleNextConfirmClick = async () => {
    console.log('handleNextConfirmClick invoked...');

    setIsRecording(false);
    setAnimation(false);
    mediaRecorderRef?.current?.stop();

    setConfirmLoading(true);
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(blob);
    console.log("blob", blob, audioUrl);
    const audioBlob = await fetch(audioUrl).then((r) => r.blob());
    const audioFile = new File([audioBlob], "answer.webm", {
      type: "audio/webm",
    });
    console.log("audioBlob", audioBlob);
    sendData(audioFile);
  };

  const handleFinishClick = () => {
    setShowConfirmation(true);
    setIsRecording(false);
    setAnimation(false);
  };

  const handleConfirm = async () => {
    // Make API request to submit exam and redirect to result page
    const payload = {
      scheduleId: assessementCode?.code
    }

    setFinishLoading(true);
    try {
      const apiResponse = await FinalResultApi(payload);
      console.log("apiResponse", apiResponse);
      setFinishLoading(false);
      setShowConfirmation(false);
      if (apiResponse.status === 200) {
        navigate(`/assessment/greetings/success`);
      } else {
        navigate(`/assessment/greetings/error`);
      }
    } catch (err) {
      setFinishLoading(false);
      setShowConfirmation(false);
      navigate(`/assessment/greetings:error`);
    }

    // const blob = new Blob(audioChunks, { type: "audio/webm;codecs=opus" });
    // const audioUrl = URL.createObjectURL(blob);
    // await sendData(audioUrl);
  };
  const handleNextCancelClick = () => {
    setNextQuestionFlag(false)
  }

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
    setTimeUp(false);

    if (currentQuestion < questions.length - 1) {
      questionsStatus[currentQuestion].status = 'skip';
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setTimer(60);
    } else {
      setShowConfirmation(true);
    }
  };

  useEffect(() => {
    let statusArr = [];
    questions?.map((item, index) => statusArr.push({
      id: index,
      status: ''
    }));

    setQuestionsStatus(statusArr);
  }, [questions]);

  //For initial data loading as questions
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // const test_id = 1122;
        const payload = {
          test_id:assessementCode?.code, 
          currentCompanyName:assessementCode?.currentCompanyName,         
          designation:assessementCode?.designation,         
          relavantExperince:assessementCode?.relavantExperince,         
          totalExperince:assessementCode?.totalExperince,
          noticePeriod : assessementCode?.noticePeriod,
          role: assessementCode?.role
          
        }
        const apiResponse = await LoadQuestionsAPI(payload);
        console.log("response", apiResponse);
        if (apiResponse.status === 200) {
          setQuestions(apiResponse.data.questions);
          setLoading(false);
        } else {
          messageApi.open({
            type: 'error',
            content: apiResponse.message,
          });

          setLoading(false);
          setHasErr(true);
          setErrMsg('Unable to fetch the questions, please relogin by closing this window');
        }
      } catch (err) {
        console.log(err.message);
        messageApi.open({
          type: 'error',
          content: err.message,
        });
        setLoading(false);
        setHasErr(true);
        setErrMsg('Unable to fetch the questions, please relogin by closing this window');
      }
    }

    fetchData();
  }, []);

  const webcamOptions = {
    height: 200,
    width: 300,
    screenshotFormat: "image/jpeg",
    videoConstraints: {
      facingMode: "user",
    },
  };

  return (
    <Layout>
      {contextHolder}
      <Header>
        <div className="header-wrapper">
          <div className="logo-header">
            <img alt="logo" src="/apexon-logo.jpg" />
            <h1>Apexon Assessment System</h1>
          </div>
        </div>
      </Header>
      {loading
        ? <div className='layout-outer'>
          <div className='layout-inner flexer live-assessment'>
            <Spin />
          </div>
        </div>
        : hasErr
          ? <div className='layout-outer'>
            <div className='layout-inner flexer live-assessment'>
              <Result
                status='error'
                title='Something went wrong.'
                extra={
                  <p>{errMsg}</p>
                }
              />
            </div>
          </div>
          :
          <div className="layout-outer">
            <div className="layout-inner flexer live-assessment">
              <div className="question-wrapper">
                <div className="time-wrapper">
                  <Progress
                    steps={questions?.length}
                    percent={Math.floor(((currentQuestion + 1) / questions?.length) * 100)}
                    size={[20, 5]}
                  />
                  <p className="timer">
                    <ClockCircleOutlined className="icon-clock" /> Timer: {questions ? timer : "60"}
                  </p>
                </div>
                <div className="question-card">
                  <div className="row-flexer">
                    <p>
                      {questions && questions[currentQuestion].DisplayId}.{" "}
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
                    <Button onClick={handleRecordClick} disabled={questions ? false : true} >Record</Button>
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
                confirmLoading={finishLoading}
                onCancel={handleCancel}
              >
                <p>Are you sure you want to submit your exam?</p>
              </Modal>
              <Modal
                title="Next Question"
                open={nextQuestionFlag}
                onOk={handleNextConfirmClick}
                onCancel={handleNextCancelClick}
                confirmLoading={confirmLoading}
              >
                <p>Are you sure you want to Move to next Question?</p>
              </Modal>

              <div className="right-wrapper">
                <div ref={ref}>
                  <Row>
                    <Col span={10}>
                      <Webcam {...webcamOptions} />
                    </Col>
                  </Row>
                </div>
                <div className="status-box">
                  {
                    questionsStatus.map(item =>
                      <div className={`
                      status-shower 
                      ${item.status === 'success' ? 'success' : item.status === 'skip' ? 'skip' : ''}
                    `}>
                        {item.id + 1}
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
      }
    </Layout>
  );
};

export default Assessment;