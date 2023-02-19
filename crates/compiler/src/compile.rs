
use crate::optionts::{CompileOptions};
use crate::cjs::{cjs_to_esm};


#[napi]
pub fn compile(source_code: String, file_name: String) -> String {
  // let options: CompileOptions = serde_wasm_bindgen::from_value(options).unwrap();
  if file_name.contains("node_modules") {
    let cjs_code = cjs_to_esm(&source_code, &file_name);
    return cjs_code
  }

  source_code
}
