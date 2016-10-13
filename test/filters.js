"use strict";
var moment = require('moment');
var chai = require('chai');
var expect = chai.expect;

var filters = require('../filters');
var Seconds = filters.Seconds;
var Minutes = filters.Minutes;
var Hours   = filters.Hours;
var Days = filters.Days;
var Weeks = filters.Weeks;
var Months = filters.Months;
var Years = filters.Years;

describe('Filters', function() {
  describe('exports', function () {
    it("should export keys for each unit of time", function () {
      expect(filters).to.have.keys(['Seconds','Minutes','Hours','Days','Weeks','Months','Years']);
    });
  });
  describe('Seconds', function () {

		var now = moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 0, seconds: 1, milliseconds: 1});

		var datetimes = [
				moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 0, seconds: 1, milliseconds: 0}),
				moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 0, seconds: 0, milliseconds: 1}),
				moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 0, seconds: 0, milliseconds: 0}),
				moment.utc({year: 1999, month: 11, day: 31, hour: 23, minute: 59, seconds: 59, milliseconds: 999}),
				moment.utc({year: 1999, month: 11, day: 31, hour: 23, minute: 59, seconds: 57, milliseconds: 0})
		];

	
	 describe('start', function () {
     it("should throw an error if no number if provided to filter", function () {
       var fn = function () { Seconds.start(); };
       expect(fn).to.throw(/Missing or Invalid number/i);
     });

			it("Should return starting dt `number`-1 of units before now", function () {
				var startMoment =	Seconds.start({ now:now, number: 8});
				expect(startMoment.toString()).to.equal(
					moment.utc({year: 1999, month: 11, day: 31, hour: 23, minute: 59, seconds: 54, milliseconds: 1}).toString()
				);
			});
	 });

		describe('mask', function () {
			it('should mask seconds', function () {
				expect(Seconds.mask(
						moment.utc({ year: 1999, month: 11, day:31, hour:23, minute: 59, seconds: 59, milliseconds: 999})
					).toString()).to.equal(
						moment.utc({ year: 1999, month: 11, day:31, hour:23, minute: 59, seconds: 59, milliseconds: 0}).toString()
			 );
			});
	  })	

   describe('filter', function () {
     it("should throw an error if first arg is not array", function () {
       var fn = function () { Seconds.filter(); };
       expect(fn).to.throw(/first arg to filter must be array/i);
     });

     it("should throw an error if one of the dates provided is not valid", function () {
       var fn = function () { Seconds.filter(['boom']); };
       expect(fn).to.throw(/a date passed to filter was not valid/i);
     });

     it("should throw an error if no number if provided to filter", function () {
       var fn = function () { Seconds.filter([now]); };
       expect(fn).to.throw(/Missing or Invalid number/i);
     });

     it("should accept date-strings and Date objects, as Moment does", function () {
       var datetimes = [
         "1995-12-25",
         "2013-02-08 09:30:26.123",
				 "2016-10-12T19:31:38Z",
				 new Date("1995-12-25"),
       ];
       var fn = function () { Seconds.filter(datetimes,{number:1}); };
       expect(fn).to.not.throw(/at least one date appears not to be a moment object/i);
     });

		it('should keep future datetimes', function () {
			var datetimes = [
					moment.utc({year: 2010, month: 0, day: 15, hour: 0, minute: 0, seconds: 1, milliseconds: 0}), // Wikipedia
			];

			expect(Seconds.filter(datetimes, {number:0, now:now})).to.eql(datetimes);
		});

		it('no input returns empty set', function () {
			expect(Seconds.filter([], {number:0, now:now})).to.eql([]);
		});

		it('no matches returns empty set', function () {
			expect(Seconds.filter(datetimes, {number:0, now:now})).to.eql([]);
		});

		it('for dates that end up with the same mask, return the oldest', function () {
			var filtered = Seconds.filter(datetimes, {number:2, now:now});
			expect(filtered.length).to.equal(2);
			expect(filtered[0].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 0, seconds: 0, milliseconds: 1}).toString()
			),
		  expect(filtered[1].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 0, seconds: 1, milliseconds: 0}).toString()
			);
		});

		it('for current second, return it', function () {
      var filtered = Seconds.filter(datetimes, {number:1, now:now});
      expect(filtered.length).to.equal(1);
      expect(filtered[0].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 0, seconds: 1, milliseconds: 0}).toString()
      );
		})

		it('test matching some but not all', function () {
      var filtered = Seconds.filter(datetimes, {number:4, now:now});
      expect(filtered.length).to.equal(3);
		})

		it('test matching more', function () {
      var filtered = Seconds.filter(datetimes, {number:5, now:now});
      expect(filtered.length).to.equal(4);
      var filtered = Seconds.filter(datetimes, {number:6, now:now});
      expect(filtered.length).to.equal(4);
		})
	 })
  }); // End seconds


  describe('Minutes', function () {

		var now = moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 1, seconds: 1, milliseconds: 1});

		var datetimes = [
				moment.utc({year: 2000, month: 0,  day: 1,  hour: 0,  minute: 1,  seconds: 0,  milliseconds: 0}),
				moment.utc({year: 2000, month: 0,  day: 1,  hour: 0,  minute: 0,  seconds: 1,  milliseconds: 0}),
				moment.utc({year: 2000, month: 0,  day: 1,  hour: 0,  minute: 0,  seconds: 0,  milliseconds: 0}),
				moment.utc({year: 1999, month: 11, day: 31, hour: 23, minute: 59, seconds: 59, milliseconds: 999}),
				moment.utc({year: 1999, month: 11, day: 31, hour: 23, minute: 57, seconds: 0, milliseconds: 0})
		];

	
	 describe('start', function () {
     it("should throw an error if no number if provided to filter", function () {
       var fn = function () { Minutes.start(); };
       expect(fn).to.throw(/Missing or Invalid number/i);
     });

			it("Should return starting dt `number`-1 of units before now", function () {
				var startMoment =	Minutes.start({ now:now, number: 8});
				expect(startMoment.toString()).to.equal(
					moment.utc({year: 1999, month: 11, day: 31, hour: 23, minute: 54}).toString()
				);
			});
	 });

		describe('mask', function () {
			it('should mask minutes', function () {
				expect(Minutes.mask(
						moment.utc({ year: 1999, month: 11, day:31, hour:23, minute: 59, seconds: 59, milliseconds: 999})
					).toString()).to.equal(
						moment.utc({ year: 1999, month: 11, day:31, hour:23, minute: 59}).toString()
			 );
			});
	  })	

   describe('filter', function () {

		it('should keep future datetimes', function () {
			var datetimes = [
					moment.utc({year: 2010, month: 0, day: 15, hour: 0, minute: 0, seconds: 1, milliseconds: 0}), // Wikipedia
			];

			expect(Minutes.filter(datetimes, {number:0, now:now})).to.eql(datetimes);
		});

		it('no input returns empty set', function () {
			expect(Minutes.filter([], {number:0, now:now})).to.eql([]);
		});

		it('no matches returns empty set', function () {
			expect(Minutes.filter(datetimes, {number:0, now:now})).to.eql([]);
		});

		it('for dates that end up with the same minute mask, return the oldest first', function () {
			var filtered = Minutes.filter(datetimes, {number:3, now:now});
			expect(filtered.length).to.equal(3);
		  expect(filtered[0].toString()).to.equal(
				moment.utc({year: 1999, month: 11, day: 31, hour: 23, minute: 59, seconds: 59, milliseconds:999}).toString()
			);
      // This is the older of the two duplicate backups from the same minute
			expect(filtered[1].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 0, seconds: 0}).toString()
			),
		  expect(filtered[2].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 1, seconds: 0}).toString()
			);
		});

		it('for current minute, return it', function () {
      var filtered = Minutes.filter(datetimes, {number:1, now:now});
      expect(filtered.length).to.equal(1);
      expect(filtered[0].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1, hour: 0, minute: 1, seconds: 0, milliseconds: 0}).toString()
      );
		})

		it('test matching some but not all', function () {
      var filtered = Minutes.filter(datetimes, {number:4, now:now});
      expect(filtered.length).to.equal(3);
		})

		it('test matching more', function () {
      var filtered = Minutes.filter(datetimes, {number:5, now:now});
      expect(filtered.length).to.equal(4);
      var filtered = Minutes.filter(datetimes, {number:6, now:now});
      expect(filtered.length).to.equal(4);
		})
	 })
  }) // Minutes


  describe('Hours', function () {

    var now = moment.utc({year: 2000, month:0, day:1, hour:1, minute:1, second:1, millisecond:1})
    var datetimes = [
      moment.utc({year: 2000, month:0,  day:1,  hour:1,  minute:0,  second:0,  millisecond:0}),
      moment.utc({year: 2000, month:0,  day:1,  hour:0,  minute:1,  second:0,  millisecond:0}),
      moment.utc({year: 2000, month:0,  day:1,  hour:0,  minute:0,  second:0,  millisecond:0}),
      moment.utc({year: 1999, month:11, day:31, hour:23, minute:59, second:59, millisecond:999}),
      moment.utc({year: 1999, month:11, day:31, hour:21, minute:0,  second:0,  millisecond:0}),
    ]

	
	 describe('start', function () {
     it("should throw an error if no number if provided to filter", function () {
       var fn = function () { Hours.start(); };
       expect(fn).to.throw(/Missing or Invalid number/i);
     });

			it("Should return starting dt `number`-1 of units before now", function () {
				var startMoment =	Hours.start({ now:now, number: 8});
				expect(startMoment.toString()).to.equal(
					moment.utc({year: 1999, month: 11, day: 31, hour: 18}).toString()
				);
			});
	 });

		describe('mask', function () {
			it('should mask hours', function () {
				expect(Hours.mask(
						moment.utc({ year: 1999, month: 11, day:31, hour:23, minute: 59, seconds: 59, milliseconds: 999})
					).toString()).to.equal(
						moment.utc({ year: 1999, month: 11, day:31, hour:23}).toString()
			 );
			});
	  })	

   describe('filter', function () {

		it('should keep future datetimes', function () {
			var datetimes = [
					moment.utc({year: 2010, month: 0, day: 15, hour: 0, minute: 0, seconds: 1, milliseconds: 0}), // Wikipedia
			];

			expect(Hours.filter(datetimes, {number:0, now:now})).to.eql(datetimes);
		});

		it('no input returns empty set', function () {
			expect(Hours.filter([], {number:0, now:now})).to.eql([]);
		});

		it('no matches returns empty set', function () {
			expect(Hours.filter(datetimes, {number:0, now:now})).to.eql([]);
		});

		it('for dates that end up with the same hour mask, return the oldest', function () {
			var filtered = Hours.filter(datetimes, {number:2, now:now});
			expect(filtered.length).to.equal(2);
			expect(filtered[0].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1, hour: 0}).toString()
			),
		  expect(filtered[1].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1, hour: 1, minute: 0}).toString()
			);
		});

		it('for current hour, return it', function () {
      var filtered = Hours.filter(datetimes, {number:1, now:now});
      expect(filtered.length).to.equal(1);
      expect(filtered[0].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1, hour: 1, minute: 0, seconds: 0, milliseconds: 0}).toString()
      );
		})

		it('test matching some but not all', function () {
      var filtered = Hours.filter(datetimes, {number:4, now:now});
      expect(filtered.length).to.equal(3);
		})

		it('test matching more', function () {
      var filtered = Hours.filter(datetimes, {number:5, now:now});
      expect(filtered.length).to.equal(4);
      var filtered = Hours.filter(datetimes, {number:6, now:now});
      expect(filtered.length).to.equal(4);
		})
	 })
  }) // Hours

	describe('Days', function () {

    var now = moment.utc({year: 2000, month:0, day:1, hour:1, minute:1, second:1, millisecond:1})
    var datetimes = [
      moment.utc({year: 2000, month:0,  day:1,  hour:1 }),
      moment.utc({year: 2000, month:0,  day:1,         }),
      moment.utc({year: 1999, month:11, day:31, hour:23,  minute:59,  second:59,  millisecond:999}),
      moment.utc({year: 1999, month:11, day:30 }),
      moment.utc({year: 1999, month:11, day:28 }),
    ]

	
	 describe('start', function () {
     it("should throw an error if no number if provided to filter", function () {
       var fn = function () { Days.start(); };
       expect(fn).to.throw(/Missing or Invalid number/i);
     });

			it("Should return starting dt `number`-1 of units before now", function () {
				var startMoment =	Days.start({ now:now, number: 8});
				expect(startMoment.toString()).to.equal(
					moment.utc({year: 1999, month: 11, day: 25}).toString()
				);
			});
	 });

		describe('mask', function () {
			it('should mask days', function () {
				expect(Days.mask(
						moment.utc({ year: 1999, month: 11, day:31, hour:23, minute: 59, seconds: 59, milliseconds: 999})
					).toString()).to.equal(
						moment.utc({ year: 1999, month: 11, day:31}).toString()
			 );
			});
	  })	

   describe('filter', function () {

		it('should keep future datetimes', function () {
			var datetimes = [
					moment.utc({year: 2010, month: 0, day: 15}), // Wikipedia
			];

			expect(Days.filter(datetimes, {number:0, now:now})).to.eql(datetimes);
		});

		it('no input returns empty set', function () {
			expect(Days.filter([], {number:0, now:now})).to.eql([]);
		});

		it('no matches returns empty set', function () {
			expect(Days.filter(datetimes, {number:0, now:now})).to.eql([]);
		});

		it('for dates that end up with the same day mask, return the oldest', function () {
			var filtered = Days.filter(datetimes, {number:2, now:now});
			expect(filtered.length).to.equal(2);
			expect(filtered[0].toString()).to.equal(
        moment.utc({year: 1999, month:11, day:31, hour:23,  minute:59,  second:59,  millisecond:999}).toString()
			),
		  expect(filtered[1].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1}).toString()
			);
		});

		it('for current day, return it', function () {
      var filtered = Days.filter(datetimes, {number:1, now:now});
      expect(filtered.length).to.equal(1);
      expect(filtered[0].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1}).toString()
      );
		})

		it('test matching some but not all', function () {
      var filtered = Days.filter(datetimes, {number:4, now:now});
      expect(filtered.length).to.equal(3);
		})

		it('test matching more', function () {
      var filtered = Days.filter(datetimes, {number:5, now:now});
      expect(filtered.length).to.equal(4);
      var filtered = Days.filter(datetimes, {number:6, now:now});
      expect(filtered.length).to.equal(4);
		})
	 })
  }) // Days

	
	describe('Weeks', function () {

    var now = moment.utc({year: 2000, month:0, day:1, hour:1, minute:1, second:1, millisecond:1})
    var datetimes = [
      moment.utc({year: 2000, month:0,  day:1,  hour:1 }),
      moment.utc({year: 2000, month:0,  day:1,         }),
      moment.utc({year: 1999, month:11, day:31, hour:23,  minute:59,  second:59,  millisecond:999}),
      moment.utc({year: 1999, month:11, day:18 }),
      moment.utc({year: 1999, month:11, day:4 }),
    ]

	
	 describe('start', function () {
     it("should throw an error if no number if provided to filter", function () {
       var fn = function () { Weeks.start(); };
       expect(fn).to.throw(/Missing or Invalid number/i);
     });

			it("Should return starting dt `number`-1 of units before now", function () {
				var startMoment =	Weeks.start({ now:now, number: 2});
				expect(startMoment.toString()).to.equal(
					moment.utc({year: 1999, month: 11, day: 25}).toString()
				);
			});
	 });

		describe('mask', function () {
			it('should mask weeks', function () {
			  var dt =	moment.utc({ year: 1999, month: 11, day:31}); // A Friday
        expect(dt.day()).to.equal(5);

        // Default firstweekday is a Saturday
				expect(Weeks.mask(dt).toString()).to.equal(
						moment.utc({ year: 1999, month: 11, day:25}).toString()
			 );
			});
	  })	

   describe('filter', function () {

		it('should keep future datetimes', function () {
			var datetimes = [
					moment.utc({year: 2010, month: 0, day: 15}), // Wikipedia
			];

			expect(Weeks.filter(datetimes, {number:0, now:now})).to.eql(datetimes);
		});

		it('no input returns empty set', function () {
			expect(Weeks.filter([], {number:0, now:now})).to.eql([]);
		});

		it('no matches returns empty set', function () {
			expect(Weeks.filter(datetimes, {number:0, now:now})).to.eql([]);
		});

		it('for dates that end up with the same week mask, return the oldest', function () {
			var filtered = Weeks.filter(datetimes, {number:2, now:now});
			expect(filtered.length).to.equal(2);
			expect(filtered[0].toString()).to.equal(
        moment.utc({year: 1999, month:11, day:31, hour:23,  minute:59,  second:59,  millisecond:999}).toString()
			),
		  expect(filtered[1].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1, hour: 0}).toString()
			);
		});

		it('for current week, return it', function () {
      var filtered = Weeks.filter(datetimes, {number:1, now:now});
      expect(filtered.length).to.equal(1);
      expect(filtered[0].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1}).toString()
      );
		})

		it('test matching some but not all', function () {
      var filtered = Weeks.filter(datetimes, {number:4, now:now});
      expect(filtered.length).to.equal(3);
		})

		it('test matching more', function () {
      var filtered = Weeks.filter(datetimes, {number:5, now:now});
      expect(filtered.length).to.equal(4);
      var filtered = Weeks.filter(datetimes, {number:6, now:now});
      expect(filtered.length).to.equal(4);
		})
	 })
  }) // Weeks

	describe('Months', function () {

    var now = moment.utc({year: 2000, month:1, day:1, hour:1, minute:1, second:1, millisecond:1})
    var datetimes = [
      moment.utc({year: 2000, month:1,  day:1 }),
      moment.utc({year: 2000, month:0,  day:1, hour:1 }),
      moment.utc({year: 2000, month:0,  day:1 }),
      moment.utc({year: 1999, month:11, day:31, hour:23,  minute:59,  second:59,  millisecond:999}),
      moment.utc({year: 1999, month:9, day:1 }),
    ]

	
	 describe('start', function () {
     it("should throw an error if no number if provided to filter", function () {
       var fn = function () { Months.start(); };
       expect(fn).to.throw(/Missing or Invalid number/i);
     });

			it("Should return starting dt `number`-1 of units before now", function () {
				var startMoment =	Months.start({ now:now, number: 2});
				expect(startMoment.toString()).to.equal(
					moment.utc({year: 2000, month: 0}).toString()
				);
			});
	 });

		describe('mask', function () {
			it('should mask months', function () {
			  var dt =	moment.utc({ year: 1999, month: 11, day:31});
				expect(Months.mask(dt).toString()).to.equal(
						moment.utc({ year: 1999, month: 11}).toString()
			 );
			});
	  })	

   describe('filter', function () {

		it('should keep future datetimes', function () {
			var datetimes = [
					moment.utc({year: 2010, month: 0, day: 15}), // Wikipedia
			];

			expect(Months.filter(datetimes, {number:0, now:now})).to.eql(datetimes);
		});

		it('no input returns empty set', function () {
			expect(Months.filter([], {number:0, now:now})).to.eql([]);
		});

		it('no matches returns empty set', function () {
			expect(Months.filter(datetimes, {number:0, now:now})).to.eql([]);
		});

		it('for dates that end up with the same month mask, return the oldest', function () {
			var filtered = Months.filter(datetimes, {number:2, now:now});
			expect(filtered.length).to.equal(2);
			expect(filtered[0].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1}).toString()
			),
		  expect(filtered[1].toString()).to.equal(
				moment.utc({year: 2000, month: 1, day: 1}).toString()
			);
		});

		it('for current month, return it', function () {
      var filtered = Months.filter(datetimes, {number:1, now:now});
      expect(filtered.length).to.equal(1);
      expect(filtered[0].toString()).to.equal(
				moment.utc({year: 2000, month: 1}).toString()
      );
		})

		it('test matching some but not all', function () {
      var filtered = Months.filter(datetimes, {number:4, now:now});
      expect(filtered.length).to.equal(3);
		})

		it('test matching more', function () {
      var filtered = Months.filter(datetimes, {number:5, now:now});
      expect(filtered.length).to.equal(4);
      var filtered = Months.filter(datetimes, {number:6, now:now});
      expect(filtered.length).to.equal(4);
		})
	 })
  }) // Months

	describe('Years', function () {

    var now = moment.utc({year: 2000, month:1, day:1, hour:1, minute:1, second:1, millisecond:1})
    var datetimes = [
      moment.utc({year: 2000, month:0,  day:1, hour:1 }),
      moment.utc({year: 2000, month:0,  day:1 }),
      moment.utc({year: 1999, month:11, day:31, hour:23,  minute:59,  second:59,  millisecond:999}),
      moment.utc({year: 1998, month:0  }),
      moment.utc({year: 1996, month:0  }),
    ]

	
	 describe('start', function () {
     it("should throw an error if no number if provided to filter", function () {
       var fn = function () { Years.start(); };
       expect(fn).to.throw(/Missing or Invalid number/i);
     });

			it("Should return starting dt `number`-1 of units before now", function () {
				var startMoment =	Years.start({ now:now, number: 2});
				expect(startMoment.toString()).to.equal(
					moment.utc({year: 1999, month: 0}).toString()
				);
			});
	 });

		describe('mask', function () {
			it('should mask years', function () {
			  var dt =	moment.utc({ year: 1999, month: 11, day:31});
				expect(Years.mask(dt).toString()).to.equal(
						moment.utc({ year: 1999 }).toString()
			 );
			});
	  })	

   describe('filter', function () {

		it('should keep future datetimes', function () {
			var datetimes = [
					moment.utc({year: 2010, month: 0, day: 15}), // Wikipedia
			];

			expect(Years.filter(datetimes, {number:0, now:now})).to.eql(datetimes);
		});

		it('no input returns empty set', function () {
			expect(Years.filter([], {number:0, now:now})).to.eql([]);
		});

		it('no matches returns empty set', function () {
			expect(Years.filter(datetimes, {number:0, now:now})).to.eql([]);
		});

		it('for dates that end up with the same mask, return the oldest', function () {
			var filtered = Years.filter(datetimes, {number:2, now:now});
      //filtered.map(function (dt) { console.log(dt.toString()); });
			expect(filtered.length).to.equal(2);
			expect(filtered[0].toString()).to.equal(
        moment.utc({year: 1999, month:11, day:31, hour:23,  minute:59,  second:59,  millisecond:999}).toString()
			),
		  expect(filtered[1].toString()).to.equal(
				moment.utc({year: 2000, month: 0, day: 1}).toString()
			);
		});

		it('for current year, return it', function () {
      var filtered = Years.filter(datetimes, {number:1, now:now});
      expect(filtered.length).to.equal(1);
      expect(filtered[0].toString()).to.equal(
				moment.utc({year: 2000}).toString()
      );
		})

		it('test matching some but not all', function () {
      var filtered = Years.filter(datetimes, {number:4, now:now});
      expect(filtered.length).to.equal(3);
		})

		it('test matching more', function () {
      var filtered = Years.filter(datetimes, {number:5, now:now});
      expect(filtered.length).to.equal(4);
      var filtered = Years.filter(datetimes, {number:6, now:now});
      expect(filtered.length).to.equal(4);
		})
	 })
  })

});
