function Searcher(dataset) {
  this.dataset = dataset || [];

  this.isEmpty = function() {
    return this.dataset.length === 0;
  }

  this.find = function(key, searchCriteria) {
    let foundData = [];
    for(let i = 0; i < this.dataset.length; i++) {
      let data = this.dataset[i];
      for(attr in data) {
        if(data[attr] == searchCriteria) {
          foundData.push(data);
        }
      }
    }
    if(foundData.length > 0) {
      return foundData;
    } else {
      return 'No data found';
    }
  }

}

module.exports = Searcher;
