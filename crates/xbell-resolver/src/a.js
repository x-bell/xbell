import _Users_lianghang_Desktop_git_xbell_packages_bundless_src_resolve_ts from "__xbell_asset_prefix__/@fs//Users/lianghang/Desktop/git/xbell/packages/bundless/src/resolve.ts";
import _Users_lianghang_Desktop_git_xbell_packages_bundless_src_constants_ts from "__xbell_asset_prefix__/@fs//Users/lianghang/Desktop/git/xbell/packages/bundless/src/constants.ts";
const module = {
  exports: {},
};
let flag = false;
function origin() {
  const a = true
    ? _Users_lianghang_Desktop_git_xbell_packages_bundless_src_resolve_ts(
        "./resolve.ts"
      )
    : _Users_lianghang_Desktop_git_xbell_packages_bundless_src_constants_ts(
        "./constants.ts"
      );
  module.exports = {
    a: a,
    b: "bb",
  };
}
function exe() {
  if (!flag) origin();
  flag = true;
  return {
    default: module.exports,
    ...module.exports,
  };
}
export default exe;
