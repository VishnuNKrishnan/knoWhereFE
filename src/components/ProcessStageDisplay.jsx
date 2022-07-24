import React from 'react'
import './ProcessStageDisplay.css'

function ProcessStageDisplay(props) {
  return (
    <div className="processStageDisplayWrapper">
      <div className="processStageDisplayHolder">
        <div className="rail"></div>

        {props.processStagesArray.map((obj, index) => {
          var cardLabel = ''
          var cardClass = ''

          //Setting Card Classes (CSS)
          if (props.currentProcessStage < obj.stage) {
            cardClass = 'pending'
          } else if (props.currentProcessStage == obj.stage) {
            cardClass = 'current'
          } else {
            cardClass = 'done'
          }

          //Setting Card Labels
          if (cardClass === 'current') {
            cardLabel = `${obj.stage} - ${obj.title}`
          } else {
            cardLabel = `${obj.stage}`
          }

          return (
            <div className="processStageCard">
              <div
                className={`processStageNumberHolder ${cardClass}`}
                onClick={() => {
                  if (props.currentProcessStage > obj.stage) {
                    props.setCurrentProcessStage(obj.stage)
                  }
                }}
              >
                <p>{cardLabel}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProcessStageDisplay
