function Searcher(dataset) {
  this.dataset = dataset || [];

  this.isEmpty = function() {
    return this.dataset.length === 0;
  }

  this.find = function(key, value) {
    let foundData = [];
    for(let i = 0; i < this.dataset.length; i++) {
      let data = this.dataset[i];
      if(data[key] instanceof Array) {
        valueList = data[key];
        for(let j = 0; j < valueList.length; j++) {
          if(valueList[j] == value) {
            foundData.push(data);
          }
        }
      } else if (data[key] == value) {
        foundData.push(data);
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
