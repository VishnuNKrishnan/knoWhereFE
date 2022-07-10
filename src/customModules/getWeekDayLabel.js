function getWeekDayLabel(dateString, requiredDay) {
  //Provide date string in YYYY-MM-DD format
  //Required day values: previous, current, next
  const weekdaysArray = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const dateObject = new Date(dateString)
  var returnValue

  if (requiredDay == 'previous') {
    if (dateObject.getDay() - 1 == -1) {
      returnValue = weekdaysArray[6]
    } else {
      returnValue = weekdaysArray[dateObject.getDay() - 1]
    }
  } else if (requiredDay == 'current') {
    returnValue = weekdaysArray[dateObject.getDay()]
  } else if (requiredDay == 'next') {
    if (dateObject.getDay() + 1 > 6) {
      returnValue = weekdaysArray[0]
    } else {
      returnValue = weekdaysArray[dateObject.getDay() + 1]
    }
  } else {
    console.log('Error in custom module getWeekDayLabel.')
    return
  }

  return returnValue
}

export default getWeekDayLabel
