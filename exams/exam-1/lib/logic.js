/**
 * Analyzes given arguments and creates a new array based on the difference between time of the movie and time of available cafe table.
 * The difference between the film and the cafe should be at least two hours.
 *
 * @param {Array} moviesStatus Array of objects with movie statuses.
 * @param {Array} cafeSlots Array of available cafe tables.
 * @returns {Array} An array with final results. The results suggests the movie and time and then suggests the time to book the cafe table.
 */
const logic = (moviesStatus, cafeSlots) => {
  const movieslotSplit = cafeSlots.map(val => val.split(/(\d+)/))

  const splitNum = str => {
    const middle = Math.ceil(str.length / 2)
    const s1 = str.slice(0, middle)
    const s2 = str.slice(middle)
    return s1 + '-' + s2
  }

  const whatDay = str => {
    if (str === 'fri') {
      return 'Friday'
    } else if (str === 'sat') {
      return 'Saturday'
    } else if (str === 'sun') {
      return 'Sunday'
    } else {
      return 'Other Day'
    }
  }
  const a = movieslotSplit.map(val => whatDay(val[0]) + ' ' + splitNum(val[1]))
  const slot = a.map(e => e.split(' '))

  const movieSlots = []
  for (let i = 0; i < moviesStatus.length; i++) {
    for (let j = 0; j < a.length; j++) {
      movieSlots.push((parseFloat(slot[j][1]).toFixed(2) - parseInt(moviesStatus[i].time)).toFixed(2) + ' ' + moviesStatus[i].movie + ' ' + moviesStatus[i].time + ' ' + a[j])
    }
  }

  const IfMoreThanTwoHours = el => {
    return el[0] >= 2
  }

  const movieName = el => {
    if (el[1] === '01') {
      return `On ${el[3]} the movie "The Flying Deuces" starts at ${el[2]} and there is a free table between ${el[4]}`
    } else if (el[1] === '02') {
      return `On ${el[3]} the movie "Keep Your Seats, Please" starts at ${el[2]} and there is a free table between ${el[4]}`
    } else if (el[1] === '03') {
      return `On ${el[3]} the movie "A day at the races" starts at ${el[2]} and there is a free table between ${el[4]}`
    } else {
      return 'No such movie'
    }
  }
  const suggestions = movieSlots.filter(IfMoreThanTwoHours).map(val => val.split(' '))
  const setSuggestions = new Set(suggestions.map(movieName))
  return setSuggestions
}

module.exports = { logic }
