use crate::analyzer::Analyzer;
use crate::cjs_to_esm::cjs_to_esm;
use crate::constants::NODE_MODULES;
use crate::optionts::CompileOptions;
use crate::replace_specifier::replace_specifier;
use std::collections::HashMap;
use std::option;
use std::sync::Arc;
use swc_core::ecma::visit::{as_folder, FoldWith, VisitWith};
use swc_core::{
  base::SwcComments,
  common::{input::StringInput, FileName, SourceMap},
  ecma::{
    ast::*,
    codegen::{text_writer::JsWriter, Config, Emitter},
    parser::{lexer::Lexer, EsConfig, Parser, Syntax},
  },
};

#[napi]
pub fn compile(source_code: String, file_name: String, options: CompileOptions) -> String {
  let file_name_for_source_map = FileName::Real(file_name.clone().into());
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
  let is_in_cwd = file_name.contains(&options.cwd);
  let is_in_node_modules = file_name.contains(&NODE_MODULES);
  let mut analyzer = Analyzer::new(&file_name.clone(), &options);
  let mut parser = Parser::new_from(lexer);
  let module = parser.parse_module().unwrap();
  let file_info = analyzer.get_import_map(&module);

  module.visit_with(&mut analyzer);

  let module = module.fold_with(&mut replace_specifier(&file_name, &options));
  let is_esm_file = file_info.has_exports || options.is_callback_function || (is_in_cwd && !is_in_node_modules);
  let module = if is_esm_file {
    module
  } else {
    module.fold_with(&mut cjs_to_esm(&file_name, &options))
  };

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
}

// #[cfg(test)]
// mod compile_tests {
//   use crate::{compile, optionts::CompileOptions};
//   use lazy_static::lazy_static;

//   lazy_static! {
//     static ref CONDITIONS: Vec<String> = vec!["import".into(), "default".into()];

//     static ref EXTENSIONS: Vec<String> = vec![".ts", ".tsx", ".js", "cjs", ".mjs", ".jsx"]
//       .iter()
//       .map(|ext| ext.to_string())
//       .collect();
//   }
// }
