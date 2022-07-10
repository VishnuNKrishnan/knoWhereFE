function timestampToDateString(timestampInMilliseconds) {
  var returnValue

  var dateObject = new Date(timestampInMilliseconds)
  var dateString =
    dateObject.getFullYear() +
    '-' +
    (dateObject.getMonth() + 1) +
    '-' +
    dateObject.getDate()

  returnValue = dateString
  return returnValue
}

export default timestampToDateString
