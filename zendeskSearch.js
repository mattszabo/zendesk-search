var organizations = require('./data/organizations.json');
var tickets = require('./data/tickets.json');
var users = require('./data/users.json');

var searchCriteria = 'ecratic.com';

var Crawler = require('./src/crawler');
var crawler = new Crawler(organizations, tickets, users);

var menu = require('./src/menu');

// menu.mainMenu();
var results = crawler.find(searchCriteria);

console.log(results);
