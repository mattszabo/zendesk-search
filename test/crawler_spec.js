var chai = require('chai');
var expect = chai.expect;

var organizations = require('../data/organizations.json');

describe('Search logic', () => {
  var Crawler = require('../src/crawler');
  var crawler = new Crawler(organizations);

  describe('Organization data', () => {

    const org = {
      _id: 101,
      url: 'http://initech.zendesk.com/api/v2/organizations/101.json',
      external_id: '9270ed79-35eb-4a38-a46f-35725197ea8d',
      name: 'Enthaze',
      domain_names: [ 'kage.com', 'ecratic.com', 'endipin.com', 'zentix.com' ],
      created_at: '2016-05-21T11:10:28 -10:00',
      details: 'MegaCorp',
      shared_tickets: false,
      tags: [ 'Fulton', 'West', 'Rodriguez', 'Farley' ]
    };

    it('can be found by searching on each attribute', () => {

      for (var elem in org) {
        let results;
        let searchCriteria = org[elem];

        if (searchCriteria instanceof Array) {
          let resultsList = [];
          for(var i = 0; i < searchCriteria.length; i++) {
            // resultsList = resultsList.concat(crawler.find(searchCriteria[i]));
            expect(crawler.find(searchCriteria[i])[0]).to.deep.equal(org);
          };
          // for(var i = 0; i < resultsList.length; i++) {
          //   expect(resultsList[i]).to.deep.equal(org);
          // };
        } else {
          results = crawler.find(searchCriteria);
          expect(results[0]).to.deep.equal(org);
        }
      }

    });

  });
});
