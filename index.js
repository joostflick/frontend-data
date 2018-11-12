const OBAWrapper = require('node-oba-api-wrapper')
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
    count: 500
  })
  .then(results => {
    var boeken = results.map(book => createBookInstance(book))
    console.log(boeken)
  })

function createBookInstance(book) {
  bookInstance = {
    titel: book.titles.title.$t,
    language:
      typeof book.languages === 'undefined' ||
      typeof book.languages.language === 'undefined'
        ? 'Language unknown'
        : book.languages.language.$t,
    year:
      typeof book.publication === 'undefined' ||
      typeof book.publication.year === 'undefined'
        ? 'Year unknown'
        : book.publication.year.$t,
    author:
      typeof book.authors === 'undefined' ||
      typeof book.authors['main-author'] === 'undefined'
        ? 'Author unknown'
        : book.authors['main-author'].$t
  }
  return bookInstance
}
