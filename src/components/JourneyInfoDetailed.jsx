import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../userContext'
import './JourneyInfoDetailed.css'
import Previous from '../uiAssets/leftArrow.svg'
import Next from '../uiAssets/rightArrow.svg'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import CircularLoader from './loaders/CircularLoader'
import timestampToDateStringForDisplay from '../customModules/timestampToDateStringForDisplay'
import dateStringToTimestamp from '../customModules/dateStringToTimestamp'
import getWeekDayLabel from '../customModules/getWeekDayLabel'
import BrandLogo from '../uiAssets/knowhereLogoGrey.png'
import CloseLogo from '../uiAssets/close.svg'

// Chart.defaults.scale.gridLines.display = false

function JourneyInfoDetailed(props) {
  const {
    currentVehicleId,
    dataFromDate,
    dataToDate,
    detailedInfoToggleStatus,
    setDetailedInfoToggleStatus,
    setDataFromDate,
    setDataFromDayLabel,
    setDataToDate,
    setDataToDayLabel,
    dataFromDayLabel,
  } = useContext(UserContext)
  const [
    journeyInfoDetailedContainerToggleStatus,
    setJourneyInfoDetailedContainerToggleStatus,
  ] = useState('journeyInfoDetailedContainerInactive')

  //Setting Dynamic values for display
  const [captainLabel, setCaptainLabel] = useState('Captain')
  //To display the label as 'Captain' or 'Captains' based on the count of captins returned
  const [xLabelsArray, setXLabelsArray] = useState([])
  const [chartDataArray, setChartDataArray] = useState([])
  const [driverNamesArray, setDriverNamesArray] = useState(null)
  const [averageSpeed, setAverageSpeed] = useState(null)
  const [maxSpeed, setMaxSpeed] = useState(null)
  const [maxSpeedStyle, setMaxSpeedStyle] = useState({ color: '#405e02' })

  const speedChartData = {
    labels: xLabelsArray,
    datasets: [
      {
        label: 'Speed',
        data: chartDataArray,
        fill: true,
        backgroundColor: '#425f0433',
        borderColor: '#425f04',
        borderWidth: 1,
        radius: 0,
        tension: 0.3,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  useEffect(() => {
    detailedInfoToggleStatus
      ? setJourneyInfoDetailedContainerToggleStatus(
        //show card if TRUE
        'journeyInfoDetailedContainerActive',
      )
      : setJourneyInfoDetailedContainerToggleStatus(
        //hide card if FALSE
        'journeyInfoDetailedContainerInactive',
      )
  }, [detailedInfoToggleStatus])

  useEffect(() => {
    async function getDetailedJourneyInfoAndUpdateOnUI() {
      setAverageSpeed(null)
      setMaxSpeed(null)
      setDriverNamesArray(null)

      const data = {
        vehicleId: currentVehicleId,
        journeyStartDate: dataFromDate,
        journeyEndDate: dataToDate,
      }
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
        `${process.env.REACT_APP_API_SERVER_BASE_URL}/app/getDetailedJourneyInfo`,
        //`http://192.168.0.150:3001/app/getDetailedJourneyInfo`,
        options,
      ).catch((err) => console.log(err))
      const serverResponseData = await serverResponse.json()

      setDriverNamesArray(serverResponseData.driverNames)

      serverResponseData.driverNames.length > 1
        ? setCaptainLabel('Captains')
        : setCaptainLabel('Captain')

      setAverageSpeed(serverResponseData.averageSpeed)
      setMaxSpeedStyle(serverResponseData.maxRecordedSpeedComponentStyleObject)
      setMaxSpeed(serverResponseData.maxRecordedSpeed)
      setChartDataArray(serverResponseData.yAxisLabels)
      setXLabelsArray(serverResponseData.xAxisLabels)
    }
    getDetailedJourneyInfoAndUpdateOnUI()
  }, [dataFromDate, dataToDate])

  return (
    <div
      className={`journeyInfoDetailedContainer ${journeyInfoDetailedContainerToggleStatus}`}
    >
      <div className="actionsHolder">
        <img
          src={Previous}
          alt="Previous Day"
          onClick={() => {
            navigator.vibrate(40)
            setDataFromDate(dateStringToTimestamp(dataFromDate, 'previous'))
            setDataFromDayLabel(getWeekDayLabel(dataFromDate, 'previous'))
            setDataToDate(dateStringToTimestamp(dataToDate, 'previous'))
            setDataToDayLabel(getWeekDayLabel(dataToDate, 'previous'))
          }}
        />
        <div className="dayDetailsHolder">
          <p className="dayLabel">{dataFromDayLabel}</p>
          <p className="date">
            {timestampToDateStringForDisplay(dataFromDate)}
          </p>
        </div>
        <img
          src={Next}
          alt="Next Day"
          onClick={() => {
            navigator.vibrate(40)
            setDataFromDate(dateStringToTimestamp(dataFromDate, 'next'))
            setDataFromDayLabel(getWeekDayLabel(dataFromDate, 'next'))
            setDataToDate(dateStringToTimestamp(dataToDate, 'next'))
            setDataToDayLabel(getWeekDayLabel(dataToDate, 'next'))
          }}
        />
      </div>
      <div className="figuresContainer">
        <div className="brandingBar">
          <div className="brandingLogoHolder">
            <img className="brandLogo" src={BrandLogo} alt="KnoWhere Logo" />
            <span>analytics</span>
          </div>
          {/* <img className="brandLogo" src={BrandLogo} alt="KnoWhere Logo" /> */}
          <img
            className="journeyDetailsCloseBtn"
            src={CloseLogo}
            alt="Close Details"
            onClick={() => {
              setDetailedInfoToggleStatus(false)
            }}
          />
        </div>
        <div className="journeyDetailedInfoDPHolder">
          <div
            className="oneDpHolder"
            style={{
              backgroundImage: `url('${props.driverDPArray}')`,
            }}
          ></div>
          {/* <div
            className="twoThreeFourDpHolder"
            style={{
              backgroundImage: `url('data:image/jpeg;base64,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')`,
            }}
          ></div>
          <div
            className="twoThreeFourDpHolder"
            style={{
              backgroundImage: `url('https://www.filmiforest.com/img/profile_image/johny-antony.jpg')`,
            }}
          ></div>
          <div
            className="twoThreeFourDpHolder"
            style={{
              top: -10,
              position: 'relative',
              backgroundImage: `url('https://images.mubicdn.net/images/cast_member/51161/cache-242706-1501517297/image-w856.jpg?size=800x')`,
            }}
          ></div> */}
        </div>
        <div className="driverCard">
          <p className="label">{captainLabel}</p>
          {driverNamesArray === null ? (
            <CircularLoader />
          ) : (
            driverNamesArray.map((obj, index) => {
              return <p className="mainInfoSmallFont">{obj}</p>
            })
          )}
        </div>
        <div className="itemCard">
          <p className="label">Average Speed</p>
          {averageSpeed === null ? (
            <CircularLoader />
          ) : (
            <p>
              <span className="mainInfo">{averageSpeed}</span>{' '}
              <span className="unit">km/h</span>
            </p>
          )}
        </div>
        <div className="itemCard">
          <p className="label">Max. Speed</p>
          {maxSpeed === null ? (
            <CircularLoader />
          ) : (
            <p>
              <span className="mainInfo" style={maxSpeedStyle}>
                {maxSpeed}
              </span>{' '}
              <span className="unit" style={maxSpeedStyle}>
                km/h
              </span>
            </p>
          )}
        </div>
      </div>
      <div className="graphContainer">
        <Line data={speedChartData} options={options} />
      </div>
    </div>
  )
}

export default JourneyInfoDetailed
