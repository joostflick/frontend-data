const OBAWrapper = require('node-oba-api-wrapper')
var fs = require('fs')
require('dotenv').config()

const client = new OBAWrapper({
  public: process.env.DB_PUBLIC,
  secret: process.env.DB_SECRET
})
client
  .get('search', {
    q: 'website',
    refine: true,
    facet: 'type(book)',
    count: 1000
  })
  .then(results => {
    console.log(JSON.stringify(results))
    var boeken = results.map(book => createBookInstance(book))
    var cleanedBoeken = boeken.filter(
      book => book.year != null && book.language
    )
    fs.writeFile(
      'd3/data.json',
      JSON.stringify(cleanedBoeken, null, '  '),
      'utf8',
      function() {}
    )
  })
function createBookInstance(book) {
  bookInstance = {
    // titel: book.titles.title.$t,
    language:
      !book.languages || !book.languages.language
        ? 'Language unknown'
        : book.languages.language.$t,
    year:
      !book.publication || !book.publication.year
        ? null
        : Number(book.publication.year.$t)
  }
  return bookInstance
}
