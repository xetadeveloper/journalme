export function serverErrorFound(res, err, errMessage) {
  console.log("Error occured in server operation:");
  res.send({ error: true, errorMessage: errMessage, httpServerError: true });
}
