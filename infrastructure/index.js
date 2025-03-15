const AWS = require("aws-sdk");
const lightsail = new AWS.Lightsail();
exports.handler = async () => {
  await lightsail.rebootInstance({ instanceName: "next-app-instance" }).promise();
  return { status: "Instance rebooted" };
};
