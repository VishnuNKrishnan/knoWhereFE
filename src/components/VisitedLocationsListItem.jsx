import React, { useState } from 'react'
import './VisitedLocationsListItem.css'
import textReduce from '../customModules/textReduce'

function VisitedLocationsListItem(props) {
  return (
    <div
      className="VisitedLocationsListItemCard"
      id={`visitedLocationsListItem_${props.divId}`}
    >
      <div className="locationSymbolHolder">
        <div className="branchHolder">
          <div
            className="branch"
            style={
              props.isLastBranch ? { height: '50px' } : { height: '130px' }
            }
          ></div>
        </div>
        <div className="outerCircle"></div>
        <div className="innerCircle">
          <p>{props.time}</p>
        </div>
      </div>
      <div className="detailsHolder">
        <p className="locationName">{textReduce(props.locationName, 30)}</p>
        <p className="timeAndSubLocation">{props.subLocationName}</p>
        {/* <p className="timeAndSubLocation">{props.docId}</p> */}
      </div>
    </div>
  )
}

export default VisitedLocationsListItem
