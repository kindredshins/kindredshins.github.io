var _ = require('lodash-fp');
var moment = require('moment');

var sortByDate = _.sortByOrder(_.get('date'));
var sortByDateDesc = sortByDate(false);
var sortByDateAsc = sortByDate(true);
var isPeriod = _.curry(function(operator, fn, item) {
  return operator(0, fn(item.metadata.date));
});

function diff(date) {
  var now = moment();
  var date = moment(date);
  return date.diff(now);
}

function past(items) {
  var isPast = isPeriod(_.lt);
  return sortByDateDesc(items).filter(isPast(diff));
};

function present(items) {
  var isPresent = isPeriod(_.gte);
  return sortByDateAsc(items).filter(isPresent(diff));
}

function log(value) {
  console.log(value);
}

module.exports = (env, callback) => {
  env.helpers.past = past;
  env.helpers.present = present;
  env.helpers.log = log;

  callback();
};
