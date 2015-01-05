#!/usr/bin/env node
/**
 * AdvertiserReportCohortBase.js, Abstract class for Advertiser Report Cohort.
 *
 * @module tune-reporting
 * @submodule endpoints
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2015 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2015-01-05 10:18:08 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */

// Dependencies
var
  InvalidArgument = require('../../helpers').InvalidArgument,
  TuneSdkError = require('../../helpers').TuneSdkError,
  TuneServiceError = require('../../helpers').TuneServiceError,
  _ = require('underscore'),
  util = require('util'),
  prettyjson = require('prettyjson'),
  AdvertiserReportBase = require('./AdvertiserReportBase');


/**
 * Base class intended for gathering from Advertiser Insights reports.
 * @uses LTV
 * @uses Retention
 *
 * @class AdvertiserReportCohortBase
 * @extends AdvertiserReportBase
 * @constructor
 *
 * @param string controller           TUNE Advertiser Report endpoint name.
 * @param bool   filterDebugMode      Remove debug mode information from results.
 * @param bool   filterTestProfileId  Remove test profile information from results.
 */
function AdvertiserReportCohortBase(
  controller,
  filterDebugMode,
  filterTestProfileId
) {
  AdvertiserReportCohortBase.super_.call(
    this,
    controller,
    filterDebugMode,
    filterTestProfileId
  );
}

// Inherit the prototype methods from one constructor into another.
// The prototype of constructor will be set to a new object created from
// superConstructor.
util.inherits(AdvertiserReportCohortBase, AdvertiserReportBase);

/**
 * @var array Available choices for Cohort intervals.
 *
 * @property COHORT_INTERVALS
 *
 * @type array
 * @static
 * @final
 */
AdvertiserReportCohortBase.COHORT_INTERVALS = [
  'year_day',
  'year_week',
  'year_month',
  'year'
];

/**
 * Validate cohort interval.
 *
 * @method validateCohortInterval
 * @protected
 *
 * @param string cohortInterval
 *
 * @return {String}
 */
AdvertiserReportCohortBase.prototype.validateCohortInterval = function (cohortInterval) {
  if (!_.isString(cohortInterval) || (0 === cohortInterval.length)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "cohortInterval" provided type: "%s"', cohortInterval)
    );
  }

  cohortInterval = cohortInterval.trim().toLowerCase();

  if (!_.contains(AdvertiserReportCohortBase.COHORT_INTERVALS, cohortInterval)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "cohortInterval" provided choice: "%s"', cohortInterval)
    );
  }

  return cohortInterval;
};

/**
 * @var array Available choices for Cohort types.
 *
 * @property COHORT_TYPES
 *
 * @type array
 * @static
 * @final
 */
AdvertiserReportCohortBase.COHORT_TYPES = [
  'click',
  'install'
];

/**
 * Validate cohort type.
 *
 * @method validateCohortType
 * @protected
 *
 * @param string cohortType
 *
 * @return {String}
 */
AdvertiserReportCohortBase.prototype.validateCohortType = function (cohortType) {
  if (!_.isString(cohortType) || (0 === cohortType.length)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "cohortType" provided type: "%s"', cohortType)
    );
  }

  cohortType = cohortType.trim().toLowerCase();

  if (!_.contains(AdvertiserReportCohortBase.COHORT_TYPES, cohortType)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "cohortType" provided choice: "%s"', cohortType)
    );
  }

  return cohortType;
};

/**
 * @var array Available choices for Aggregation types.
 *
 * @property AGGREGATION_TYPES
 *
 * @type array
 * @static
 * @final
 */
AdvertiserReportCohortBase.AGGREGATION_TYPES = [
  'incremental',
  'cumulative'
];

/**
 * Validate aggregation type.
 *
 * @method validateAggregationType
 * @protected
 *
 * @param string aggregationType
 *
 * @return {String}
 */
AdvertiserReportCohortBase.prototype.validateAggregationType = function (aggregationType) {
  if (!_.isString(aggregationType) || (0 === aggregationType.length)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "aggregationType" provided type: "%s"', aggregationType)
    );
  }

  aggregationType = aggregationType.trim().toLowerCase();

  if (!_.contains(AdvertiserReportCohortBase.AGGREGATION_TYPES, aggregationType)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "aggregationType" provided choice: "%s"', aggregationType)
    );
  }

  return aggregationType;
};

/**
 * Counts all existing records that match filter criteria
 * and returns an array of found model data.
 *
 * @method count
 *
 * @param string startDate        YYYY-MM-DD HH:MM:SS
 * @param string endDate          YYYY-MM-DD HH:MM:SS
 * @param string cohortType       Cohort types: click, install
 * @param string cohortInterval   Cohort intervals: year_day, year_week, year_month, year
 * @param string group             Group results using this endpoint's fields.
 * @param string filter            Apply constraints based upon values associated with
 *                                this endpoint's fields.
 * @param string strResponseTimezone Setting expected timezone for results,
 *                                default is set in account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
AdvertiserReportCohortBase.prototype.count = function (
  startDate,
  endDate,
  cohortType,
  cohortInterval,
  group,
  filter,
  strResponseTimezone,
  callback
) {
  // Required parameters
  this.validateDateTime('start_date', startDate);
  this.validateDateTime('end_date', endDate);

  cohortType = this.validateCohortType(cohortType);
  cohortInterval = this.validateCohortInterval(cohortInterval);
  group = this.validateGroup(group);

  // Optional parameters
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (strResponseTimezone) {
    strResponseTimezone = this.validateResponseTimezone(strResponseTimezone);
  }

  var
    mapQueryString = {
      'start_date': startDate,
      'end_date': endDate,
      'group': group,
      'filter': filter,
      'cohort_type': cohortType,
      'cohortInterval': cohortInterval,
      'response_timezone': strResponseTimezone
    },
    count_request = this.requestRecords(
      'count',
      mapQueryString
    );

  // Success event response
  count_request.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  count_request.once('error', function onError(response) {
    callback(response, null);
  });
};

/**
 * Query status of insight reports. Upon completion will
 * return url to download requested report.
 *
 * @method statusReport
 *
 * @param string jobId      Provided Job Identifier to reference
 *                          requested report on export queue.
 * @param object callback   Error-first Callback.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
AdvertiserReportCohortBase.prototype.statusReport = function (
  jobId,
  callback
) {
  var status_request = this._statusReport(
    this.getController(),
    'status',
    jobId
  );

  // Success event response
  status_request.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  status_request.once('error', function onError(response) {
    callback(response, null);
  });
};

/**
 * Helper function for parsing export status response to gather report jobId.
 *
 * @method parseResponseReportJobId
 *
 * @param response
 *
 * @return {String} Report URL for download.
 * @throws InvalidArgument
 * @throws TuneServiceError
 */
AdvertiserReportCohortBase.prototype.parseResponseReportJobId = function (
  response
) {
  if (!response) {
    throw new TuneServiceError("Parameter 'response' is not defined.");
  }
  var
    data = response.getData(),
    jobId;

  if (!data) {
    throw new TuneServiceError(
      util.format('Report request failed to get export data, response: "%s"', response.toString())
    );
  }

  if (!data.hasOwnProperty('job_id')) {
    throw new TuneServiceError(
      util.format(
        'Export data response does not contain "job_id": response: "%s"',
        prettyjson.render(data, {}, 2)
      )
    );
  }

  jobId = data.job_id;
  if (!_.isString(jobId) || (0 === jobId.length)) {
    throw new TuneSdkError(
      util.format('Report request failed return "job_id": "%s"', response.toString())
    );
  }

  return jobId;
};

/**
 * Helper function for parsing export status response to gather report url.
 *
 * @method parseResponseReportUrl
 *
 * @param TuneManagementResponse response
 *
 * @return {String} Report job identifier within export queue.
 * @throws InvalidArgument
 * @throws TuneServiceError
 */
AdvertiserReportCohortBase.prototype.parseResponseReportUrl = function (
  response
) {
  if (!response) {
    throw new TuneServiceError("Parameter 'response' is not defined.");
  }
  var
    data = response.getData(),
    report_url;

  if (!data) {
    throw new TuneServiceError(
      util.format(
        'Report request failed to get export data, response: "%s"',
        response.toString()
      )
    );
  }

  if (!data.hasOwnProperty('url')) {
    throw new TuneServiceError(
      util.format(
        'Export data response does not contain "url": response: "%s"',
        prettyjson.render(data, {}, 2)
      )
    );
  }

  report_url = data.url;

  if (!_.isString(report_url) || (0 === report_url.length)) {
    throw new TuneSdkError(
      util.format('Report request failed return report_url: "%s"', response.toString())
    );
  }
  return report_url;
};

module.exports = AdvertiserReportCohortBase;