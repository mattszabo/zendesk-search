// const chai = require('chai');
// const expect = chai.expect;
//
// const organizations = require('../data/organizations.json');
// const tickets = require('../data/tickets.json');
// const users = require('../data/users.json');
//
// describe('Zendesk Search application: ', () => {
//   const Crawler = require('../src/crawler');
//   const crawler = new Crawler(organizations, tickets, users);
//
//   describe('Organization data', () => {
//
//     it('each has a unique _id field', () => {
//       for(let i = 0; i < organizations.length; i++) {
//         const searchCriteria = organizations[i]['_id'];
//         const result = crawler.find('organizations', searchCriteria);
//         expect(result.length).to.equal(1);
//       }
//     });
//
//     it('can be found by searching on each attribute', () => {
//       const org = organizations[0];
//       let expectedResult = org;
//       expectedResult.employees = [['Loraine Pittman',5], ['Francis Bailey',23], ['Haley Farmer',27], ['Herrera Norman',29]];
//
//       // console.log(org);
//       for (let elem in org) {
//         let results;
//         let searchCriteria = org[elem];
//
//         if (searchCriteria instanceof Array) {
//           for(let i = 0; i < searchCriteria.length; i++) {
//             results = crawler.find(searchCriteria[i]);
//             log(results);
//             expect(results[0]).to.deep.equal(expectedResult);
//           };
//         } else {
//           results = crawler.find(searchCriteria);
//           console.log('yo', searchCriteria);
//           expect(results[0]).to.deep.equal(expectedResult);
//         }
//       }
//     });
//   });
//
//   // describe('Tickets Data', () => {
//   //   it('each has a unique _id field', () => {
//   //     for(let i = 0; i < tickets.length; i++) {
//   //       console.log("i", crawler.find(tickets[i]['_id']));
//   //       expect(crawler.find(tickets[i]['_id']).length).to.equal(1);
//   //     }
//   //   })
//   //   const ticket = tickets[0];
//   //   // it('')
//   // });
//   //
//   // describe('Search logic', () => {
//   //
//   //   it('reports if search term is not found', () => {
//   //     expect(crawler.find(new Date())).to.equal('NOT_FOUND')
//   //   });
//   // });
//
// });
