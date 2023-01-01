import React, { useContext, useState } from 'react'
import './LoginScreen.css'
import BG from '../uiAssets/loginScreenBG.png'
import Logo from '../uiAssets/knowhereLogoGrey.png'
import { UserContext } from '../userContext'

function LoginScreen(props) {
  const { isLoggedIn, setIsLoggedIn, loggedInAccountId, setLoggedInAccountId } = useContext(UserContext)

  const [statusMessage, setStatusMessage] = useState('') //Message to display upn failed authentication
  const [loadingClass, setLoadingClass] = useState('') //Class to be applied to primaryBtn while loading process is going on
  const [idValue, setIdValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [submitBtnText, setSubmitBtnText] = useState('LOGIN')

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
        <form
          className="formContainer"
          onSubmit={authenticationFormHandler}
          autoComplete="off"
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
          <div className="logoHolder">
            <img className="logo" src={Logo} alt="knoWhere" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginScreen
