const organizations = require('../data/organizations.json');
const tickets = require('../data/tickets.json');
const users = require('../data/users.json');

const Search = require('./search');
const search = new Search(organizations, tickets, users);

module.exports = function Crawler(dataSet, key, searchCriteria) {
  this.findOrganizationsByKey() = function() {
    return 'hi';
  }
}
