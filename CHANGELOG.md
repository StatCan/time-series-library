# Changelog

## [2.6.0] - 2019-06-19

### Added
- Added biMonthly() and triAnnual() functions.
- Added generateBiMonthly() and generateTriAnnual() functions.

### Chanegd
- Allow other arguments to map, reduce, and filter functions.

### Fixed
- Fixed handling of dates to be compatible with all time zones. 

## [2.5.4] - 2019-06-10
### Changed
- Removed 'v' character from vector identifiers.

## [2.5.3] - 2019-06-04
### Changed
- Fixed computation of last frequency chunk for annual conversions.

## [2.5.2] - 2019-05-29
### Changed
- Frequecy conversions to annual are now always fixed to the last reference 
period of each year.

## [2.5.1] - 2019-05-28
### Changed
- Replaced references to tetra-annual to quinquennial.

## [2.5.0] - 2019-05-28
### Added
- Added values() function.
- Added user defined convertToFrequency() function.
- Added semiAnnual() frequency conversion function.
- Added biAnnual() frequency conversion function.
- Added tetraAnnual() frequency conversion function.
- Added min and max modes for frequency conversion functions.

### Changed
- Frequnecy conversion functions now start from the lastest reference period 
and progress in descending order of time.

## [2.4.0] - 2019-05-24
### Added
- Added vector generation functions.
- Same period previous year transformation function.

### Changed
- Corrected implementation of same period previous year functions.

## [2.3.0] - 2019-04-11
### Added
- Added weekly() function.
- Added quarterly() alias to quarter().
- Added json() function.
- Added map() function.
- Added find() function.

## [2.2.0] - 2019-02-20
### Added
- Added quarter() function.

## [2.1.0] - 2019-02-07
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