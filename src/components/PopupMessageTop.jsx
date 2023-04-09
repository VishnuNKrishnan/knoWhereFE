import React, { useEffect, useState } from 'react'
import './PopupMessageTop.css'
import errorSymbol from '../uiAssets/error.svg'
import infoSymbol from '../uiAssets/info.svg'
import landmarkSymbol from '../uiAssets/landmark.svg'
import weatherOKSymbol from '../uiAssets/weatherOK.svg'
import weatherBadSymbol from '../uiAssets/weatherBad.svg'
import speedSymbol from '../uiAssets/speed.svg'
import capitalizeFirst from '../customModules/capitalizeFirst'

function PopupMessageTop(props) {

    const updateType = props.updateType ? props.updateType : 'general'
    const currentPositionBrief = props.currentPositionBrief ? props.currentPositionBrief : ''
    const currentPositionFull = props.currentPositionFull ? props.currentPositionFull : ''
    const currentWhetherHeadline = props.currentWhetherHeadline ? props.currentWhetherHeadline : ''
    const currentWhetherFull = props.currentWhetherFull ? props.currentWhetherFull : ''
    const currentHeadline = props.currentHeadline ? props.currentHeadline : ''
    const currentWeatherObject = props.currentWeatherObject ? props.currentWeatherObject : {}
    const currentText = props.currentText ? props.currentText : ''

    const [messagePopupType, setMessagePopupType] = useState('infoPopupTop') //Accepted Values: successPopupTop | infoPopupTop | errorPopupTop
    const [messageSymbol, setMessageSymbol] = useState(infoSymbol)
    const [messagePopupHeadline, setMessagePopupHeadline] = useState('')
    const [messagePopupText, setMessagePopupText] = useState('')
    const [messagePopupStatus, setMessagePopupStatus] = useState('topPopupMessageInactive')

    //Activate Popup
    const activatePopup = () => {
        setMessagePopupStatus('topPopupMessageActive')
    }

    //Deactivate Popup
    const DeactivatePopup = () => {
        setTimeout(() => { setMessagePopupStatus('topPopupMessageInactive') }, 5000)
    }

    //Update popup content when props change - ONLY CONTENT UPDATES ARE DONE HERE, NOT ACTIVATING AND DEACTIVATING THE POPUP
    useEffect(() => {
        if (updateType == 'landmarkUpdate') {
            props.setUpdateType('')
            setMessagePopupType('successPopupTop')
            setMessageSymbol(landmarkSymbol)
            setMessagePopupHeadline(`Reached ${currentPositionBrief}`)
            setMessagePopupText(`This vehicle has now reached ${currentPositionFull}.`)
        } else if (updateType == 'weatherOKUpdate') {
            props.setUpdateType('')
            setMessagePopupType('successPopupTop')
            setMessageSymbol(`http://openweathermap.org/img/w/${currentWeatherObject.icon}.png`)
            setMessagePopupHeadline(`${capitalizeFirst(currentWeatherObject.description)} in ${currentWeatherObject.location}`)

            var visibilityType = 'good'
            if (currentWeatherObject.visibility <= 1000) {
                visibilityType = 'very poor'
            } else if (currentWeatherObject.visibility > 1000 && currentWeatherObject.visibility <= 5000) {
                visibilityType = 'poor'
            }
            else if (currentWeatherObject.visibility > 5000 && currentWeatherObject.visibility <= 7500) {
                visibilityType = 'moderate'
            }
            else if (currentWeatherObject.visibility > 7500 && currentWeatherObject.visibility <= 9000) {
                visibilityType = 'good'
            } else {
                visibilityType = 'very good'
            }
            setMessagePopupText(`Visibility is ${visibilityType}, approximately ${currentWeatherObject.visibility / 1000} kms. \nWind speed is ${currentWeatherObject.windSpeed}.`)

        } else if (updateType == 'weatherBadUpdate') {
            props.setUpdateType('')
            setMessagePopupType('infoPopupTop')
            setMessageSymbol(weatherBadSymbol)
            setMessagePopupHeadline(currentWhetherHeadline)
            setMessagePopupText(currentWhetherFull)
        } else if (updateType == 'activatingLiveModeUpdate') {
            props.setUpdateType('')
            setMessagePopupType('infoPopupTop')
            setMessageSymbol(infoSymbol)
            setMessagePopupHeadline('Real Time Tracking Activated')
            setMessagePopupText('You are now viewing real time journey details for this vehicle.')
        } else if (updateType == 'deactivatingLiveModeUpdate') {
            props.setUpdateType('')
            setMessagePopupType('errorPopupTop')
            setMessageSymbol(infoSymbol)
            setMessagePopupHeadline('Real Time Tracking Deactivated')
            setMessagePopupText('Real time tracking is now disabled. You are now viewing journey history.')
        } else if (updateType == 'overspeedingAlert') {
            props.setUpdateType('')
            setMessagePopupType('errorPopupTop')
            setMessageSymbol(speedSymbol)
            setMessagePopupHeadline('Overspeeding Detected!')
            setMessagePopupText('This vehicle is currently travelling above the allowed speed limit of 120 km/h.')
        }
    }, [updateType, currentHeadline, currentText, currentPositionBrief, currentPositionFull, currentWhetherHeadline, currentWhetherFull])

    useEffect(() => {
        activatePopup()
        DeactivatePopup()
    }, [updateType, currentHeadline, currentText, currentPositionBrief, currentPositionFull, currentWhetherHeadline, currentWhetherFull])

    return (
        <div className={`popUpMessageHolder ${messagePopupStatus} ${messagePopupType}`}> {/* Allowed classes for messagePopupStatus: topPopupMessageActive OR topPopupMessageInactive ONLY*/}
            <div className="symbolHolder">
                <img src={messageSymbol} alt="" />
            </div>
            <div className="messageHolder">
                <p className="messageTitle">{messagePopupHeadline}</p>
                <p className='messageContent'>{messagePopupText}</p>
            </div>
        </div>
    )
}

export default PopupMessageTop
