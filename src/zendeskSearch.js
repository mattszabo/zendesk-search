const inquirer = require('inquirer');
const _ = require('lodash');

const Searcher = require('./searcher');
const organizations = require('../data/organizations.json');
const tickets = require('../data/tickets.json');
const users = require('../data/users.json');

const orgSearcher = new Searcher(organizations);

function ZendeskSearch() {

  var searchOrListQuestion = [
    {
      type: 'rawlist',
      name: 'option',
      message: 'Please select one of the following options:',
      choices: ['Zendesk Search', 'List search fields', 'Exit'],
      filter: function(answer) {
        // make lower case, and replace spaces with hyphens
        let option = answer.toLowerCase().replace(/ /g, '-');
        return option;
      }
    }
  ];

  var searchQuestions = [
    {
      type: 'rawlist',
      name: 'dataset',
      message: 'What would you like to search for?',
      choices: ['Organizations', 'Tickets', 'Users'],
      filter: function (answer) {
        return answer.toLowerCase();
      }
    },
    {
      type: 'input',
      name: 'field',
      message: 'What field would you like to search on?'
    },
    {
      type: 'input',
      name: 'searchCriteria',
      message: 'Please enter your search value:'
    }
  ];

  this.run = function() {
    console.log('===================================');
    console.log('     Welcome to Zendesk Search™');
    console.log('===================================\n');

    // searchOrListFields();
    var readlineSync = require('readline-sync');

    const rl = readlineSync.question('May I have your name? ');

    console.log('ANS', rl);
  }

  searchOrListFields = function() {
    inquirer.prompt(searchOrListQuestion).then(function(answer) {
      if(answer.option === 'zendesk-search') {
        console.log('ZS');
        const result = searchCrawler();
        console.log('ZS REUTN');
        console.log(result);
        print(result);
      } else if (answer.option === 'list-search-fields') {
        listSearchFields();
        console.log('LSF');
      } else if (answer.option === 'exit') {
        console.log('Bye...');
        process.exit();
      }
    });
  }

  searchCrawler = function() {
    let result;
    inquirer.prompt(searchQuestions).then(function(answers) {
      // console.log('ANS', answers);
      if(answers.dataset === 'organizations') {
        // console.log('ORGS', answers.field, answers.searchCriteria);
        // console.log(typeof answers.searchCriteria);
        result = orgSearcher.find(answers.field, answers.searchCriteria);
        // console.log('RESSSSSS', result);
      }
    });
    // this.print(result);
    console.log('HEYYY');
    return result;
  }

  print = function() {
    console.log('PRINT', result);
  }

};



module.exports = ZendeskSearch;
