import React from 'react'
import './Dashboard_AssignDriverToVehicleID.css'
import Webcam from 'react-webcam'
import { useState, useRef } from 'react'
import ProcessStageDisplay from './ProcessStageDisplay'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

function Dashboard_AssignDriverToVehicleID() {
  const webcamRef = useRef(null)
  const [driverPhotoBase64, setDriverPhotoBase64] = useState(false)
  const [driverFullName, setDriverFullName] = useState('')
  const [driverEmail, setDriverEmail] = useState('')
  const [driverContact, setDriverContact] = useState('')

  //Process Stages Array - For Process Stage Display
  const processStagesArray = [
    {
      stage: 1,
      title: `Driver's Photo`,
    },
    {
      stage: 2,
      title: `Driver's Details`,
    },
    {
      stage: 3,
      title: `Contact Verification`,
    },
  ]

  //For displaying process step number
  const [currentProcessStage, setCurrentProcessStage] = useState(1)

  //videoConstraints for <Webcam />
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  }

  const captureImage = () => {
    setDriverPhotoBase64(webcamRef.current.getScreenshot())
  }

  return (
    <div className="dashboard_AssignDriverToVehicleIDWrapper">
      <div className="sectionHeading">
        <h2>NUMPLATE ‣ New Driver</h2>
      </div>
      <ProcessStageDisplay
        processStagesArray={processStagesArray}
        currentProcessStage={currentProcessStage}
        setCurrentProcessStage={setCurrentProcessStage}
      />
      {/* Element to display for stage 1 */}
      {currentProcessStage == 1 ? (
        <div className="cameraFunctionsHolder">
          <div className="cameraContainer">
            {!driverPhotoBase64 ? (
              <>
                <Webcam
                  mirrored
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat={'image/jpeg'}
                  screenshotQuality={1}
                  height={300}
                  videoConstraints={videoConstraints}
                />
              </>
            ) : (
              <div
                className="newDriverPhotoHolder"
                style={{
                  backgroundImage: `url(${driverPhotoBase64})`,
                }}
              ></div>
            )}
          </div>
          <div className="cameraBtnsHolder">
            {!driverPhotoBase64 ? (
              <>
                <div className="btn primaryCTA" onClick={captureImage}>
                  <p>Capture</p>
                </div>

                <div className="btn secondaryCTA">
                  <p>Switch Camera</p>
                </div>
              </>
            ) : (
              <>
                <div
                  className="btn secondaryCTA"
                  onClick={() => {
                    setDriverPhotoBase64(false)
                  }}
                >
                  <p>Retake</p>
                </div>

                <div
                  className="btn primaryCTA"
                  onClick={() => {
                    setCurrentProcessStage(2)
                  }}
                >
                  <p>Done</p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Element to display for stage 2 */}
      {currentProcessStage == 2 ? (
        <>
          <div className="newDriverDetailsForm">
            <div
              className="newDriverPhotoDisplay"
              style={{
                backgroundImage: `url(${driverPhotoBase64})`,
              }}
            ></div>
            <div className="inputHolder">
              <input
                className="driverDetailsInput"
                type="text"
                placeholder="Full Name"
                value={driverFullName}
                onChange={(e) => {
                  setDriverFullName(e.target.value)
                }}
              />
              <input
                className="driverDetailsInput"
                type="text"
                placeholder="Email ID"
                value={driverEmail}
                onChange={(e) => {
                  setDriverEmail(e.target.value)
                }}
              />
              <input
                className="driverDetailsInput"
                type="text"
                placeholder="Contact"
                value={driverContact}
                onChange={(e) => {
                  setDriverContact(e.target.value)
                }}
              />
            </div>
          </div>
          {/* Display CTAs Holder */}
          <div className="CTAsHolder">
            <div className="btn secondaryCTA">
              <p>Save &amp; Skip Verification</p>
            </div>

            <div className="btn primaryCTA">
              <p>Send OTP</p>
            </div>
          </div>
        </>
      ) : null}

      {/* Element to display for stage 3 */}
      {currentProcessStage == 3 ? (
        <>
          <div className="otpInputHolder">
            <input className="otpInput" type="number" name="" id="" />
          </div>
          <div className="countdownHolder">
            <p>02:00</p>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Dashboard_AssignDriverToVehicleID
