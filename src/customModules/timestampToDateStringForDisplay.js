function timestampToDateStringForDisplay(timestampInMilliseconds) {
  var returnValue

  var dateObject = new Date(timestampInMilliseconds)
  var dateString =
    dateObject.getDate() +
    '-' +
    (dateObject.getMonth() + 1) + //Month and Day numbers start at 0
    '-' +
    dateObject.getFullYear()

  returnValue = dateString
  return returnValue
}

export default timestampToDateStringForDisplay
