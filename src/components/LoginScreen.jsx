import React, { useContext, useState } from 'react'
import './LoginScreen.css'
import BG from '../uiAssets/loginScreenBG.png'
import Logo from '../uiAssets/knowhereLogoGrey.png'
import { UserContext } from '../userContext'
import { useEffect } from 'react'

function LoginScreen(props) {
  const { isLoggedIn, setIsLoggedIn, loggedInAccountId, setLoggedInAccountId } = useContext(UserContext)

  //Form display state variables
  const [activeForm, setActiveForm] = useState('loginForm') //AcceptedValues: 1) loginForm 2) createAccountForm
  const [loginFormStyle, setLoginFormStyle] = useState('block')
  const [createAccountFormStyle, setCreateAccountFormStyle] = useState('none')

  //Login form state variables
  const [statusMessage, setStatusMessage] = useState('') //Message to display upn failed authentication
  const [loadingClass, setLoadingClass] = useState('') //Class to be applied to primaryBtn while loading process is going on
  const [idValue, setIdValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [submitBtnText, setSubmitBtnText] = useState('LOGIN')

  //Create Account state variables
  const [createAccountStatusMessage, setCreateAccountStatusMessage] = useState('') //Message to display upn failed account creation
  const [createIdValue, setCreateIdValue] = useState('')
  const [createPasswordValue, setCreatePasswordValue] = useState('')
  const [createPhoneNumberValue, setCreatePhoneNumberValue] = useState('')
  const [createOTPValue, setCreateOTPValue] = useState('')

  useEffect(() => {
    if (activeForm === 'loginForm') {
      setLoginFormStyle('block')
      setCreateAccountFormStyle('none')
    } else if (activeForm === 'createAccountForm') {
      setLoginFormStyle('none')
      setCreateAccountFormStyle('block')
    }
  }, [activeForm])

  const authenticationFormHandler = async (e) => {
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
          onSubmit={authenticationFormHandler}
          autoComplete="off"
          style={{ display: createAccountFormStyle }}
        >
          <h1 className="mainTitle">Create an Account</h1>
          <p className="error">{statusMessage}&nbsp;</p>
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
            type="number"
            name=""
            id="emailAccountPasswordInput"
            onChange={(e) => {
              setCreateAccountStatusMessage('')
              setCreatePhoneNumberValue(e.target.value)
            }}
          />
          <label htmlFor="emailAccountPasswordInput">OTP</label>
          <input
            value={createOTPValue}
            type="password"
            name=""
            id="emailAccountPasswordInput"
            onChange={(e) => {
              setCreateAccountStatusMessage('')
              setCreateOTPValue(e.target.value)
            }}
          />
          <button className={`primaryBtn ${loadingClass}`} type="submit">
            Send OTP
          </button>

          <button className={`secondaryBtn ${loadingClass}`} type="button" onClick={() => { setActiveForm('loginForm') }}>
            Have an account? Login here.
          </button>

          <div className="logoHolder">
            <img className="logo" src={Logo} alt="knoWhere" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginScreen
