# TUNE Reporting SDK for Node
# Dockerfile for Jenkins CI
# Update:  $Date: 2015-04-17 16:00:00 $

FROM docker-dev.ops.tune.com/itops/base_centos6:latest

MAINTAINER jefft@tune.com

# EPEL (Extra Packages for Enterprise Linux) repository that
# is available for CentOS and related distributions.

RUN yum -y update && \
    yum -y install tar && \
    yum -y clean all

## Dependency Installation
RUN curl -sL https://rpm.nodesource.com/setup | bash - && \
  yum install -y which redhat-lsb-core wget nodejs gcc-c++ make kernel-devel
  
# Install Node.js and npm
RUN     yum install -y npm
RUN     yum install -y nodejs

RUN npm --version

RUN node --version

RUN npm install

## Make company standard paths
RUN mkdir -p /data/tune-reporting-node && \
  mkdir -p /var/has/data/tune-reporting-node
  
COPY . /data/tune-reporting-node

RUN ls -al

ENV APPLICATION_MODE all
ENV NODE_ENV test
ENV TUNE_REPORTING_API_KEY demoadv

WORKDIR /data/tune-reporting-node

CMD ["env", "./node_modules/.bin/mocha"]