const a = true ? require("./resolve.ts") : require("./constants.ts");

module.exports = {
  a: a,
  b: "bb",
};
// let flag = false;
// let value;
// function origin() {
  // import _resolveEXE from '/xx/_resolve.ts'
  // import _constantsEXT from '/xx/_constants.ts'

  // const a = true ? _resolveEXE() : _constantsEXT();


  // module.exports = {
  //   a: a,
  //   b: "bb",
  // };

  // return module.exports;
// }
// function ext () => {
  // if (!flag) {
  //   flag = true;
  //   value = origin();
  // }
  // return value;
// }

// export default exe;


