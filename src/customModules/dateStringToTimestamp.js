function dateStringToTimestamp(dateString, requiredRelativeDay) {
  //Used to get the 1st timestamp of a particular date. dateSting must be provided in YYYY-MM-DD format
  //requiredRelativeDayValues: previous, current, next

  var returnValue

  var dateObject = new Date(dateString)
  var timestamp = dateObject.getTime()

  if (requiredRelativeDay == 'previous') {
    returnValue = timestamp - 24 * 60 * 60 * 1000
    return returnValue
  } else if (requiredRelativeDay == 'current') {
    returnValue = timestamp
    return returnValue
  } else if (requiredRelativeDay == 'next') {
    returnValue = timestamp + 24 * 60 * 60 * 1000
    return returnValue
  } else {
    console.log('Error in custom module dateStringToTimestamp.js')
    return
  }
}

export default dateStringToTimestamp
