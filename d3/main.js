var data = require('./data.json')
console.log(data)

var maxYear = d3.max(data, function(d) {
  return d.year
})
var minYear = d3.min(data, function(d) {
  return d.year
})
var yearAvg = d3.mean(data, function(d) {
  return d.year
})

document.getElementById('heading').innerHTML =
  'Nieuwste boek komt uit: ' +
  maxYear +
  ' en het oudste boek komt uit: ' +
  minYear +
  '\n gemiddelde: ' +
  yearAvg
