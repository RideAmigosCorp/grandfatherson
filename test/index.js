"use strict"

var moment = require('moment');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var gfs = require('../index');


const SATURDAY = 6;

// As a test data set, generate all the dates from 1999
var allDaysin1999 = [];
var begin1999 = moment.utc('1999-01-01');

for (var day = 0; day < 365; day++) {
  allDaysin1999.push(
    begin1999.clone().add(day,'days')
  );
}

describe('grandfatherson', function () {

  var lastDayof1999 =  moment.utc('1999-12-31');

  it("reality-check last day of 1999", function () {
    expect(_.last(allDaysin1999).toString()).to.equal(
      lastDayof1999.toString()
    );
  });

  function _toString (dt) {
    return dt.toString()
  }

  describe('to_keep', function () {
      var to_keep = gfs.to_keep;

      // Simulate it being the last day of the year
     var survivors = to_keep(allDaysin1999, {days:7, weeks:4, months:3, firstweekday:SATURDAY, now:lastDayof1999})

     var expectedDates = [
        moment.utc('1999-10-01'),
        moment.utc('1999-11-01'),
        moment.utc('1999-12-01'),
        moment.utc('1999-12-04'),
        moment.utc('1999-12-11'),
        moment.utc('1999-12-18'),
        moment.utc('1999-12-25'),
        moment.utc('1999-12-26'),
        moment.utc('1999-12-27'),
        moment.utc('1999-12-28'),
        moment.utc('1999-12-29'),
        moment.utc('1999-12-30'),
        moment.utc('1999-12-31')
      ];

			it("should correctly handle {days:7, weeks:4, months:3, firstweekday:SATURDAY, now:lastDayof1999}", function () {
	      expect(survivors.map(_toString)).to.eql(expectedDates.map(_toString));
			});
  });

  describe('to_delete', function () {
      var to_delete = gfs.to_delete;
    
     // Simulate it being the last day of the year
     var condemned = to_delete(allDaysin1999, {days:7, weeks:4, months:3, firstweekday:SATURDAY, now:lastDayof1999})


    it("should return the original set missing the ones that to_keep would return", function () {
        expect(allDaysin1999).to.have.length(365);
        // We see above that 13 records were kept and we know there are 365 days in the year
        expect(condemned.length).to.equal(365-13);
    });
  });

});



