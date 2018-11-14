var data = require('./data.json')
console.log(data)

var languagesCount = d3
  .nest()
  .key(function(d) {
    return d.language
  })
  .rollup(function(v) {
    return v.length
  })
  .entries(data)
console.log(JSON.stringify(languagesCount))

var maxYear = d3.max(data, function(d) {
  return d.year
})
var minYear = d3.min(data, function(d) {
  return d.year
})
var yearAvg = d3.mean(data, function(d) {
  return d.year
})

//barchart

const margin = 60
const width = 1000 - 2 * margin
const height = 600 - 2 * margin

const svg = d3.select('svg')

const chart = svg
  .append('g')
  .attr('transform', `translate(${margin}, ${margin})`)

const yScale = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, languagesCount[0].value + 50])

chart.append('g').call(d3.axisLeft(yScale))

const xScale = d3
  .scaleBand()
  .range([0, width])
  .domain(languagesCount.map(d => d.key))
  .padding(0.2)

chart
  .append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScale))

chart
  .selectAll()
  .data(languagesCount)
  .enter()
  .append('rect')
  .attr('x', s => xScale(s.key))
  .attr('y', s => yScale(s.value))
  .attr('height', s => height - yScale(s.value))
  .attr('width', xScale.bandwidth())

  .attr('x', (actual, index, array) => xScale(actual.key))

//horizontal lines
chart
  .append('g')
  .attr('class', 'grid')
  .call(
    d3
      .axisLeft()
      .scale(yScale)
      .tickSize(-width, 0, 0)
      .tickFormat('')
  )

//labels
svg
  .append('text')
  .attr('x', -(height / 2) - margin)
  .attr('y', margin / 2.4)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .text('Aantal boeken')

svg
  .append('text')
  .attr('x', width / 2 + margin)
  .attr('y', 40)
  .attr('text-anchor', 'middle')
  .text('Populariteit van boeken over het web')
