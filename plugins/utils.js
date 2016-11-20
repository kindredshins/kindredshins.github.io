var _ = require('lodash-fp');
var moment = require('moment');

function past(items) {
  var sorted = _.sortByOrder(_.get('date'), false);

  return sorted(items).filter(function (item) {
    var now = moment();
    var date = moment(item.metadata.date);

    return date.diff(now) < 0;
  });
};

function present(items) {
  var sorted = _.sortByOrder(_.get('date'), true);

  return sorted(items).filter(function (item) {
    var now = moment();
    var date = moment(item.metadata.date);

    return date.diff(now) >= 0;
  });
}

module.exports = (env, callback) => {
  env.helpers.past = past;
  env.helpers.present = present;

  callback();
};
