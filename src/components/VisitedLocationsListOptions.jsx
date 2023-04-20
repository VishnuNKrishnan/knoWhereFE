import React, { useContext } from 'react'
import './VisitedLocationsListOptions.css'
import Previous from '../uiAssets/leftArrow.svg'
import Next from '../uiAssets/rightArrow.svg'
import { UserContext } from '../userContext'
import timestampToDateStringForDisplay from '../customModules/timestampToDateStringForDisplay'
import dateStringToTimestamp from '../customModules/dateStringToTimestamp'
import getWeekDayLabel from '../customModules/getWeekDayLabel'

function VisitedLocationsListOptions() {
  const {
    isGuestTracker,
    dataFromDate,
    setDataFromDate,
    dataToDate,
    setDataToDate,
    dataFromDayLabel,
    setDataFromDayLabel,
    setDataToDayLabel,
  } = useContext(UserContext)

  return (
    <div className="optionsHolder" style={{ justifyContent: isGuestTracker ? 'center' : 'space-between' }}>
      {!isGuestTracker && <div
        className="symbol"
        onClick={() => {
          navigator.vibrate(40)
          setDataFromDate(dateStringToTimestamp(dataFromDate, 'previous'))
          setDataFromDayLabel(getWeekDayLabel(dataFromDate, 'previous'))
          setDataToDate(dateStringToTimestamp(dataToDate, 'previous'))
          setDataToDayLabel(getWeekDayLabel(dataToDate, 'previous'))
        }}
      >
        <img src={Previous} alt="Previous Date" />
      </div>}
      <div className="detailsHolderTop">
        <p className="main">{dataFromDayLabel}</p>
        <p className="sub">{timestampToDateStringForDisplay(dataFromDate)}</p>
      </div>
      {!isGuestTracker && <div
        className="symbol"
        onClick={() => {
          navigator.vibrate(40)
          setDataFromDate(dateStringToTimestamp(dataFromDate, 'next'))
          setDataFromDayLabel(getWeekDayLabel(dataFromDate, 'next'))
          setDataToDate(dateStringToTimestamp(dataToDate, 'next'))
          setDataToDayLabel(getWeekDayLabel(dataToDate, 'next'))
        }}
      >
        <img src={Next} alt="Next Date" />
      </div>}
    </div>
  )
}

export default VisitedLocationsListOptions
