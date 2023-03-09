use crate::optionts::CompileOptions;
use crate::resolve::{resolve_path};
use std::path::PathBuf;

use swc_core::{
  ecma::{
    ast::*,
    visit::{as_folder, Fold, VisitMut},
  },
};

pub struct SpecifierReplace {
  pub specifiers: Vec<String>,
  pub file_name: PathBuf,
  pub options: CompileOptions,
}

impl VisitMut for SpecifierReplace {
  fn visit_mut_import_decl(&mut self, import_decl: &mut ImportDecl) {
    let specifier = import_decl.src.value.to_string();
    import_decl.src.raw = None;
    import_decl.src.value = resolve_path(
      &self.file_name.to_str().unwrap(),
      &specifier,
      &self.options
    ).unwrap().to_str().unwrap().into()
  }
}

pub fn replace_specifier(file_name: &str, options: &CompileOptions) -> impl Fold + VisitMut {
  as_folder(SpecifierReplace {
    specifiers: vec![],
    file_name: PathBuf::from(file_name),
    options: options.clone(),
  })
}

#[cfg(test)]
mod tests {
  use crate::optionts::CompileOptions;
  use crate::compile::compile;
// use super::specifier_replace;
  use std::{env, fs};

  use lazy_static::lazy_static;

  lazy_static! {
    static ref CONDITIONS: Vec<String> = vec![];

    static ref EXTENSIONS: Vec<String> = vec![".ts", ".tsx", ".js", "cjs", ".mjs", ".jsx"]
      .iter()
      .map(|ext| ext.to_string())
      .collect();

    static ref TEST_DIR: String = env::current_dir()
      .unwrap()
      .join("__tests__")
      .canonicalize()
      .unwrap()
      .to_str()
      .unwrap()
      .to_string();
  }

  #[test]
  fn it_works() {
    let current_dir = env::current_dir().unwrap();
    let current_dir = current_dir.to_str().unwrap();
    let file_name = format!("{}/{}", current_dir, "__tests__/fixtures/import-esm-pkg.ts");
    let source = fs::read_to_string(file_name.clone()).unwrap();

    let compile_options = CompileOptions {
      extensions: EXTENSIONS.clone(),
      conditions: CONDITIONS.clone(),
      cwd: TEST_DIR.to_string(),
    };

    let esm_code = compile(source, file_name, compile_options);
    println!("esm_code is {}", esm_code);
  }
}
