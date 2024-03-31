"use strict";

class DefaultException {
  constructor(exception) {
    this.code = "API-01-001";
    this.type = "Technical";
    this.message ="An unexpected exception was found in the application. Review details in the log";
    this.exception=exception;
  }
}

module.exports = DefaultException;