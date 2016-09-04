const read = require('readline-sync');
const clear = require('clear');
var colors = require('colors');

function ZendeskSearch() {
  const Searcher = require('./searcher');
  const organizations = require('../data/organizations.json');
  const tickets = require('../data/tickets.json');
  const users = require('../data/users.json');

  const orgSearcher = new Searcher(organizations);
  const ticketSearcher = new Searcher(tickets);
  const userSearcher = new Searcher(users);

  const header = '========================\n     Zendesk Search\n========================\n';

  this.run = function() {
    clear();
    console.log('====================================');
    console.log('     Welcome to Zendesk Search™');
    console.log('====================================\n');
    waitForKeyPress();
    clear();

    let validSearch = false;
    while(true) {
      console.log(header);
      console.log('Please select one of the following options:');
      console.log(' 1) Zendesk Search');
      console.log(' 0) Exit');

      let option = read.question(': ');
      switch(option) {
        case '1':
          validSelection = true;
          const datasetLabel = getDatasetLabel();
          const field = getFieldToSearchOn(datasetLabel);
          const searchValue = getValueToSeachOn(datasetLabel, field);
          const results = dataCrawl(datasetLabel, field, searchValue);
          displaySearchResults(datasetLabel, field, searchValue, results);
          waitForKeyPress('Press any key to return to the main menu.');
          clear();
          break;
        case '0':
          exit();
        default:
          handleInvalidInput(option);
      }
    }
  }

  displaySearchResults = function(datasetLabel, field, searchValue, results) {
    clear();
    console.log(header);
    console.log('Searching ' + datasetLabel.green + ' for ' + field.green + ' with a value of ' + searchValue.green +'\n');
    switch (datasetLabel) {
      case 'organization':
        const orgList = results[0];
        console.log(orgList.length + ' organization(s)'.green + ' found:');
        for(let i = 0; i < orgList.length; i++) {
          let org = orgList[i];
          let n = i + 1;
          console.log('\organization '+ n + ': ' + org.name + '\n==================================');
          displaySingleResult(org);
        }
        break;
      case 'user':
        const userList = results[0];
        console.log(userList.length + ' user(s)'.green + ' found:');
        for(let i = 0; i < userList.length; i++) {
          let user = userList[i];
          let n = i + 1;
          console.log('\nUser '+ n + ': ' + user.name + '\n==================================');
          displaySingleResult(user);
        }
        break;
      case 'ticket':
        const ticketList = results[0];
        console.log(ticketList.length + ' ticket(s)'.green + ' found:');
        for(let i = 0; i < ticketList.length; i++) {
          let ticket = ticketList[i];
          let n = i + 1;
          console.log('\nTicket ' + n + ': ' + ticket.subject + '\n======================================');
          displaySingleResult(ticket);
        }
        break;
      default:
        exit('Found invalid dataset: ' + datasetLabel + '.\nPossible issue with getDatasetLabel method.\nNow exitting application.');
    }
  }

  displaySingleResult = function(result) {
    for(key in result) {
      value = result[key];
      if(value instanceof Array) {
        console.log(key.green + ': ');
        for(let i = 0; i < value.length; i++) {
          console.log('  - ' + value[i]);
        }
      } else {
        console.log(key.green + ': ' + value);
      }
    }
  }

  dataCrawl = function(datasetLabel, field, searchValue) {
    let dataSearcher;
    let results = [];
    switch(datasetLabel) {
      case 'organization':
        const orgResults = orgSearcher.find(field, searchValue);
        for(let i = 0; i < orgResults.length; i++) {
          org = orgResults[i];
          let users = userSearcher.find('organization_id', org['_id']);
          let orgUsers = [];
          if(users === 'No data found') {
            orgUsers = 'No users found for the organization';
          } else {
            for(let j = 0; j < users.length; j++) {
              let userRec = users[j].name + ' (id: ' + users[j]._id + ')'
              orgUsers.push(userRec)
            }
          }
          org.users = orgUsers;
        }
        results.push(orgResults);
        break;
      case 'user':
        const userResults = userSearcher.find(field, searchValue);

        for(let i = 0; i < userResults.length; i++) {
          user = userResults[i];
          let assignedTickets = ticketSearcher.find('assignee_id', user['_id']);
          let userAssignedTickets = [];
          if(assignedTickets === 'No data found') {
            userAssignedTickets = 'No tickets assigned to user';
          } else {
            for(let j = 0; j< assignedTickets.length; j++) {
              userAssignedTickets.push(assignedTickets[j].subject)
            }
          }
          user.assignedTickets = userAssignedTickets;

          let submittedTickets = ticketSearcher.find('submitter_id', user['_id']);
          let userSubmittedTickets = [];
          if(submittedTickets === 'No data found') {
            userSubmittedTickets = 'No tickets assigned to user';
          } else {
            for(let j = 0; j< submittedTickets.length; j++) {
              userSubmittedTickets.push(submittedTickets[j].subject)
            }
          }
          user.submittedTickets = userSubmittedTickets;
        }
        results.push(userResults);
        break;
      case 'ticket':
        results.push(ticketSearcher.find(field, searchValue));
        break;
      default:
        exit('Found invalid dataset: ' + datasetLabel + '.\nPossible issue with getDatasetLabel method.\nNow exitting application.');
    }
    return results;
  }

  getValueToSeachOn = function(datasetLabel, field) {
    while(true) {
      clear();
      console.log(header);
      console.log('Please type the value of the ' + datasetLabel.green + ' field ' + field.green + ' to search on.');
      console.log('To exit the application type: \'exit\'');
      let value = read.question('\n: ');
      return value;
    }
  }

  getFieldToSearchOn = function(datasetLabel) {
    while(true) {
      clear();
      console.log(header);
      console.log('Please type the name of the ' + datasetLabel.green + ' field you would like to search on.');
      console.log('To exit the application type: \'exit\'');

      let option = read.question('For a list of fields, type in the command \'--list.\'\n\n: ');
      let validFields = getValidFieldsForDataset(datasetLabel);

      if(option === '--list') {
        displayFieldsForDataset(datasetLabel, validFields);
        waitForKeyPress();
      } else if (validFields.indexOf(option) >= 0) {
        return option;
      } else if (option === 'exit') {
        exit();
      } else {
        handleInvalidInput(option);
      }
    }
  }

  getValidFieldsForDataset = function(datasetLabel) {
    let validFields = [];
    const dataset = getDatasetFromLabel(datasetLabel);

    // Assumption: each dataset entry has all fields present, even if empty.
    for( key in dataset[0] ) {
      validFields.push(key);
    }

    return validFields;
  }

  getDatasetFromLabel = function(datasetLabel) {
    switch(datasetLabel) {
      case 'organization':
        return organizations;
      case 'user':
        return users;
      case 'ticket':
        return tickets;
      default:
        exit('Found invalid dataset: ' + datasetLabel + '.\nPossible issue with getDatasetLabel method.\nNow exitting application.');
    }
  }

  displayFieldsForDataset = function(datasetLabel, fieldList) {
    clear();
    console.log(header);
    console.log('Displaying valid field list for ' + datasetLabel.green + ' search:');
    for(let i = 0; i < fieldList.length; i++) {
      console.log(' - ' + fieldList[i]);
    }
  }

  getDatasetLabel = function() {
    while(true) {
      clear();
      console.log(header);
      console.log('Please select one of the following options:');
      console.log(' 1) Organization Search');
      console.log(' 2) User Search');
      console.log(' 3) Ticket Search');
      console.log(' 0) Exit');
      let option = read.question(': ');

      switch(option) {
        case '1':
          return 'organization';
        case '2':
          return 'user';
        case '3':
          return 'ticket';
        case '0':
          exit();
        default:
          handleInvalidInput(option);
      }
    }
  }

  exit = function(message) {
    message = message || 'Bye :)'
    clear();
    console.log(message);
    process.exit();
  }

  handleInvalidInput = function(option) {
    console.log('Invalid option:', option);
    waitForKeyPress('Press any key to continue and try again... ');
    clear();
  }

  waitForKeyPress = function(message) {
    message = message || 'Press any key to continue... ';
    read.question(message);
  }
};

module.exports = ZendeskSearch;
