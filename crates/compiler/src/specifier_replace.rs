use crate::resolve::{resolve_file};
use std::path::PathBuf;

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
}

impl VisitMut for SpecifierReplace {
  fn visit_mut_import_decl(&mut self, import_decl: &mut ImportDecl) {

    // import_decl.src.value
  }
}
