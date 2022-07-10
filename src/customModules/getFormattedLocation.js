//Function to accept the reverse geocoded location data object from OpenCageAPI, and return an OBJECT with the mainLcation and subLocation values

function getFormattedLocation(locationDataObject) {
  var returnData = {
    mainLocation: '',
    subLocation: '',
  }

  const locationDataFromAPI = locationDataObject.results[0].components

  var mainLocation = ''
  var subLocation = ''

  //mainLocation Formatting
  if (locationDataFromAPI.neighbourhood) {
    mainLocation = locationDataFromAPI.neighbourhood
  } else if (locationDataFromAPI.suburb) {
    mainLocation = locationDataFromAPI.suburb
  } else if (locationDataFromAPI.city) {
    mainLocation = locationDataFromAPI.city
  } else {
    mainLocation = locationDataFromAPI.state
  }

  //subLocation Formatting
  function addSubLocationSeparator() {
    if (locationDataFromAPI.road) {
      if (subLocation !== '') {
        subLocation += ', '
      }
    }
  }

  if (locationDataFromAPI.road_reference) {
    subLocation = locationDataFromAPI.road_reference
  }

  if (
    locationDataFromAPI.road &&
    locationDataFromAPI.road !== 'unnamed road' &&
    locationDataFromAPI.road !== locationDataFromAPI.road_reference
  ) {
    addSubLocationSeparator()
    subLocation += locationDataFromAPI.road
  }

  addSubLocationSeparator()
  subLocation += locationDataFromAPI.state

  returnData.mainLocation = mainLocation
  returnData.subLocation = subLocation

  return returnData
}

export default getFormattedLocation
