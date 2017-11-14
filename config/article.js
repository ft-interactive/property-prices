export default () => ({ // eslint-disable-line

  // link file UUID
  id: '9d79ba9c-f75c-11e6-9516-2d969e0d3b65',

  // canonical URL of the published page
  // https://ig.ft.com/sites/property-prices get filled in by the ./configure script
  url: 'https://ig.ft.com/sites/property-prices',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2017-11-03T15:38:24Z'),

  headline: 'Global prime property calculator',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'How much prime residential property could you buy in the world’s priciest cities?',

  topic: {
    name: 'Prime property',
    url: 'https://www.ft.com/topics/themes/Prime_property',
  },

  relatedArticle: {
    text: '',
    url: '',
  },

  mainImage: {
    title: 'FT Property calculator',
    description: 'A property calculator',
    url: 'https://az592774.vo.msecnd.net/pgl-release/Images/ArticleImages/14/14710.jpg',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Lily Madar', url: 'https://www.ft.com/' },
    { name: 'Alida Smith', url: 'https://www.ft.com/stream/authorsId/ZmFjYjY2MTQtZTQyZi00NjIwLTkzYTEtN2EzNzIyNWRmYzI2-QXV0aG9ycw==' },
    { name: 'Nathan Brooker', url: 'https://www.ft.com/stream/authorsId/Q0ItMDAwMTM2NQ==-QXV0aG9ycw==' },
    { name: 'Steven Bernard', url: 'https://twitter.com/sdbernard' },
  ],

  // Appears in the HTML <title>
  title: 'Prime property price tracker',

  // meta data
  description: 'How much prime property could you buy in London, New York, Paris, Hong Kong, Berlin, Singapore or Sydney?',

  /*

  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialSummary:  '',

  // TWITTER
  // twitterImage: '',
  // twitterCreator: '@individual's_account',
  // tweetText:  '',
  // twitterHeadline:  '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
