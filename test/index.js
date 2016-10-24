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

  describe('toKeep', function () {
      var toKeep = gfs.toKeep;

      // Simulate it being the last day of the year
     var survivors = toKeep(allDaysin1999, {days:8, weeks:4, months:3, firstweekday:SATURDAY, now:lastDayof1999})

     var expectedDates = [
        moment.utc('1999-10-01'),
        moment.utc('1999-11-01'),
        moment.utc('1999-12-01'),
        moment.utc('1999-12-04'),
        moment.utc('1999-12-11'),
        moment.utc('1999-12-18'),
        moment.utc('1999-12-24'),
        moment.utc('1999-12-25'),
        moment.utc('1999-12-26'),
        moment.utc('1999-12-27'),
        moment.utc('1999-12-28'),
        moment.utc('1999-12-29'),
        moment.utc('1999-12-30'),
        moment.utc('1999-12-31')
      ];

      it("should correctly handle {days:8, weeks:4, months:3, firstweekday:SATURDAY, now:lastDayof1999}", function () {
        expect(survivors.map(_toString)).to.eql(expectedDates.map(_toString));
      });
  });

  describe('toDelete', function () {
      var toDelete = gfs.toDelete;

     // Simulate it being the last day of the year
     var condemned = toDelete(allDaysin1999, {days:8, weeks:4, months:3, firstweekday:SATURDAY, now:lastDayof1999})


    it("should return the original set missing the ones that toKeep would return", function () {
        expect(allDaysin1999).to.have.length(365);

        // We see above that 14 records were kept and we know there are 365 days in the year
        expect(condemned.length).to.equal(365-14);
    });
  });

});



