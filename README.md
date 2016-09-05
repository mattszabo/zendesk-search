#ZENDESK SEARCH

A simple JavaScript search application that displays organization, user, and ticket information.

Additional information is also displayed for the following searches:
* An organization search will also list related user info.
* A user search will also list related ticket info.
* A ticket search will also list the role and suspension status of the user currently assigned.

##Prerequisites
Node.js - Installation instructions for the latest version can be found at https://nodejs.org/en/

##Installation instructions
From the command line, type the following:
```
git clone https://github.com/wekilledit/zendesk-search.git zendesk-search
cd zendesk-search
npm install
```

##Running the app:
Run with:
  `npm start`

##Testing:
Uses mocha and chai for unit tests
Test with:
  `npm run test`
