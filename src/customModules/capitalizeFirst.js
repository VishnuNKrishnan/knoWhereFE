function capitalizeFirst(str) {
    if (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    else {
        return
    }
}

export default capitalizeFirst