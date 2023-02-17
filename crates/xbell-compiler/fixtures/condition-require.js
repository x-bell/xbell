const a = true ? require("./resolve.ts") : require("./constants.ts");
module.exports = {
  a: a,
  b: "bb",
};
