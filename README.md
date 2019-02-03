# grandfatherson

grandfatherson is a backup rotation calculator that implements the
[grandfather-father-son rotation scheme](http://en.wikipedia.org/wiki/Backup_rotation_scheme#Grandfather-father-son_backup).

This is usually done by keeping a certain number of daily, weekly, and
monthly backups. Older backups should be removed to reduce the amount
of space used.

## Usage


```javascript
      var gfs = require('grandfatherson');

      var datesToDelete = gfs.toDelete(datetimes, {
           days   : 7,
           weeks  : 4,
           months : 6,
           years  : 2,
           firstweekday : 6,

      });
```

## Functions

### toDelete(datetimes, options)

```javascript
     var condemned = gfs.toDelete(allDaysin1999, {
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
   * `now` : The date to use as 'now' when calculating 'recent'. All "future" dates after this moment are kept. Expected to be a moment object. Defaults to the timestamp of the newest backup.
   * `firstweekday` The first day of the week to consider when calculating weekly dates to keep. Defaults to Saturday. Valid values are 0-6 (Sunday-Saturday)

You provide details of dates you want to keep and `toDelete` returns a filtered list of the dates with dates-to-keep removed. The values in the returned array are moment objects sorted from oldest to newest.


### toKeep(datetimes, options)

The same as `toDelete` above, but returning the array of dates to keep instead of the dates to delete.

## How it works

A pass is made over the array of dates for each time scale you want to work with, and the backups to keep are calculated for each time scale.

Backups from the future are always kept. If there are duplicate backups at the same time scale, the older backups is kept.

Once all the passes have been made, the final set to keep is the union of all the sets of backups from each time scale.

The backups to delete are simply calculated by removing the backups to keep from the total set.

### Backups kept on are based on the the date range, not necessarily the number.

When set you `days:7`, you are expressing to keep up to 7 backups for the last 7 days. All backups older than 7 days would be deleted, no matter how few
backups you happen to have in the last 7 days.

If there are gaps in your backups, this logic is *not* the same as "keep 7 daily backups". We make this
safer in case your backups are interrupted by calculating 'now' from the most recent backup.  More on that below.

### Backups to keep start with the current unit of time.

If 'now' is set to the current moment and you say you want to keep `days: 3`, we will keep backups
for TODAY and the two days previous. (NOT yesterday and the two days previous). The same works for the current unit of time.

### Calculating `now`: Backups to delete are calculated from the newest backup.

For safety, the default value of 'now' we use is the timestamp of the newest backup.

If you are making snapshots every day and pruning them later the same day, this produces exactly the same result as setting the default value of 'now' to the current moment when rotating daily backups.

However, if you happen to expire your daily snapshots *before*  making your daily snapshots, this default value will provide you one more backup rather than one less. Consider a plan
to set `days:7`. If `now` were set to the current date and the backup for today hadn't been generated, you would be pruning to 6 daily backups until the backup runs later in the day.
Since we default to setting `now` to the newest backup-- yesterdays-- we would retain 7 backups when pruning. When the backup ran later in the day, you would have 8 until the next
pruning happenings.

Also consider a case where you are backing up daily and want to keep 7 daily backups. There's a problem with the backups running and backups are offline for a week. If we used the current moment to calculate how many days of backups to keep, all the daily backups would be deleted after 7 days of backups being offline. But if 'now' were set to the date of the newest backup, you would always have the 7 most recent backups.

You can set 'now' to `moment.utc()` if you want prioritize making sure your backups are always being deleted on time and are prepared for the risk of data loss if your backup cycles don't get run but your snapshot expiration cycles do!

## Example

Say you have daily backups from every day in 1999 and today is the last day of year. You'd like to keep daily
backups for the last 7 days, weekly backups for the last 4 weeks, monthly backups for the last 3 months, and
you want the `firstweekday` to be considered Saturday, because you run full backups on that day.

Here you can see the backups that we would calculate *toKeep*. If you used *toDelete* instead, the result
be all the dates in 1999 expect these dates.

```javascript
  const SATURDAY = 6;

  var survivors = toKeep(allDaysin1999, {days:7, weeks:4, months:3, firstweekday:SATURDAY, now:moment.utc('1999-12-31')})

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

Incoming dates are always passed to `moment.utc()`. If your timestamps are not in UTC, you could carefully
check that the results are what you expect. There is no test coverage for not UTC time stamps.

## Node versions supported

Currently Node > 4.4.x is supported.

## Author

Mark Stosberg <mark@rideamigos.com>

## Contributing

Bug fixes, doc improvements and extra test coverage are welcome. Be prepared to implement feature requests yourself.

## Thanks

This is heavily inspired from the Python [grandfatherson](https://github.com/ecometrica/grandfatherson) module by
Simon Law and Rory Geoghegan.

## License

grandfatherson is distributed under the BSD 3 clause lisence. See the
[LICENSE](./LICENSE) file for more details.
