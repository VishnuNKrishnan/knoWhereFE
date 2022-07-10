import React from 'react'
import './LoadingBarSlim.css'

function LoadingBarSlim(props) {
  return (
    <div className="LoadingBarSlimHolder">
      <div
        className="LoadingBarAnimated"
        style={{ display: props.display }}
      ></div>
    </div>
  )
}

export default LoadingBarSlim
