const errorMiddleware = ((err, req, res, next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "internal server error"
  
    res.status(statusCode).json({
      success: false,
      statusCode,
      message
    })
  })
  
  
  const customError = (statusCode, message) => {
    const error = new Error()
    error.statusCode = statusCode
    error.message = message
    return error 
  }
  
module.exports = {errorMiddleware, customError}