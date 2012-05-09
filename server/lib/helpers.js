(function(){

  String.prototype.chomp = function () {
     return this.replace(/(\n|\r)+$/, '');
  };

  function respond(res, json) {
    res.writeHead(200, {'content-type': 'application/json'});
    res.write(JSON.stringify(json));
    res.end();
  }

  function getCurrentDate() {
    var d = new Date();
    function pad(n){
        return n<10 ? '0'+n : n
    }
    formattedDate = d.getUTCFullYear()
    + pad(d.getUTCMonth()+1)
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())
    + pad(d.getUTCMinutes())
    + pad(d.getUTCSeconds())+'Z';
    return formattedDate;
  }

  module.exports.respond  	= respond;
  module.exports.getCurrentDate = getCurrentDate;
}());
