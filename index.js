const OBAWrapper = require('node-oba-api-wrapper')
var fs = require('fs')
require('dotenv').config()

const client = new OBAWrapper({
  public: process.env.DB_PUBLIC,
  secret: process.env.DB_SECRET
})
client
  .get('search', {
    q: 'test',
    refine: true,
    facet: 'type(book)',
    count: 60
  })
  .then(results => {
    var boeken = results.map(book => createBookInstance(book))
    fs.writeFile(
      'd3/data.json',
      JSON.stringify(boeken, null, '  '),
      'utf8',
      function() {}
    )
  })

function createBookInstance(book) {
  bookInstance = {
    titel: book.titles.title.$t,
    language:
      !book.languages || !book.languages.language
        ? 'Language unknown'
        : book.languages.language.$t,
    year:
      !book.publication || !book.publication.year
        ? 'Year unknown'
        : book.publication.year.$t,
    author:
      !book.authors || !book.authors['main-author']
        ? 'Author unknown'
        : book.authors['main-author'].$t
  }
  return bookInstance
}
