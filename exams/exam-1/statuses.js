const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')
const path = require('path')
const fs = require('fs-extra')

const url = 'http://vhost3.lnu.se:20080/weekend'

/**
 * Helper funciton to get HTML content.
 *
 * @param {string} url Gets route to webpage.
 * @returns {string} Returns HTML game as plain/text.
 */
const getHTML = async url => {
  try {
    const res = await fetch(url)
    const data = await res.text()
    return data
  } catch (error) {
    console.error(error)
  }
}

const getInitialLinks = async data => {
  try {
    const page = await data
    const dom = new JSDOM(page)
    const arr = Array.from(dom.window.document.querySelectorAll('a[href^="http://"],a[href^="https://"]'),
      element => element.href)
    return arr.flat()
  } catch (error) {
    console.error(error)
  }
}

// Gets the array of links with names
const parseCalendar = async url => {
  const res = await fetch(url)
  const data = await res.text()
  const dom = new JSDOM(data)
  const names = Array.from(dom.window.document.querySelectorAll('a'),
    element => element.href)
  const namesLinks = names.map(name => url + name)
  return namesLinks
}

const parseCinema = async (url, day) => {
  const res = await fetch(url)
  const data = await res.text()
  const dom = new JSDOM(data)
  const movies = Array.from(dom.window.document.querySelector('#movie'), element => element.value)
  const movieValues = movies.splice(1, 3)
  return movieValues
}

const testPromise = async names => {
  const statuses = []
  const name = names.map(name => name.match(/(\b(?:(?!html|http|vhost3|lnu|se|20080|calendar)\w)+\b)/g, '')).flat()

  const promises = names.map(async name => getHTML(name))
  const texts = await Promise.all(promises)
  texts.map(text => {
    const dom = new JSDOM(text)

    const days = Array.from(dom.window.document.querySelectorAll('th'), element => element.textContent)
    const availability = Array.from(dom.window.document.querySelectorAll('td'), element => element.textContent)
    const result = days.reduce((obj, key, i) => ({ ...obj, [key]: availability[i] }), {})
    statuses.push(result)
  })
  const charSchedule = name.reduce((obj, key, i) => ({ ...obj, [key]: statuses[i] }), {})
  return charSchedule
}

const availableDay = async results => {
  if (Object.values(results).every(obj => obj.Friday === 'ok')) {
    return '05'
  }
  if (Object.values(results).every(obj => obj.Satuday === 'OK')) {
    return '06'
  }
  if (Object.values(results).every(obj => obj.Sunday === 'ok')) {
    return '07'
  }
}

const pathToFile = path.resolve('data', 'statuses.json')

const main = async () => {
  try {
    const data = getHTML(url)
    const [calendar, cinema, dinner] = await getInitialLinks(data)
    const [paul, peter, mary] = await parseCalendar(calendar)
    const [deuces, seats, races] = await parseCinema(cinema)
    const results = await testPromise([paul, peter, mary])
    const day = await availableDay(results)
    // console.log(day)
    // await fs.writeJson(pathToFile, results)
  } catch (error) {
    console.error(error)
  }
}
main()

// if days are duplicates => add property yes!
// need to check the available day and return the name of the day

// read json file and check the dates => return day (friday)
// read html page of calendar for friday and pull all the movies time
// counter for each day. if counter === 3 => ok
