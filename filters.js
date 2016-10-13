
"use strict";

var moment = require('moment');
var _ = require('lodash');


// Because JavaScript's Modulo is really a remainder.
// Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators
// Ref: http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving 
function mod(n, m) {
          return ((n % m) + m) % m;
}


// base class
class Filter {

  // Returns a date object with the same value as `dt`, keeping only significant values
  static mask (moment) {
    throw 'NotImplemented';
  }

  // Return the starting datetime: `number` of units before `now`
  static start(options) {
		if (! options || !_.isInteger(options.number) || options.number < 0) {
			throw 'Missing or Invalid number option';
		}

		// Ugly way to introspect the class name from static method.
		// From: http://stackoverflow.com/questions/36426860/retrieve-class-name-from-within-static-method-in-typescript
		var classname = this.toString().split ('(' || /s+/)[0].split (' ' || /s+/)[1];
		// Call clone() on now to avoid modifying input
    return this.mask(options.now).subtract(options.number-1, classname.toLowerCase());
  }

 /*  Return a set of datetimes, after filtering `datetimes`.
     The result will be the `datetimes` which are `number` of
     units before `now`, until `now`, with approximately one
     unit between each of them.  The first datetime for any unit is
     kept, later duplicates are removed.
     If there are `datetimes` after `now`, they will be returned unfiltered.
	*/

  static filter (datetimes, options) {
    var self = this;

		// Validate all the dates to prevent garbage-in, garbage-out bugs
		if (!_.isArray(datetimes)) {
			throw 'first arg to filter must be array'
		}

		datetimes = datetimes.map(function (dt) {
       dt = moment.utc(dt);
       if (!moment.isMoment(dt)) {
			   throw 'at least one date appears not to be a moment object. No isValid property found: '+dt.toString();
       }

			if (!dt.isValid()) {
				throw 'a date passed to filter was not valid: '+dt.toString();
			}

      return dt;
		});

		if (! options || !_.isInteger(options.number) || options.number < 0) {
			throw 'Missing or Invalid number option';
		}


	  // datetimes = tuple(datetimes)

    options.now = _.defaultTo(options.now, moment.utc());

	  // Always keep datetimes from the future
	  var future =  _.filter(datetimes, function (dt) { return dt.isAfter(options.now);  })

	  if (options.number === 0) {
	  	return future;
	  }

	  // Don't consider datetimes from before the start
    var start = this.start(options)
	  var valid = _.compact(_.filter(datetimes, function (dt) { return dt.isBetween(start, options.now, null, '[]') }));

	  // Deduplicate datetimes with the same mask value by keeping the oldest
	  var sortedValid = valid.sort(function (a,b) {
	   if(a.isBefore(b)) return -1;
		 if(a.isAfter(b)) return 1;
    });
	  var kept = {};
	  sortedValid.map(function (dt) {
	  		var key = self.mask(dt).toString();
	  		kept[key] = _.defaultTo(kept[key], dt);
	  });

	  return _.uniq(_.values(kept), future);
	}
}

class Seconds extends Filter {
	// Return a datetime with the same value as `dt`, to a resolution of seconds
	static mask (dt) {
		return dt.clone().startOf('second')
	}
}
			

class Minutes extends Filter {
	// Return a datetime with the same value as `dt`, to a resolution of minutes
	static mask (dt) {
		return dt.clone().startOf('minute');
	}
}

class Hours extends Filter {
	// Return a datetime with the same value as `dt`, to a resolution of hours
	static mask (dt) {
		return dt.clone().startOf('hour');
	}
}

class Days extends Filter {
	// Return a datetime with the same value as `dt`, to a resolution of Days
	static mask (dt) {
		return dt.clone().startOf('day')
	}
}

const DAYS_IN_WEEK = 7;

class Weeks extends Filter {

	static start (options) {
		if (! options || !_.isInteger(options.number) || options.number < 0) {
			throw 'Missing or Invalid number option';
		}

		 // Defaults to Saturday for compatibilty with Python's grandfatherson
		 options.firstweekday = _.defaultTo(options.firstweekday,6);

		 var week = this.mask(options.now, options.firstweekday)
		 var days = (options.number -1) * DAYS_IN_WEEK;
 		 return week.subtract(days,'days');
	}

	// Returns a datetime with the same value as `dt`, to a resolution of weeks.
	static mask(dt, firstweekday) {
		 dt = dt.clone();
		 // Defaults to Saturday for compatibilty with Python's grandfatherson
		 firstweekday = _.defaultTo(firstweekday,6);

		 var correction = mod((dt.day() - firstweekday), DAYS_IN_WEEK);
		 var week = dt.subtract(correction,'days');
     return week.startOf('day');
	}

}

const MONTHS_IN_YEAR = 12;

class Months extends Filter {

	// Returning the starting datetime, `number` of months before `now`.
	// static start(options) {
	// 	if (! options || !_.isInteger(options.number) || options.number < 0) {
	// 		throw 'Missing or Invalid number option';
	// 	}
  //   if (! options.now ) {
	// 		throw "Missing 'now' option";
  //   }

	// 	var year = options.now.year();
	// 	var month = options.now.month() - options.number + 1;

	// 	// Handle negative months
	// 	if (month < 0) {
	// 	  year = year + Math.floor(month/MONTHS_IN_YEAR);
  //     month = mod(month, MONTHS_IN_YEAR)
	// 	}
  //   // Handle December
  //   // XXX Not sure the JavaScript port needs this special case
  //   var dt = this.mask(options.now);
  //   dt.year(year);
  //   dt.month(month);
  //   return dt;
	// }


  // return a datetime with the same value as `dt`, to a resolution of months
  static mask (dt) {
		return dt.clone().startOf('month');
  }
}

class Years extends Filter {
  // Retrun the starting datetime: `number` of years before `now`
  static start(options) {
		if (! options || !_.isInteger(options.number) || options.number < 0) {
			throw 'Missing or Invalid number option';
    }

    var dt = this.mask(options.now);
    dt.year(options.now.year() - options.number + 1);
    return dt;
  }

  // Returns a datetime with the same value as `dt`, to a resolution of years.
  static mask (dt) {
    return dt.clone().startOf('year');
  }
}

module.exports = {
  'Seconds' : Seconds,
  'Minutes' : Minutes,
  'Hours'   : Hours,
  'Days'    : Days,
  'Weeks'   : Weeks,
  'Months'  : Months,
  'Years'   : Years,
}
