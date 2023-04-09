import React, { useContext, useState } from 'react'
import './LoginScreen.css'
import BG from '../uiAssets/loginScreenBG.png'
import Logo from '../uiAssets/knowhereLogoGrey.png'
import { UserContext } from '../userContext'
import { useEffect } from 'react'

function LoginScreen(props) {
  const { isLoggedIn, setIsLoggedIn, loggedInAccountId, setLoggedInAccountId } = useContext(UserContext)

  //Wake up BE Server
  const wakeServer = async () => {
    const options = {
      method: 'GET'
    }
    const serverResponse = await fetch(
      `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/wake`,
      //`http://192.168.0.150:3001/app/getWayPoints`,
      options,
    ).catch((err) => console.log(err))
    const serverResponseData = await serverResponse.json()
    console.log(serverResponseData)
  }

  useEffect(() => {
    wakeServer()
  }, [])

  //Form display state variables
  const [activeForm, setActiveForm] = useState('loginForm') //AcceptedValues: 1) loginForm 2) createAccountForm 3) createAccountOTPFrom 4) accountCreationSuccess 5) accountCreationFailure
  const [loginFormStyle, setLoginFormStyle] = useState('none')
  const [createAccountFormStyle, setCreateAccountFormStyle] = useState('none')
  const [createAccountOTPFormStyle, setCreateAccountOTPFormStyle] = useState('none')
  const [accountCreationSuccessModalStyle, setAccountCreationSuccessModalStyle] = useState('none')
  const [accountCreationFailureModalStyle, setAccountCreationFailureModalStyle] = useState('none')

  //Login form state variables
  const [statusMessage, setStatusMessage] = useState('') //Message to display upn failed authentication
  const [loadingClass, setLoadingClass] = useState('') //Class to be applied to primaryBtn while loading process is going on
  const [idValue, setIdValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [submitBtnText, setSubmitBtnText] = useState('LOGIN')

  //Create Account state variables
  const [createAccountStatusMessage, setCreateAccountStatusMessage] = useState('') //Message to display upon failed account creation
  const [createIdValue, setCreateIdValue] = useState('')
  const [createPasswordValue, setCreatePasswordValue] = useState('')
  const [createPhoneNumberValue, setCreatePhoneNumberValue] = useState('')
  const [createOTPValue, setCreateOTPValue] = useState('')

  //OTP State Variables
  const [requestId, setRequestId] = useState(false) //For OTP verification
  const [otp, setOtp] = useState(false) //OTP is sent as a string
  const [otpValidationMessage, setOtpValidationMessage] = useState('')
  const [createAccountOTPStatusMessage, setCreateAccountOTPStatusMessage] = useState('')
  const [createAccountOTPValue, setCreateAccountOTPValue] = useState('')
  const [createAccountOTPSubmitBtnText, setCreateAccountOTPSubmitBtnText] = useState('SUBMIT')

  //Function to call API to generate and send new OTP to phone number
  async function getOTP() {
    const data = {
      phoneNumber: createPhoneNumberValue,
      transactionName: 'new account creation', //This is displayed as is in the OTP SMS sent to the phone
    }
    console.log(data)
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }
    const serverResponse = await fetch(
      `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/getOTP`,
      //`http://192.168.0.150:3001/app/getOTP`,
      // `http://nvmservices.ddns.net:3001/app/getOTP`,
      options,
    ).catch((err) => console.log(err))
    const serverResponseData = await serverResponse.json()
    //console.log(serverResponseData)
    setRequestId(serverResponseData.requestId)
  }

  useEffect(() => {
    if (activeForm === 'loginForm') {
      setLoginFormStyle('block')
      setCreateAccountFormStyle('none')
      setCreateAccountOTPFormStyle('none')
      setAccountCreationSuccessModalStyle('none')
      setAccountCreationFailureModalStyle('none')
    } else if (activeForm === 'createAccountForm') {
      setLoginFormStyle('none')
      setCreateAccountFormStyle('block')
      setCreateAccountOTPFormStyle('none')
      setAccountCreationSuccessModalStyle('none')
      setAccountCreationFailureModalStyle('none')
    } else if (activeForm === 'createAccountOTPForm') {
      setLoginFormStyle('none')
      setCreateAccountFormStyle('none')
      setCreateAccountOTPFormStyle('block')
      setAccountCreationSuccessModalStyle('none')
      setAccountCreationFailureModalStyle('none')
    } else if (activeForm === 'accountCreationSuccess') {
      setLoginFormStyle('none')
      setCreateAccountFormStyle('none')
      setCreateAccountOTPFormStyle('none')
      setAccountCreationSuccessModalStyle('block')
      setAccountCreationFailureModalStyle('none')
    } else if (activeForm === 'accountCreationFailure') {
      setLoginFormStyle('none')
      setCreateAccountFormStyle('none')
      setCreateAccountOTPFormStyle('none')
      setAccountCreationSuccessModalStyle('none')
      setAccountCreationFailureModalStyle('block')
    }
  }, [activeForm])

  const authenticationFormHandler = async (e) => { //Login Form
    e.preventDefault()
    //ADD CODE TO VALIDATE INPUTS

    //Reject blank fields...
    if (idValue == '' || passwordValue == '') {
      setStatusMessage('Please fill in all the fields.')
      return
    }

    const callAuthenticationAPI = async () => {
      var authenticationStatus = ''

      setSubmitBtnText('Authenticating...')

      const data = { accountId: idValue, password: passwordValue }
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }

      const serverResponse = await fetch(
        `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/authenticateAccount`,
        // `http://192.168.0.150:3001/app/authenticateAccount`,
        options,
      ).catch((err) => console.log(err))
      const serverResponseData = await serverResponse.json()
      setStatusMessage(serverResponseData.message)
      //console.log(serverResponseData)

      if (serverResponseData.status == 'success') {
        setIsLoggedIn(true)
        navigator.vibrate(50)
        setLoggedInAccountId(idValue)
        setSubmitBtnText('LOGIN')
        console.log(serverResponseData.message)
      } else {
        setSubmitBtnText('LOGIN')
        navigator.vibrate(500)
        console.log(serverResponseData.message)
      }
    }
    callAuthenticationAPI()
  }

  const getAccountCreationOTP = (e) => { //OTP for account creation
    //Activate OTP Form

    //Input Validation
    if (createIdValue == '' && createPhoneNumberValue == '') {
      setCreateAccountStatusMessage('Please fill in all the fields.')
      return
    } else if (createIdValue == '') {
      setCreateAccountStatusMessage('Please provide a mail ID.')
      return
    } else if (createPhoneNumberValue == '') {
      setCreateAccountStatusMessage('Please provide a mobile number.')
      return
    }

    getOTP()
    setActiveForm('createAccountOTPForm')
  }

  const createNewAccount = async (e) => {
    e.preventDefault()

    //New Account Data to upload
    const newAccountDataToUpload = {
      emailId: createIdValue,
      mobileNumber: createPhoneNumberValue,
      accountPassword: createPasswordValue,
      requestId: requestId,
      givenOtp: createAccountOTPValue,
    }

    console.log(newAccountDataToUpload)
    const options = {
      method: 'POST',
      body: JSON.stringify(newAccountDataToUpload),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }

    const serverResponse = await fetch(
      `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/createNewAccount`,
      // `http://192.168.0.150:3001/app/createNewAccount`,
      // `http://nvmservices.ddns.net:3001/app/createNewAccount`,
      options,
    ).catch((err) => console.log(err))
    const serverResponseData = await serverResponse.json()
    console.log(serverResponseData)
    if (serverResponseData.otpValidationSuccess == true) {
      setActiveForm('accountCreationSuccess')
    } else if (serverResponseData.otpValidationSuccess == false) {
      setActiveForm('accountCreationFailure')
    }
  }

  return (
    <div
      className="loginScreenWrapper"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="leftContainer"></div>

      <div className="rightContainer">
        {/* LOGIN FORM */}
        <form
          className="formContainer"
          onSubmit={authenticationFormHandler}
          autoComplete="off"
          style={{ display: loginFormStyle }}
        >
          <h1 className="mainTitle">Login</h1>
          <p className="error">{statusMessage}&nbsp;</p>
          <label htmlFor="emailAccountIdInput">Account ID</label>
          <input
            value={idValue}
            type="number"
            name=""
            id="emailAccountIdInput"
            onChange={(e) => {
              setStatusMessage('')
              setIdValue(e.target.value)
            }}
          />
          <label htmlFor="emailAccountPasswordInput">Account Password</label>
          <input
            value={passwordValue}
            type="password"
            name=""
            id="emailAccountPasswordInput"
            onChange={(e) => {
              setStatusMessage('')
              setPasswordValue(e.target.value)
            }}
          />
          <button className={`primaryBtn ${loadingClass}`} type="submit">
            {submitBtnText}
          </button>

          <button className={`secondaryBtn ${loadingClass}`} type="button" onClick={() => { setActiveForm('createAccountForm') }}>
            Create an account
          </button>

          <div className="logoHolder">
            <img className="logo" src={Logo} alt="knoWhere" />
          </div>
        </form>

        {/* CREATE ACCOUNT FORM */}
        <form
          className="formContainer"
          onSubmit={getAccountCreationOTP}
          autoComplete="off"
          style={{ display: createAccountFormStyle }}
        >
          <h1 className="mainTitle">Create an Account</h1>
          <p className="error">{createAccountStatusMessage}&nbsp;</p>
          <label htmlFor="emailAccountIdInput">Email ID</label>
          <input
            value={createIdValue}
            type="text"
            name=""
            id="emailAccountIdInput"
            onChange={(e) => {
              setCreateAccountStatusMessage('')
              setCreateIdValue(e.target.value)
            }}
          />
          <label htmlFor="emailAccountPasswordInput">Mobile Number</label>
          <input
            value={createPhoneNumberValue}
            type="text"
            name=""
            id="emailAccountPasswordInput"
            onChange={(e) => {
              setCreateAccountStatusMessage('')
              setCreatePhoneNumberValue(e.target.value)
            }}
          />

          <button className={`primaryBtn ${loadingClass}`} type="button" onClick={getAccountCreationOTP}>
            Send OTP
          </button>

          <button className={`secondaryBtn ${loadingClass}`} type="button" onClick={() => { setActiveForm('loginForm') }}>
            Have an account? Login here.
          </button>

          <div className="logoHolder">
            <img className="logo" src={Logo} alt="knoWhere" />
          </div>
        </form>

        {/* OTP FORM */}
        <form
          className="formContainer"
          onSubmit={createNewAccount}
          autoComplete="off"
          style={{ display: createAccountOTPFormStyle }}
        >
          <h1 className="mainTitle">One Time Password</h1>
          <p className="error">{createAccountOTPStatusMessage}&nbsp;</p>
          <label htmlFor="emailAccountPasswordInput">OTP</label>
          <input
            value={createAccountOTPValue}
            type="number"
            name=""
            id="emailAccountPasswordInput"
            onChange={(e) => {
              setCreateAccountStatusMessage('')
              setCreateAccountOTPValue(e.target.value)
            }}
            style={{ textAlign: 'center', letterSpacing: '3px' }}
          />
          <button className={`primaryBtn ${loadingClass}`} type="submit">
            {createAccountOTPSubmitBtnText}
          </button>

          <button className={`secondaryBtn ${loadingClass}`} type="button" onClick={() => { setActiveForm('loginForm') }}>
            Have an account? Login here.
          </button>

          <div className="logoHolder">
            <img className="logo" src={Logo} alt="knoWhere" />
          </div>
        </form>

        {/* ACCOUNT CREATION SUCCESS MODAL */}
        <div
          className="formContainer"
          style={{ display: accountCreationSuccessModalStyle }}
        >
          <h1 className="mainTitle">Success!</h1>
          <p>Great! Your account has been created. Login now to set up your account and begin tracking.</p>
          <button className={`primaryBtn ${loadingClass}`} type="button" onClick={() => { setActiveForm('loginForm') }}>
            LOGIN
          </button>
        </div>

        {/* ACCOUNT CREATION FAILURE MODAL */}
        <div
          className="formContainer"
          style={{ display: accountCreationFailureModalStyle }}
        >
          <h1 className="mainTitle">Account Creation Failed!</h1>
          <p>Your account was not created. Please try again.</p>
          <button className={`primaryBtn ${loadingClass}`} type="button" onClick={() => { setActiveForm('createAccountForm') }}>
            TRY AGAIN
          </button>
          <button className={`secondaryBtn ${loadingClass}`} type="button" onClick={() => { setActiveForm('loginForm') }}>
            Login with different credentials
          </button>
        </div>

      </div>
    </div>
  )
}

export default LoginScreen
