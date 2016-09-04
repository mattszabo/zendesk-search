const chai = require('chai');
const expect = chai.expect;


describe('Searcher logic', () => {

  const Searcher = require('../src/searcher');
  const organizations = require('../data/organizations.json');
  const orgSearcher = new Searcher(organizations);

  it('accepts a dataset to search on', () => {
    expect(orgSearcher.isEmpty()).to.equal(false);
  })

  it('reports an empty dataset', () => {
    const emptyDataset = new Searcher();
    expect(emptyDataset.isEmpty()).to.equal(true);
  })

  it('finds a single organization record based on _id', () => {
    // make sure we get a copy of org[0] and not just a reference in case
    // we accidentally mutate the data and ruin the integrity of the test
    const expectedResult = JSON.parse(JSON.stringify(organizations[0]));
    const key = '_id';
    const value = 101;

    const result = orgSearcher.find(key, value);
    expect(result[0]).to.deep.equal(expectedResult);
  });

  it('reports no data found for a legitimate search', () => {
    const expectedResult = 'No data found';
    const key = '_id';
    const value = -1;

    const result = orgSearcher.find(key, value);
    expect(result).to.equal(expectedResult);
  });

  it('finds data based on an empty field', () => {
    //get a copy of the first organization and blank out its details
    const org = JSON.parse(JSON.stringify(organizations[0]));
    org.details = "";
    const orgWithEmptyDetailsData = [org];
    const orgWithEmptyDetailsSearcher = new Searcher(orgWithEmptyDetailsData);

    const expectedResult = org;
    const key = 'details';
    const value = "";

    const result = orgWithEmptyDetailsSearcher.find(key, value);
    expect(result[0]).to.equal(expectedResult);

  });

  it('finds data when searching on a field that has an array of values', () => {
    const org = JSON.parse(JSON.stringify(organizations[0]));
    const expectedResult = org;
    const key = 'domain_names';
    const value = 'zentix.com';

    const result = orgSearcher.find(key, value);
    expect(result[0]).to.deep.equal(org);
  })

});
