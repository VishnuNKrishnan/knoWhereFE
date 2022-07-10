import React, { useState } from 'react'
import './HomeScreenBEVMap.css'
import BingMapsReact from 'bingmaps-react'
import db from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'

function HomeScreenBEVMap() {
  const [pushPin1, setPushPin1] = useState({
    center: {
      latitude: 25.057,
      longitude: 55.25939,
    },
    options: {
      title: 'Rowan Atkison',
      icon:
        'https://docs.microsoft.com/en-us/bingmaps/v8-web-control/media/bmv8-poi-custom.png',
    },
  })

  const pushPin2 = {
    center: {
      latitude: 25.219261,
      longitude: 55.280751,
    },
    options: {
      title: 'Johnny Antony',
    },
  }

  const pushPin3 = {
    center: {
      latitude: 25.080682,
      longitude: 55.382072,
    },
    options: {
      title: 'Siddique Lal',
    },
  }

  const pushPins = [pushPin1, pushPin2, pushPin3]
  return (
    <div className="BEVMapSectionWrapper">
      <BingMapsReact
        bingMapsKey={process.env.REACT_APP_BING_MAPS_API_KEY}
        pushPins={pushPins}
        mapOptions={{
          navigationBarMode: 'square',
        }}
        viewOptions={{
          center: { latitude: 25.057, longitude: 55.25939 },
          mapTypeId: 'canvasLight',
          zoom: 11,
          maxZoom: 12,
        }}
      />
    </div>
  )
}

export default HomeScreenBEVMap
