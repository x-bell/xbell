use crate::constants::NODE_MODULES;
use crate::optionts::CompileOptions;
use crate::package;
use crate::package::Package;
use crate::utils::is_package_exists;
use crate::utils::is_relative_path;
use crate::utils::is_root_dir;
use std::fmt::format;
use std::path::Path;
use std::path::PathBuf;


fn fix_extension(file_path: &Path, options: &CompileOptions) -> PathBuf {
  if file_path.exists() {
    return file_path.canonicalize().unwrap();
  }

  for ext in &options.extensions {
    let mut path_with_ext = String::from(file_path.to_str().unwrap());
    path_with_ext += ext.as_str();

    let path_with_ext = PathBuf::from(path_with_ext);
    if path_with_ext.exists() {
      return path_with_ext.canonicalize().unwrap();
    }
  }

  panic!("File path \"{}\" not found", file_path.display())
}

fn resolve_relative_path(importer: &str, specifier: &str, options: &CompileOptions) -> PathBuf {
  let path = PathBuf::from(importer).join(specifier);
  let path_with_ext = fix_extension(&path, options);

  path_with_ext
}

pub fn resolve_file(importer: &str, specifier: &str, options: &CompileOptions) -> Option<PathBuf> {
  if is_relative_path(specifier) {
    return Some(resolve_relative_path(importer, specifier, options));
  }

  None
}

pub fn resolve_package(package_name: &str, options: &CompileOptions) -> Option<PathBuf> {
  let cwd = PathBuf::from(&options.cwd);
  let mut curr_dir = cwd.clone();
  while !is_root_dir(&curr_dir)
    && !is_package_exists(&curr_dir, package_name)
  {
    curr_dir.pop();
  }

  if is_package_exists(&curr_dir, package_name) {
    let package_dir = curr_dir.join(
      format!("{}/{}", NODE_MODULES, package_name)
    );
    return Package::new(&package_dir).get_entry(&vec![]);
  }

  None
}

#[cfg(test)]
mod resolve_file_tests {
  use super::resolve_file;
  use crate::optionts::CompileOptions;
  use lazy_static::lazy_static;
  use std::env;

  lazy_static! {
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
  fn with_ext() {
    let options = CompileOptions {
      conditions: vec![],
      extensions: EXTENSIONS.clone(),
      cwd: TEST_DIR.clone(),
    };

    let specifier = "./fixtures/condition-require.js";
    let ret = resolve_file(TEST_DIR.as_str(), specifier, &options).unwrap();

    let final_relative_path = ret.to_str().unwrap().replace(TEST_DIR.as_str(), ".");
    assert_eq!(specifier, final_relative_path);
  }

  #[test]
  fn no_ext() {
    let options = CompileOptions {
      extensions: EXTENSIONS.clone(),
      conditions: vec![],
      cwd: TEST_DIR.to_string(),
    };

    let specifier = "./fixtures/condition-require";
    let specifier_with_ext = specifier.to_string() + ".js";
    let ret = resolve_file(&TEST_DIR, specifier, &options).unwrap();

    let final_relative_path = ret.to_str().unwrap().replace(TEST_DIR.as_str(), ".");
    assert_eq!(specifier_with_ext, final_relative_path);
  }
}

#[cfg(test)]
mod resolve_package_tests {
  use super::resolve_package;
  use crate::optionts::CompileOptions;
  use lazy_static::lazy_static;
  use std::{env, path::PathBuf};

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
  fn test_main_field_with_scope() {
    let entry = resolve_package(
      "@scope/main-field",
      &CompileOptions {
        extensions: EXTENSIONS.clone(),
        conditions: CONDITIONS.clone(),
        cwd: TEST_DIR.to_string(),
      },
    ).unwrap();

    let expected_entry = PathBuf::from(TEST_DIR.as_str()).join("node_modules/@scope/main-field/index.js");
    assert_eq!(entry, expected_entry);
  }

  #[test]
  fn test_main_field_without_scope() {
    let entry = resolve_package(
      "main-field",
      &CompileOptions {
        extensions: EXTENSIONS.clone(),
        conditions: CONDITIONS.clone(),
        cwd: TEST_DIR.to_string(),
      },
    ).unwrap();

    let expected_entry = PathBuf::from(TEST_DIR.as_str()).join("node_modules/main-field/index.js");
    assert_eq!(entry, expected_entry);
  }
}
