# Changelog

## [2.0.0] - Unreleased
### Added
- latestN() function.
- get() function.
- value() function.
- refper() function.
- length() function.
- Support for Internet Explorer 11.

### Changed
- round() and roundBankers() now return a new vector and no longer operate in 
place.
- Vectors will now always use date objects internally instead of date strings.

## [1.3.0] - 2018-12-27
### Added
- periodTransformation() function.
- samePeriodPreviousYearPercentageChange() function.
- samePeriodPreviousYearDifference function().
- annualize() function.

### Changed 
- Intersection of vectors is now applied before any vector operation.

## [1.2.0] - 2018-12-11
### Added
- range() function.

## [1.1.0] - 2018-11-27
### Added
- Period-to-period difference and percentage change functions.
- filter() function.
- Default and Banker's rounding algorithms.