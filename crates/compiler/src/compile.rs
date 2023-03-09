use crate::cjs_to_esm::cjs_to_esm;
use crate::replace_specifier::replace_specifier;
use crate::optionts::CompileOptions;
use std::sync::Arc;

use swc_core::ecma::visit::FoldWith;
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

  let mut parser = Parser::new_from(lexer);

  let module = parser.parse_module().unwrap();
  let module = module.fold_with(&mut replace_specifier(&file_name, &options));
  let module = module.fold_with(&mut cjs_to_esm(&file_name));

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
