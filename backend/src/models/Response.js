class Response {
  constructor(statusCode, status, message, result) {
    this.statusCode = statusCode;
    this.message = message;
    this.result = result;
  }
}
module.exports = { Response };
