const organizations = require('./data/organizations.json');
const tickets = require('./data/tickets.json');
const users = require('./data/users.json');

const Search = require('./src/crawler');
const search = new Search(organizations, tickets, users);

//menu logic
const dataset = 'organizations'
const key = '_id'
const searchCriteria = 101

const results = search.find(dataset, key, searchCriteria);

console.log(results);
