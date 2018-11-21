var data = require('./data.json')

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
//console.log(languagesCount)
//console.log(countTotal(languagesCount))

// add up all values in array
function countTotal(array) {
  var total = 0
  array.forEach(function(d) {
    total = total + d.value
  })
  return total
}

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
function updateBarChart(data) {
  var languagesCount = languagesCounter(data)
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
    .text('Populariteit van boeken met de term "website"')
}

// pie chart http://www.tutorialsteacher.com/d3js/create-pie-chart-using-d3js

function updatePieChart(data) {
  var svgPie = d3.select('.piechart'),
    widthPie = svgPie.attr('width'),
    heightPie = svgPie.attr('height'),
    radiusPie = Math.min(widthPie, heightPie) / 2

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
    // simple logic to calculate percentage data for the pie
    pie_data[a] = {
      language: languagesCount[a].key,
      percent: (languagesCount[a].value / countTotal(languagesCount)) * 100
    }
  }
  console.log(pie_data)
  var arc = g
    .selectAll('.arc')
    .data(pie(pie_data))
    .enter()
    .append('g')
    .attr('class', 'arc')

  arc
    .append('path')
    .attr('d', path)
    .attr('fill', function(d) {
      return color(d.data.language)
    })

  arc
    .append('text')
    .attr('transform', function(d) {
      return 'translate(' + label.centroid(d) + ')'
    })
    .text(function(d) {
      return d.data.language
    })

  svgPie
    .append('g')
    .attr('transform', 'translate(' + (widthPie / 2 - 200) + ',' + 20 + ')')
    .append('text')
    .text('Percentage taal')
    .attr('class', 'title')
}

var early = data.filter(item => item.year < 2000 && item.year > 1990)
var mid = data.filter(item => item.year < 2010 && item.year > 2000)
var late = data.filter(item => item.year > 2010)

//draw zero state
updateBarChart(early)
updatePieChart(early)

// dropdown
// http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
d3.select('#inds').on('change', function() {
  var sect = document.getElementById('inds')
  var section = sect.options[sect.selectedIndex].value
  // this prints either 1990, 2000 or 2010
  if (section == 1990) {
    // clearing the previous charts
    d3.selectAll('svg > *').remove()
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
    console.log('hier gaat iets fout')
  }
})
