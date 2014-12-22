#!/usr/bin/env node
/**
 * Classes that define advertiser/stats TUNE Advertiser Report endpoints.
 *
 * @module tune-reporting
 * @submodule api
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2014 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-22 13:38:30 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

// Dependencies
var
  util = require('util'),
  AdvertiserReportLogsBase = require('../base/endpoints').AdvertiserReportLogsBase;

/**
 * TUNE Advertiser Report endpoint '/advertiser/stats/postbacks/'.
 *
 * @class AdvertiserReportPostbackLogs
 * @constructor
 * @extends AdvertiserReportLogsBase
 *
 */
function AdvertiserReportPostbackLogs(
  apiKey,
  verifyFields
) {
  AdvertiserReportPostbackLogs.super_.call(
    this,
    "advertiser/stats/postbacks",
    apiKey,
    false,
    true,
    verifyFields
  );
}

util.inherits(AdvertiserReportPostbackLogs, AdvertiserReportLogsBase);

/**
 * Get list of recommended fields for endpoint.
 *
 * @property getFieldsRecommended
 * @protected
 * @return {Array}
 */
AdvertiserReportPostbackLogs.prototype.getFieldsRecommended = function () {
  return [
    'id',
    'stat_install_id',
    'stat_event_id',
    'stat_open_id',
    'created',
    'status',
    'site_id',
    'site.name',
    'site_event_id',
    'site_event.name',
    'site_event.type',
    'publisher_id',
    'publisher.name',
    'attributed_publisher_id',
    'attributed_publisher.name',
    'url',
    'http_result'
  ];
};

module.exports = AdvertiserReportPostbackLogs;