const chai = require('chai');
const expect = chai.expect;

const organizations = require('../data/organizations.json');
const tickets = require('../data/tickets.json');
const users = require('../data/users.json');

const Search = require('../src/search');
const search = new Search(organizations, tickets, users);

describe('Search logic ', () => {

  //default values
  const unknownDatasetLabel = 'unknown';
  const datasetLabel = 'organizations';
  const key = '_id';
  const searchCriteria = 101

  it('reports an uknown dataset', () => {
    const searchCriteria = '101';
    result = search.find(unknownDatasetLabel, key, searchCriteria);
    expect(result[0]).to.equal('UNKNOWN DATA SET');
  });

  it('reports an empty dataset', () => {
    const emptyDataSearch = new Search();
    const result = emptyDataSearch.find(datasetLabel, key, searchCriteria);
    expect(result[0]).to.equal('NO ORGANIZATION DATA');
  });

  it('reports zero search results', () => {
    const searchCriteria = -1;
    const result = search.find(datasetLabel, key, searchCriteria);
    expect(result[0]).to.equal('Zero search results');
  });

  it('finds data by ID', () => {
    const org = organizations[0];
    const searchCriteria = org['_id']

    const result = search.find(datasetLabel, key, searchCriteria);
    expect(result[0]).to.deep.equal(org);
  });

  it('finds an organization using a single tag', () => {
    for(let i = 0; i< organizations.length; i++) {
      org = organizations[0];
      const key = 'tags';
      const searchCriteria = 'Fulton';

      let result = search.find(datasetLabel, key, searchCriteria);
      expect(result[0]).to.deep.equal(org);
    }
  });

  const userDatasetLabel = 'users';
  it('finds multiple results', () => {
    result = search.find(userDatasetLabel, 'organization_id', 101);
    // console.log('RES', result);
    expect(result.length).to.equal(4);
  })

});
