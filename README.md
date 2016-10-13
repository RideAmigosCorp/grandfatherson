# Grandfatherson

GrandFatherSon is a backup rotation calculator that implements the
[grandfather-father-son rotation scheme](http://en.wikipedia.org/wiki/Backup_rotation_scheme#Grandfather-father-son_backup).

This is usually done by keeping a certain number of daily, weekly, and
monthly backups. Older backups should be removed to reduce the amount
of space used.

## Usage


```javascript
      var gfs = require('grandfatherson');

      var dates_to_delete = gfs.to_delete(datetimes, {
           days   : 7,
           weeks  : 4,
           months : 6,
           years  : 2,
           firstweekday : 6,

      });
```

## Functions

### to_delete(datetimes, options)

```javascript
     var condemed = gfs.to_delete(allDaysin1999, {
        days:7,
        weeks:4,
        months:3,
        firstweekday:SATURDAY,
        now:moment.utc('1999-12-31')
     })
```

 * `datetimes` is required array of dates to consider. They may be JavaScript objects, [Moment](http://momentjs.com) objects, or strings that be parsed by either. Non-UTC timestamps are not supported by may work.
 * `options` required object specifying dates you want to *keep* , keys include:
   * `days`: Number of most recent days to keep. Defaults to 0
   * `weeks` : Number of most recent one-per-week dates to keep. Defaults to 0.
   * `months` : Number of most recent one-per-month dates to keep. Defaults to 0.
   * `years`  : Number of most recent one-per-year dates to keep. Defaults to 0.
   * `hours`  : Number of most recent one-per-hour dates to keep. Defaults to 0.
   * `now` : The date to use as 'now' when calculating 'recent'. All "future" dates after this moment are kept. Expected to be a moment object. Defaults to the current moment.
   * `firstweekday` The first day of the week to consider when calculating weekly dates to keep. Defaults to Saturday. Valid values are 0-6 (Sunday-Saturday)

You provide details of dates you want to keep and `to_delete` returns a filtered list of the dates with dates-to-keep removed. The values in the returned array are moment objects sorted from oldest to newest.

### to_keep(datetimes, options)

The same as `to_delete` above, but returning the array of dates to keep instead of the dates to delete.

## How it works

A pass is made over the array of dates for each time scale you want to work with, and the backups to keep are calculated for each time scale.

Backups from the future are always kept. If there are duplicate backups at the same time scale, the older backups is kept.

Once all the passes have been made, the final set to keep is the union of all the sets of backups from each time scale.

The backups to delete are simply calculated by removing the backups to keep from the total set.

## Example

Say you have daily backups from every day in 1999 and today is the last day of year. You'd like to keep daily
backups for the last 7 days, weekly backups for the last 4 weeks, monthly backups for the last 3 months, and
you want the `firstweekday` to be considered Saturday, because you run full backups on that day.

Here you can see the backups that we would calculate *to_keep*. If you used *to_delete* instead, the result
be all the dates in 1999 expect these dates.

```javascript
  const SATURDAY = 6;

  var survivors = to_keep(allDaysin1999, {days:7, weeks:4, months:3, firstweekday:SATURDAY, now:moment.utc('1999-12-31')})

  // The result be as follows.
  survivors = [
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
```

The above example is tested in the test suite.

## Time zone handling

Incoming dates are always passed to 'moment.utc()`. If your timestamps are not in UTC, you could carefully
check that the results are what you expect. There is no test coverage for not UTC time stamps.


## Author

Mark Stosberg <mark@rideamigos.com>

## Contributing

Bug fixes, doc improvements and extra test coverage are welcome. Be prepared to implement feature requests yourself.

## Thanks

This is heavily inspired from the Python [grandfatherson](https://github.com/ecometrica/grandfatherson) module by
Simon Law and Rory Geoghegan.

## License

grandfatherson is distributed under the BSD 3 clause lisence. See the
LICENSE file for more details.
