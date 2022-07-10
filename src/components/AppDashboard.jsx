import React, { useState, useContext } from 'react'
import { UserContext } from '../userContext'
import './AppDashboard.css'
import HomeLogo from '../uiAssets/home.svg'
import SettingsLogo from '../uiAssets/settings-gear.svg'
import GlobeLogo from '../uiAssets/globe.svg'
import PaymentsLogo from '../uiAssets/payments.svg'
import LogoutLogo from '../uiAssets/logout.svg'
import TrackOneLogo from '../uiAssets/aim.svg'
import UpgradeLogo from '../uiAssets/upgrade.svg'
import BG from '../uiAssets/loginScreenBG.png'
//import BG from '../uiAssets/appBG.jpeg'
import Dashboard_TrackOneContentComponent from './Dashboard_TrackOneContentComponent'
import Dashboard_WelcomeScreenComponent from './Dashboard_WelcomeScreenComponent'
import Dashboard_AddNewVehicleComponent from './Dashboard_AddNewVehicleComponent'
import Dashboard_PaymentsComponent from './Dashboard_PaymentsComponent'
import Dashboard_SelectedVehicleOptions from './Dashboard_SelectedVehicleOptions'
import Dashboard_AssignDriverToVehicleID from './Dashboard_AssignDriverToVehicleID'

function AppDashboard() {
  //Setting the context values...
  const {
    loggedInAccountId,
    setLoggedInAccountId,
    currentVehicleId,
    dashboardCurrentScreen,
    setDashboardCurrentScreen,
    dataFromDate,
    dataToDate,
    hasTravelledOnDate,
    setHasTravelledOnDate,
  } = useContext(UserContext)

  return (
    <div
      className="AppDashboardWrapper"
      style={{
        backgroundImage: `url(${BG})`,
      }}
    >
      <div className="dashboardNavBarMobile">
        <img
          src={TrackOneLogo}
          alt=""
          onClick={() => {
            setDashboardCurrentScreen('trackOne')
          }}
        />
        <img src={GlobeLogo} alt="" />
        <img src={SettingsLogo} alt="" />
        <img src={PaymentsLogo} alt="" />
        <img src={LogoutLogo} alt="" />
      </div>
      <div className="dashboardNavBarWideScreen">
        <h2 className="sectionHeading">
          <img src={HomeLogo}></img> Dashboard
        </h2>
        <div className="cardsHolder">
          <div
            className="itemCard"
            onClick={() => {
              setDashboardCurrentScreen('trackOne')
            }}
          >
            <img src={TrackOneLogo} alt="" />
            <p className="cardTitle">Track One</p>
            <p className="cardDescription">
              Live tracking and history with insights
            </p>
          </div>
          <div className="itemCard">
            <img src={GlobeLogo} alt="" />
            <p className="cardTitle">Bird's Eye</p>
            <p className="cardDescription">
              Aerial view of your fleet's positions
            </p>
          </div>
          <div className="itemCard">
            <img src={SettingsLogo} alt="" />
            <p className="cardTitle">Settings</p>
            <p className="cardDescription">
              Account details and notification settings
            </p>
          </div>
          <div
            className="itemCard"
            onClick={() => {
              setDashboardCurrentScreen('payments')
            }}
          >
            <img src={PaymentsLogo} alt="" />
            <p className="cardTitle">Payments</p>
            <p className="cardDescription">Payment history and invoices</p>
          </div>
          <div className="itemCard">
            <img src={UpgradeLogo} alt="" />
            <p className="cardTitle">Upgrade</p>
            <p className="cardDescription">Make the most out of KnoWhere!</p>
          </div>
          <div className="itemCard">
            <img src={LogoutLogo} alt="" />
            <p className="cardTitle">Log Out</p>
            <p className="cardDescription">Payment history and invoices</p>
          </div>
        </div>
      </div>
      <div className="mainContentHolder">
        {dashboardCurrentScreen == 'trackOne' ? (
          <Dashboard_TrackOneContentComponent />
        ) : null}

        {dashboardCurrentScreen == 'welcomeScreen' ? (
          <Dashboard_WelcomeScreenComponent />
        ) : null}

        {dashboardCurrentScreen == 'addNewVehicle' ? (
          <Dashboard_AddNewVehicleComponent />
        ) : null}

        {dashboardCurrentScreen == 'payments' ? (
          <Dashboard_PaymentsComponent />
        ) : null}

        {dashboardCurrentScreen == 'selectedVehicleOptions' ? (
          <Dashboard_SelectedVehicleOptions />
        ) : null}

        {dashboardCurrentScreen == 'assignDriver' ? (
          <Dashboard_AssignDriverToVehicleID />
        ) : null}
      </div>
    </div>
  )
}

export default AppDashboard
