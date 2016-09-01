const organizations = require('../data/organizations.json');
const tickets = require('../data/tickets.json');
const users = require('../data/users.json');

const Search = require('./search');

module.exports = function Crawler(organizations, tickets, users) {

  const search = new Search(organizations, tickets, users);

  this.gatherDataFromKey = function(datasetLabel, key, searchCriteria) {
    switch(datasetLabel) {
      case 'organizations':
      let org = search.find(datasetLabel, key, searchCriteria);

      //for each org, lets add their users as a key value pair

      let users = search.find('users', 'organization_id', org['_id']);
      console.log('users', users);
      let orgUsers = [];
      for(let i = 0; i < users.length; i++) {
        user = users[i];
        orgUsers.push(user['name'] + ' (ID: ' + user['_id'] + ')');
      }
      org.userList = orgUsers;
      console.log('RESSS', org);
      return org;
    }
    return('not found');
  }
}
