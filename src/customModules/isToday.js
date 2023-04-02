function isToday(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()

    return date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
}

export default isToday