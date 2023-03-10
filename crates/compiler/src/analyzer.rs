use crate::{
  optionts::CompileOptions,
  resolve::resolve_path,
};
use lazy_static::lazy_static;
use std::sync::Mutex;

use std::{
  collections::HashMap,
  path::{PathBuf},
};
use swc_core::{
  ecma::{
      ast::*,
      visit::{Visit, VisitWith},
  },
};

#[derive(Clone)]
#[derive(Default)]
pub struct FileInfo {
  pub has_exports: bool,
  pub file_name: PathBuf,
  pub imports: Vec<String>,
}

#[derive(Default)]
pub struct Analyzer {
  file_name: PathBuf,
  options: CompileOptions,
  file_info: FileInfo,
}

lazy_static! {
  static ref IMPORT_MAPS: Mutex<HashMap<String, FileInfo>> = Mutex::new(HashMap::new());
}

impl Visit for Analyzer {
  fn visit_import_decl(&mut self, import: &ImportDecl) {
      let specifier = import.src.value.to_string();
      let absolute_path = resolve_path(self.file_name.to_str().unwrap(), &specifier, &self.options);
      if let Some(path) = absolute_path {
          self.file_info.imports.push(path.to_string_lossy().into_owned());
      }
  }

  fn visit_export_all(&mut self, _: &ExportAll) {
      self.file_info.has_exports = true;
  }

  fn visit_named_export(&mut self, _: &NamedExport) {
      self.file_info.has_exports = true;
  }

  fn visit_export_decl(&mut self, _: &ExportDecl) {
      self.file_info.has_exports = true;
  }

  fn visit_export_default_decl(&mut self, _: &ExportDefaultDecl) {
      self.file_info.has_exports = true;
  }

  fn visit_export_default_expr(&mut self, _: &ExportDefaultExpr) {
      self.file_info.has_exports = true;
  }
}

impl Analyzer {
  pub fn new(file_name: &str, options: &CompileOptions) -> Analyzer {
      Analyzer {
          file_name: PathBuf::from(file_name),
          options: options.clone(),
          ..Default::default()
      }
  }

  pub fn get_import_map(&mut self, module: &Module) -> FileInfo {
    let mut import_maps = IMPORT_MAPS.lock().unwrap();
      let file_name = self.file_name.to_string_lossy().into_owned();
      let file_info = import_maps.entry(file_name).or_insert_with(|| {
          module.visit_with(self);
          self.file_info.clone()
      });

      file_info.clone()
  }
}