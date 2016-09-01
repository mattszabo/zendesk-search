const chai = require('chai');
const expect = chai.expect;

const organizations = require('../data/organizations.json');
const tickets = require('../data/tickets.json');
const users = require('../data/users.json');

describe('Crawler logic', () => {

  const Crawler = require('../src/crawler');
  const crawler = new Crawler(organizations, tickets, users);

  //default values
  const datasetLabel = 'organizations';
  const key = '_id';
  const searchCriteria = 101

  it('Finds an organization and links their users', () => {
    const org = organizations[0];
    const result = crawler.gatherDataFromKey(datasetLabel, key, searchCriteria);
    console.log(result[0] === org);
    console.log(result[0]);
    console.log(org);
    expect(result[0]).to.equal(org);
  });

});
