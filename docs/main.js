var data = require('./data.json')

// make language field of data more readable
data.forEach(function(book) {
  if (book.language == 'dut') {
    book.language = 'Nederlands'
  } else if (book.language == 'eng') {
    book.language = 'Engels'
  } else if (book.language == 'fre') {
    book.language = 'Frans'
  } else if (book.language == 'ara') {
    book.language = 'Arabisch'
  } else if (book.language == 'mul') {
    book.language = 'Meertalig'
  } else if (book.language == 'ger') {
    book.language = 'Duits'
  }
})

// pass data to this function to return an array with the unique languages and amount of books for that language
function languagesCounter(data) {
  return d3
    .nest()
    .key(function(d) {
      return d.language
    })
    .rollup(function(v) {
      return v.length
    })
    .entries(data)
}

// add up all value properties in an array
function countTotal(array) {
  var total = 0
  array.forEach(function(d) {
    total = total + d.value
  })
  return total
}

// tooltip for mouse over
var tooltip = d3
  .select('body')
  .append('div')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')

// set the tooltip and style for the barchart
function onMouseOver(d, i) {
  d3.select(this).attr('class', 'highlight')
  return tooltip
    .style('visibility', 'visible')
    .text(d.key + ' = ' + d.value + ' boeken')
}
function onMouseOut(d, i) {
  d3.select(this).attr('class', 'bar')
  return tooltip.style('visibility', 'hidden')
}

// make the tooltip stick to the mouse
function mouseMove() {
  return tooltip
    .style('top', event.pageY - 10 + 'px')
    .style('left', event.pageX + 10 + 'px')
}

// set the tooltip and style for the piechart
function onMouseOverPie(d, i) {
  d3.select(this).attr('class', 'highlightPie')
  //label
  return tooltip
    .style('visibility', 'visible')
    .text(d.data.language + ' = ~' + Math.round(d.value) + '%')
}

function onMouseOutPie(d, i) {
  d3.select(this).attr('class', 'pie')
  return tooltip.style('visibility', 'hidden')
}

// drawing the barchart with the data that is passed
// partially from https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
function updateBarChart(data) {
  var languagesCount = languagesCounter(data)

  // dimensions
  const margin = 60
  const width = 600 - 2 * margin
  const height = 600 - 2 * margin

  const svg = d3.select('.barchart')

  const chart = svg
    .append('g')
    .attr('transform', `translate(${margin}, ${margin})`)

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, languagesCount[0].value + 5])

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
    .on('mouseover', onMouseOver)
    .on('mouseout', onMouseOut)
    .on('mousemove', mouseMove)
    .transition()
    .duration(400)
    .attr('height', s => height - yScale(s.value))
    .attr('width', xScale.bandwidth())
    .attr('class', 'bar')

    .attr('x', (actual, index, array) => xScale(actual.key))

  // drawing horizontal lines
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

  // adding labels
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
    .text('Populariteit van boeken met de term "website" per taal')
}

// drawing the pie chart, partially from http://www.tutorialsteacher.com/d3js/create-pie-chart-using-d3js

function updatePieChart(data) {
  var svgPie = d3.select('.piechart'),
    widthPie = svgPie.attr('width'),
    heightPie = svgPie.attr('height'),
    radiusPie = Math.min(widthPie - 50, heightPie - 50) / 2

  var g = svgPie
    .append('g')
    .attr('transform', 'translate(' + widthPie / 2 + ',' + heightPie / 2 + ')')

  var color = d3.scaleOrdinal([
    '#4daf4a',
    '#377eb8',
    '#ff7f00',
    '#984ea3',
    '#e41a1c'
  ])

  var pie = d3.pie().value(function(d) {
    return d.percent
  })

  var path = d3
    .arc()
    .outerRadius(radiusPie - 10)
    .innerRadius(0)

  var label = d3
    .arc()
    .outerRadius(radiusPie)
    .innerRadius(radiusPie - 80)

  var pie_data = []
  var languagesCount = languagesCounter(data)

  //percentages for pie chart
  for (var a = 0; a < languagesCount.length; a++) {
    // calculate percentage data for the piechart
    pie_data[a] = {
      language: languagesCount[a].key,
      percent: (languagesCount[a].value / countTotal(languagesCount)) * 100
    }
  }

  var arc = g
    .selectAll('.arc')
    .data(pie(pie_data))
    .enter()
    .append('g')
    .attr('class', 'arc')

  arc
    .append('path')
    .on('mouseover', onMouseOverPie)
    .on('mouseout', onMouseOutPie)
    .on('mousemove', mouseMove)
    .attr('d', path)
    .attr('fill', function(d) {
      return color(d.data.language)
    })
    .attr('class', 'pie')

  // labels
  arc
    .append('text')
    .attr('transform', function(d) {
      return 'translate(' + label.centroid(d) + ')'
    })
    .text(function(d) {
      // smallest value don't get a printed label, only on mouse over, to prevent visual clutter
      if (d.data.percent < 10) {
        return
      } else {
        return d.data.language
      }
    })
  svgPie
    .append('g')
    .attr('transform', 'translate(' + (widthPie - 130) / 2 + ',' + 20 + ')')
    .append('text')
    .text('Percentage taal')
    .attr('class', 'title')
}

// selecting time periods for the dropdown
var early = data.filter(item => item.year < 2000 && item.year >= 1990)
var mid = data.filter(item => item.year < 2010 && item.year >= 2000)
var late = data.filter(item => item.year >= 2010)

// draw initial screen
updateBarChart(early)
updatePieChart(early)

// dropdown
// http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
d3.select('#inds').on('change', function() {
  var sect = document.getElementById('inds')
  var section = sect.options[sect.selectedIndex].value
  // this prints either 1990, 2000 or 2010 based on the html dropdown
  if (section == 1990) {
    // clearing the previous charts
    d3.selectAll('svg > *').remove()
    // drawing the new charts
    updateBarChart(early)
    updatePieChart(early)
  } else if (section == 2000) {
    d3.selectAll('svg > *').remove()
    updateBarChart(mid)
    updatePieChart(mid)
  } else if (section == 2010) {
    d3.selectAll('svg > *').remove()
    updateBarChart(late)
    updatePieChart(late)
  } else {
    throw 'Dit klopt niet'
  }
})
