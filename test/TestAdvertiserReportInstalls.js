#!/usr/bin/env node
// define global objects:
/*global describe, before, it*/

// define jslint-options:
/* jshint -W030 -W036 */

/**
 * Tests of TUNE Reporting API
 *
 * @module tune-reporting
 * @submodule test
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2014 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-18 14:57:59 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

require('../lib/helpers/Date');

var
  tuneReporting = require('../lib'),
  AdvertiserReportInstalls = tuneReporting.api.AdvertiserReportInstalls,
  EndpointBase = tuneReporting.base.endpoints.EndpointBase,
  expect = require('chai').expect;

describe('test AdvertiserReportInstalls', function () {
  this.timeout(10000);
  var
    endpointAdvertiserReportInstalls,
    apiKey,
    csvJobId,
    startDate = new Date().setYesterday().setStartTime().getIsoDateTime(),
    endDate = new Date().setYesterday().setEndTime().getIsoDateTime(),
    strResponseTimezone = 'America/Los_Angeles',
    fieldsRecommended = null;

  before(function () {
    apiKey = process.env.API_KEY;
    endpointAdvertiserReportInstalls = new AdvertiserReportInstalls(
      apiKey
    );
  });

  it('fields recommended', function (done) {
    var fields_request = endpointAdvertiserReportInstalls.getFields(
      EndpointBase.TUNE_FIELDS_RECOMMENDED
    );
    fields_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result).to.be.a('array');
      fieldsRecommended = result;
      done();
    });

    fields_request.on('error', function onError (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('count', function (done) {
    var count_request = endpointAdvertiserReportInstalls.count(
      startDate,
      endDate,
      null,                                           // filter
      strResponseTimezone
    );
    count_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);
      var count = result.getData();
      expect(count).least(0);
      done();
    });

    count_request.on('error', function onError (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('find', function (done) {
    var find_request = endpointAdvertiserReportInstalls.find(
      startDate,
      endDate,
      fieldsRecommended,
      null,                                           // filter
      5,                                              // limit
      null,                                           // page
      { 'created': 'DESC' },                          // sort
      strResponseTimezone
    );
    find_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);
      done();
    });

    find_request.on('error', function onError (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('exportCsvReport', function (done) {
    var export_request = endpointAdvertiserReportInstalls.exportReport(
      startDate,
      endDate,
      fieldsRecommended,
      null,                                           // filter
      'csv',                                          // format
      strResponseTimezone
    );
    export_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);

      csvJobId = endpointAdvertiserReportInstalls.parseResponseReportJobId(result);
      expect(csvJobId).to.be.a('string');
      expect(csvJobId).to.be.not.empty;
      done();
    });

    export_request.on('error', function onError (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('statusCsvReport', function (done) {
    var status_request = endpointAdvertiserReportInstalls.statusReport(
      csvJobId
    );
    status_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);
      done();
    });

    status_request.on('error', function onError (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  //it('fetchCsvReport', function (done) {
  //  var status_request = endpointAdvertiserReportInstalls.fetchReport(
  //    csvJobId
  //  );
  //  status_request.on('success', function onSuccess (result) {
  //    expect(result).to.be.not.null;
  //    expect(result.getData()).to.be.not.null;
  //    expect(result.getErrors()).to.be.null;
  //    expect(result.getHttpCode()).eql(200);
  //
  //    var csvReportUrl
  //      = endpointAdvertiserReportInstalls.parseResponseReportUrl(result);
  //    expect(csvReportUrl).to.be.not.null;
  //    expect(csvReportUrl).to.be.a('string');
  //    expect(csvReportUrl).to.be.not.empty;
  //    done();
  //  });
  //
  //  status_request.on('error', function onError (error) {
  //    expect(error).to.be.not.null;
  //    done(error);
  //  });
  //});
});