module.exports = function Searcher(organizations = [], tickets = [], users = []) {
  this.organizations = organizations;
  this.tickets = tickets;
  this.users = users;

  this.find = function find(searchCriteria) {
    var found = [];
    for (var i = 0; i < this.organizations.length; i++) {
      var org = this.organizations[i];
      for (var key in org) {
        if(org[key] instanceof Array) {
          // console.log(org[key],'ARRAY');
          for(var j = 0; j < org[key].length; j++){
            if(org[key][j] === searchCriteria){
              found.push(org);
            }
          }
        }
        if (org[key] === searchCriteria) {
          found.push(org);
        }
      }
    }
    if(found === []) {
      // console.log('could not find:', );
    }
    return found;
  }
}
