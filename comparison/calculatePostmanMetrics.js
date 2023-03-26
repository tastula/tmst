// Copy this into each Postman request's tests. It will check the status code
// (actual test) and update metrics into global variables (wanted effect).

function calculateAvg(values) {
  return values.reduce((sum, value) => sum + value) / values.length;
}

function calculateStd(values, avg) {
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2));
  return Math.sqrt(calculateAvg(squareDiffs));
}

// A unique ID for saving request metrics
const testId = "get";

pm.test("Successful request", function () {
  pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);

  const arrayNameTimes = testId + "ResponseTimes";
  const arrayNameAvg = testId + "ResponseAvg";
  const arrayNameStd = testId + "ResponseStd";

  const arrayTimes = globals[arrayNameTimes]
    ? JSON.parse(globals[arrayNameTimes])
    : [];
  arrayTimes.push(pm.response.responseTime);

  const avg = calculateAvg(arrayTimes);
  const std = calculateStd(arrayTimes, avg);
  postman.setGlobalVariable(arrayNameTimes, JSON.stringify(arrayTimes));
  postman.setGlobalVariable(arrayNameAvg, avg);
  postman.setGlobalVariable(arrayNameStd, std);
});
