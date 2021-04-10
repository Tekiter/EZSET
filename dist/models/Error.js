"use strict";

class handleError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = { handleError };
//# sourceMappingURL=Error.js.map