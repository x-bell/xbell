use crate::analyzer::Analyzer;
use crate::cjs_to_esm::cjs_to_esm;
use crate::constants::NODE_MODULES;
use crate::optionts::CompileOptions;
use crate::replace_specifier::replace_specifier;
use std::sync::Arc;
use swc_core::ecma::parser::TsConfig;
use swc_core::ecma::visit::{FoldWith, VisitWith};
use swc_core::{
  base::SwcComments,
  common::{
    input::StringInput, FileName, Globals, Mark,
    SourceMap, GLOBALS,
  },
  ecma::{
    ast::*,
    codegen::{text_writer::JsWriter, Config, Emitter},
    parser::{lexer::Lexer, Parser, Syntax},
    transforms::react::{react, Options as ReactOptions},
  },
};

#[napi]
pub fn compile(source_code: String, file_name: String, options: CompileOptions) -> String {
  let file_name_for_source_map = FileName::Real(file_name.clone().into());
  let source_map: Arc<SourceMap> = Default::default();
  let comments = SwcComments::default();
  let fm = source_map.new_source_file(file_name_for_source_map.clone(), source_code.into());

  let globals: Globals = Default::default();
  // generate preset mark & helpers
  GLOBALS.set(&globals, || {
      let top_level_mark = Mark::new();
      let lexer = Lexer::new(
        Syntax::Typescript(TsConfig {
          tsx: true, // Enable TSX support
          decorators: true,
          no_early_errors: false,
          ..Default::default()
        }),
        EsVersion::latest(),
        StringInput::from(&*fm),
        Some(&comments),
      );
      let is_in_cwd = file_name.contains(&options.cwd);
      let is_in_node_modules = file_name.contains(&NODE_MODULES);
      let mut analyzer = Analyzer::new(&file_name.clone(), &options);
      let mut parser = Parser::new_from(lexer);
      let module = parser.parse_module().unwrap();
      let file_info = analyzer.get_import_map(&module);
    
      module.visit_with(&mut analyzer);
    
      let module = module.fold_with(&mut replace_specifier(&file_name, &options));
      let is_esm_file =
        file_info.has_exports || options.is_callback_function || (is_in_cwd && !is_in_node_modules);
      let module = if is_esm_file {
        module
      } else {
        module.fold_with(&mut cjs_to_esm(&file_name, &options))
      };
    
      let module = module.fold_with(&mut react(
        source_map.clone(),
        Some(&comments),
        ReactOptions {
          ..Default::default()
        },
        top_level_mark,
      ));
    
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
    
      emitter.emit_module(&module).unwrap();
      String::from_utf8(buf).unwrap()
  })
}

#[cfg(test)]
mod compile_tests {
  use crate::{compile, optionts::CompileOptions};
  use lazy_static::lazy_static;
  use std::env;
  use std::fs;

  lazy_static! {
    static ref CONDITIONS: Vec<String> = vec!["import".into(), "default".into()];
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
  fn it_work_2() {
    let current_dir = env::current_dir().unwrap();
    let current_dir = current_dir.to_str().unwrap();
    let file_name = format!(
      "{}/{}",
      current_dir, "__tests__/fixtures/react-ts/main.tsx"
    );
    let source = fs::read_to_string(file_name.clone()).unwrap();
    let compile_options = CompileOptions {
      extensions: EXTENSIONS.clone(),
      conditions: CONDITIONS.clone(),
      cwd:  TEST_DIR.clone(),
      is_callback_function: false,
    };
    let result = compile(source.into(), file_name.into(), compile_options);
    let expected_result = format!(r#"import React from "/__xbell_prefix__/@fs{}/__tests__/node_modules/react/index.js";
import ReactDOM from "/__xbell_prefix__/@fs{}/__tests__/node_modules/react-dom/client.js";
import App from "/__xbell_prefix__/@fs{}/__tests__/fixtures/react-ts/App.tsx";
import "/__xbell_prefix__/@fs{}/__tests__/fixtures/react-ts/index.css";
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(/*#__PURE__*/ React.createElement(React.StrictMode, null, /*#__PURE__*/ React.createElement(App, null)));
"#, current_dir, current_dir, current_dir, current_dir);
    assert_eq!(result, expected_result);
  }
}
