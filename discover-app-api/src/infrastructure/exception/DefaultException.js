"use strict";

const { ERROR_CODE, ERROR_TYPE, ERROR_MESSAGE } = require('../../infrastructure/utilities/Constants');


class DefaultException {
  constructor(exception) {
    this.code = ERROR_CODE.DEFAULT;
    this.type = ERROR_TYPE.DEFAULT;
    this.message =ERROR_MESSAGE.DEFAULT;
    this.exception=exception;
  }
}

module.exports = DefaultException;