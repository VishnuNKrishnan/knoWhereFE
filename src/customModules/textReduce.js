function textReduce(text, allowedLength) {
  let returnValue = ''

  if (text) {
    for (var i = 0; i < allowedLength; i++) {
      if (text[i]) {
        returnValue += text[i]
      } else {
        break
      }
    }

    if (allowedLength < text.length) {
      returnValue += '...'
    }
  }

  return returnValue
}

export default textReduce
