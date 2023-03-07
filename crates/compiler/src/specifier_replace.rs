use crate::optionts::CompileOptions;
use crate::resolve::{resolve_file, resolve_package, resolve_path};
use std::path::PathBuf;
use std::sync::Arc;

use swc_core::ecma::utils::StmtOrModuleItem;
use swc_core::{
  base::{Compiler, SwcComments},
  common::{
    errors::{Handler, HANDLER},
    input::{self, StringInput},
    source_map::SourceMapGenConfig,
    util::take::Take,
    BytePos, FileName, Globals, LineCol, Mark, SourceMap, DUMMY_SP, GLOBALS,
  },
  ecma::{
    ast::*,
    codegen::{text_writer::JsWriter, Config, Emitter},
    parser::{lexer::Lexer, EsConfig, Parser, Syntax, TsConfig},
    transforms::base::{
      helpers::{Helpers, HELPERS},
      resolver,
    },
    utils::{prepend_stmts, StmtLike},
    visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith},
  },
};

pub struct SpecifierReplace {
  pub specifiers: Vec<String>,
  pub file_name: PathBuf,
  pub options: CompileOptions,
}

impl VisitMut for SpecifierReplace {
  fn visit_mut_import_decl(&mut self, import_decl: &mut ImportDecl) {
    // let src = self
    //   .resolver
    //   .resolve_import(&self.base, &import_decl.src.value)
    //   .with_context(|| format!("failed to resolve import `{}`", i.src.value))
    //   .unwrap();

    let specifier = import_decl.src.value.to_string();
    import_decl.src.raw = None;
    import_decl.src.value = resolve_path(
      &self.file_name.to_str().unwrap(),
      &specifier,
      &self.options
    ).unwrap().to_str().unwrap().into()
  }
}

pub fn specifier_replace(source_code: &str, file_name: &str, options: &CompileOptions) -> String {
  let file_name_for_source_map = FileName::Real(file_name.into());
  let source_map: Arc<SourceMap> = Default::default();
  let comments = SwcComments::default();
  let fm = source_map.new_source_file(file_name_for_source_map.clone(), source_code.into());

  let lexer = Lexer::new(
    Syntax::Es(EsConfig {
      jsx: true,
      fn_bind: true,
      decorators: true,
      decorators_before_export: true,
      export_default_from: true,
      import_assertions: true,
      allow_super_outside_method: true,
      allow_return_outside_function: true,
    }),
    EsVersion::latest(),
    StringInput::from(&*fm),
    Some(&comments),
  );

  let mut parser = Parser::new_from(lexer);

  let options = options.clone();
  let mut parsed_program = parser.parse_module().unwrap();
  let mut cjs = SpecifierReplace {
    specifiers: vec![],
    file_name: PathBuf::from(file_name),
    options: options,
  };

  parsed_program.visit_mut_with(&mut as_folder(&mut cjs));

  println!("path is {:?}", &cjs.specifiers);

  let mut buf = vec![];
  let mut emitter = Emitter {
    cfg: Config {
      minify: false,
      ..Default::default()
    },
    cm: source_map.clone(),
    comments: Some(&comments),
    wr: JsWriter::new(source_map.clone(), "\n", &mut buf, None),
  };

  emitter.emit_module(&parsed_program).unwrap();
  String::from_utf8(buf).unwrap()
}

#[cfg(test)]
mod tests {
  use crate::optionts::CompileOptions;

use super::specifier_replace;
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
    let file_name = &format!("{}/{}", current_dir, "__tests__/fixtures/import-esm-pkg.ts");
    let source = &fs::read_to_string(file_name).unwrap();

    let compileOptions = CompileOptions {
      extensions: EXTENSIONS.clone(),
      conditions: CONDITIONS.clone(),
      cwd: TEST_DIR.to_string(),
    };

    let esm_code = specifier_replace(source, file_name.as_str(), &compileOptions);
    println!("esm_code is {}", esm_code);
  }
}
