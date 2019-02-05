# Changelog

## [2.1.0] - Unreleased
### Added
- Added sum() function.
- Added average() function.
- Added reduce() function.
- Added operate() function.
- Added annual() function.
- Added monthly() function.

## [2.0.0] - 2019-01-22
### Added
- Added Vector class. Most functions are now functions of this class.
- latestN() function.
- get() function.
- value() function.
- refper() function.
- Support for Internet Explorer 11.

### Changed
- VectorLib was seperated into Vector and VectorLib.
- round() and roundBankers() now return a new vector and no longer operate in 
place.
- Vectors will now always use date objects internally instead of date strings.
- Vectors use local dates for reference periods instead of UTC.

### Removed
- Bulk intersection function from VectorLib. This has been replaced by the 
intersection function of Vector.

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