import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import './ToggleSwitch.css'

function ToggleSwitch(props) {
  const [isToggled, setIsToggled] = useState(props.isToggled)
  const [switchLabel, setSwitchLabel] = useState(isToggled ? 'ON' : 'OFF')

  //Set Switch Label on toggle
  useEffect(() => {
    isToggled ? setSwitchLabel('ON') : setSwitchLabel('OFF')
  }, [isToggled])

  const toggleSwitch = () => {
    navigator.vibrate(40)
    setIsToggled(!isToggled)
  }

  return (
    <label className={`toggleSwitchHolder holder-${isToggled}`}>
      <input type="checkbox" name="" id="" onChange={toggleSwitch} />
      <span className={`toggleSwitch ${isToggled}`}>
        <span className="toggleSwitchLabel">{switchLabel}</span>
      </span>
    </label>
  )
}

export default ToggleSwitch
