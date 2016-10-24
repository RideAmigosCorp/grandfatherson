
var filters = require('./filters');
var moment = require('moment');
var _ = require('lodash');

// Defaults to firstdayof=week Saturday for consistency with Python's grandfatherson
const SATURDAY = 6;

function toKeep (datetimes, options) {

		_.defaults(options, {
			 years        : 0,
			 months       : 0,
			 weeks        : 0,
			 days         : 0,
			 minutes      : 0,
			 hours        : 0,
			 seconds      : 0,
			 firstweekday : SATURDAY,
			 now					: undefined, // Default is defined in the filter function. No need to duplicate it here.
		});

		
		var mightHaveDupes = _.flatten([
            filters.Years.filter(datetimes,   {number:options.years,   now: options.now}),
            filters.Months.filter(datetimes,  {number:options.months,  now: options.now}),
            filters.Weeks.filter(datetimes,   {number:options.weeks,   now: options.now, firstweekday:options.firstweekday }),
            filters.Days.filter(datetimes,    {number:options.days,    now: options.now}),
            filters.Hours.filter(datetimes,   {number:options.hours,   now: options.now}),
            filters.Minutes.filter(datetimes, {number:options.minutes, now: options.now}),
            filters.Seconds.filter(datetimes, {number:options.seconds, now: options.now})
    ]);

		var toKeep = [];

		// You can't have dupes without at least 2
		if (mightHaveDupes.length < 2) {
			toKeep = mightHaveDupes;
		}
		// Remove duplicate dates, if any.
		else {
      mightHaveDupes = mightHaveDupes.sort(function (a ,b) {
        if (a.isBefore(b))
          return -1;
        if (a.isAfter(b))
          return 1;

        return 0;
      });

			// Now remove dupes from sorted array
		  for (var i = 0; i < mightHaveDupes.length; i++) {
				if (! mightHaveDupes[i].isSame(mightHaveDupes[i-1])) {
					toKeep.push(mightHaveDupes[i])
				}
		  }
		}
	
		return toKeep;

}

// Return a set of datetimes that should be deleted, out of 'datetimes`
function toDelete(datetimes, options) {
  
  // We can't just a function like _.difference, because moment objects can't be compared that simply
  // and the incoming values might not already be moment objects
  var seenSurvivors = {};
  toKeep(datetimes, options).map(function (dt) {
    seenSurvivors[dt.toISOString()] = true;
  })

  datetimes = datetimes.map(function (dt) { return moment.utc(dt) });

  // The dates to delete are the ones not returned by toKeep
  return _.filter(datetimes, function (dt) { return !seenSurvivors[ dt.toISOString() ] });

};

module.exports = {
  toKeep : toKeep,
  toDelete : toDelete
};
