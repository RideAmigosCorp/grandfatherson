

 * Added .drone.yml
 * Drop support for Node < 8

## [1.1.1] - 2016-10-24

### Bug Fixes

 * toKeep array could have contained duplicate entries if dates matched multiple filters.

## [1.1.0] - 2016-10-18

### Behavior change

 * Default value of `now` was changed to match the timestamp of the most recent backup. This is safer, erring on the side of retaining more data. See README for details.

### Documentation

 * Document was improved to explain in more detail how the calculations work

## [1.0.0] - 2016-10-18

### Incompatible Changes

 * Renamed `to_keep` to `toKeep` and `to_delete`  to `toDelete` to be consistent with JavaScript conventions. The original "snake-cased" names came from the original Python project.

## [0.1.3] - 2016-10-14

No Code Changes.

### Internals

 * Added .travis.yml file

## [0.1.2] - 2016-10-13

No code changes.

### Internals

 * Removed commented-out code

## [0.1.1] - 2016-10-13

No code changes.

### Internals

 * Added Github repository to package.json

## [0.1.0] - 2016-10-13

Initial Release.
