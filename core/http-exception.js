/**
 * Create by Zeffon on 2020/10/3
 */

class HttpException extends Error {
  errorCode = 9999
  statusCode = 500
  message = ''

  constructor(errorCode, message, statusCode) {
      super()
      this.message = message;
      this.errorCode = errorCode;
      this.statusCode = statusCode;
  }
}

export {
  HttpException
}