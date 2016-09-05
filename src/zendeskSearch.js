const read = require('readline-sync');
const clear = require('clear');
const colors = require('colors');

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
      const datasetLabel = getDatasetLabel();
      const field = getFieldToSearchOn(datasetLabel);
      const searchValue = getValueToSeachOn(datasetLabel, field);
      const results = dataCrawl(datasetLabel, field, searchValue);
      displaySearchResults(datasetLabel, field, searchValue, results);
      console.log("\n**********************************************\n");
      waitForKeyPress('Press any key to return to the main menu...');
      clear();
    }
  }

  displaySearchResults = function(datasetLabel, field, searchValue, results) {
    clear();
    console.log(header);
    console.log('Searching ' + datasetLabel.green + ' for ' + field.green + ' with a value of ' + searchValue.green +'\n');
    if(results[0] === 'No data found') {
      console.log('No data found for search.');
      return;
    }
    const dataList = results[0];
    const label = datasetLabel + '(s)';
    console.log(dataList.length + ' ' + label.green + ' found:');
    for(let i = 0; i < dataList.length; i++) {
      let data = dataList[i];
      let n = i + 1;
      console.log('\n' + datasetLabel + ' ' + n + '\n=======================');
      displaySingleResult(data);
    }
  }

  displaySingleResult = function(result) {
    for(key in result) {
      value = result[key];
      if(value instanceof Array) {
        console.log(key.green + ': ');
        for(let i = 0; i < value.length; i++) {
          console.log('  ' + value[i]);
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
          let dataField = '_id', searchField = 'organization_id', userSummaryFields = ['name', '_id'];
          org.users = getSummaryFromData(userSearcher, org, dataField, searchField, userSummaryFields)
        }
        results.push(orgResults);
        break;

      case 'user':
        const userResults = userSearcher.find(field, searchValue);
        for(let i = 0; i < userResults.length; i++) {
          user = userResults[i];
          let dataField = '_id', ticketSummaryFields = ['subject'], searchField = 'assignee_id';
          user.assignedTickets = getSummaryFromData(ticketSearcher, user, dataField, searchField, ticketSummaryFields);
          searchField = 'submitter_id';
          user.submittedTickets = getSummaryFromData(ticketSearcher, user, dataField, searchField, ticketSummaryFields);
        }
        results.push(userResults);
        break;

      case 'ticket':
        const ticketResults = ticketSearcher.find(field, searchValue);
        for(let i = 0; i < ticketResults.length; i++) {
          ticket = ticketResults[i];
          let dataField = 'assignee_id', searchField = '_id', userSummaryFields = ['name', '_id', 'role', 'suspended'];
          ticket.assignedUserInfo = getSummaryFromData(userSearcher, ticket, dataField, searchField, userSummaryFields);
        }
        results.push(ticketResults);
        break;

      default:
        exit('Found invalid dataset: ' + datasetLabel + '.\nPossible issue with getDatasetLabel method.\nNow exitting application.');
    }
    return results;
  }

  getSummaryFromData = function(searcher, data, dataField, searchField, summaryFields) {
    let searchData = searcher.find(searchField, data[dataField]);
    let results = [];
    if(searchData === 'No data foud') {
      results.push('No additional data found');
    } else {
      for(let i = 0; i < searchData.length; i++) {
        let summary = '';
        let key = summaryFields[0];
        summary += key.green + ": " + searchData[i][key];
        if(summaryFields.length > 1) {
          for(let j = 1; j < summaryFields.length; j++) {
            key = summaryFields[j];
            summary += ", " + key.green + ": " + searchData[i][key];
          }
        }
        results.push(summary);

      }
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
    message = message || '\nBye, thankyou for using Zendesk Search :)\n'
    clear();
    console.log(message);
    process.exit();
  }

  handleInvalidInput = function(option) {
    console.log('Invalid option:', option);
    waitForKeyPress('Press any key to continue and try again...');
    clear();
  }

  waitForKeyPress = function(message) {
    message = message || 'Press any key to continue...';
    read.question(message);
  }
};

module.exports = ZendeskSearch;
