module.exports = function Search(organizations, tickets, users) {

  this.organizations = organizations || [];
  this.tickets = tickets || [];
  this.users = users || [];

  this.find = function (datasetLabel, key, searchCriteria) {

    switch(datasetLabel) {
      case 'organizations':
        if(this.organizations.length === 0) {
          return ['NO ORGANIZATION DATA'];
        }
        this.dataset = this.organizations;
        break;
      case 'tickets':
        if(this.tickets.length === 0) {
          return ['NO TICKET DATA'];
        }
        this.dataset = this.tickets;
        break;
      case 'users':
        if(this.users.length === 0) {
          return ['NO USER DATA'];
        }
        this.dataset = this.users;
        break;
      default:
        return ['UNKNOWN DATA SET'];
    }

    let resultList = this.getDataFromKey(this.dataset, key, searchCriteria);

    if(resultList.length === 0) {
      return ['Zero search results'];
    }
    return resultList;
  }

  this.getDataFromKey = function(dataset, key, searchCriteria) {
    let resultList = [];
    for(let i = 0; i < dataset.length; i++) {
      let data = dataset[i];
      let value = data[key];
      if(value instanceof Array) {
        for(let j = 0; j < value.length; j++ ) {
          if (value[j] === searchCriteria) {
            resultList.push(data);
          }
        }
      }
      if(value === searchCriteria) {
        resultList.push(data)
      }
    }
    return resultList;
  }

}
