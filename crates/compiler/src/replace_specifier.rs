use crate::constants::XBELL_FS_PREFIX;
use crate::optionts::CompileOptions;
use crate::resolve::resolve_path;
use std::path::PathBuf;

use swc_core::common::util::take::Take;
use swc_core::ecma::{
  ast::*,
  visit::{as_folder, Fold, VisitMut},
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
    let importer = self.file_name.to_str().unwrap();

    println!("importer: {}, specifier: {}", importer, specifier);
    let absolute_path = resolve_path(&importer, &specifier, &self.options).unwrap();

    import_decl.src.value = format!("{}{}", XBELL_FS_PREFIX, absolute_path.to_str().unwrap()).into();
  }

  fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
    if n.callee.is_import() {
      // let arg = n.args[0].clone();
      if let Some(arg) = n.args.first_mut() {
        if let Expr::Lit(Lit::Str(specifier)) = &mut *arg.expr {
          if let Some(absolute_path) = resolve_path(
            &self.file_name.to_str().unwrap(),
            &specifier.value,
            &self.options,
          ) {
            let final_specifier = format!("{}{}", XBELL_FS_PREFIX, absolute_path.to_str().unwrap());
            specifier.value = final_specifier.into();
            specifier.raw = None;
          }
        }
      }
    }
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
  use crate::compile::compile;
  use crate::{constants::XBELL_FS_PREFIX, optionts::CompileOptions};
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
  fn import_esm_package() {
    let current_dir = env::current_dir().unwrap();
    let current_dir = current_dir.to_str().unwrap();
    let file_name = format!("{}/{}", current_dir, "__tests__/fixtures/import-esm-pkg.ts");
    let source = fs::read_to_string(file_name.clone()).unwrap();

    let compile_options = CompileOptions {
      extensions: EXTENSIONS.clone(),
      conditions: CONDITIONS.clone(),
      cwd: TEST_DIR.to_string(),
      is_callback_function: false,
    };

    let esm_code = compile(source, file_name, compile_options);
    println!("esm_code is {}", esm_code);
  }

  #[test]
  fn dynamic_import_esm_package() {
    let current_dir = env::current_dir().unwrap();
    let current_dir = current_dir.to_str().unwrap();
    let file_name = format!(
      "{}/{}",
      current_dir, "__tests__/fixtures/dynamic-import-esm-pkg.ts"
    );
    let source = fs::read_to_string(file_name.clone()).unwrap();

    let compile_options = CompileOptions {
      extensions: EXTENSIONS.clone(),
      conditions: CONDITIONS.clone(),
      cwd: TEST_DIR.to_string(),
      is_callback_function: false,
    };

    let esm_code = compile(source, file_name, compile_options);
    let expected_specifier = format!(
      "{}{}/{}",
      XBELL_FS_PREFIX, current_dir, "__tests__/node_modules/exports-field-mjs/main.mjs"
    );
    let expected_esm_code = format!(
      r#"const {{ main  }} = await import("{}");{}"#,
      expected_specifier, "\n"
    );
    assert_eq!(esm_code, expected_esm_code);
  }
}
