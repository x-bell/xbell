use std::path::Path;

use crate::constants::NODE_MODULES;

pub fn is_relative_path(specifier: &str) -> bool {
  specifier.starts_with(".")
}

pub fn is_absolute_path(specifier: &str) -> bool {
  specifier.starts_with("/")
}

pub fn is_root_dir(path: &Path) -> bool {
  path.to_str() == Some("/")
}

pub fn is_package_exists(cwd: &Path, package_name: &str) -> bool {
  let package_dir = cwd.join(format!("{}/{}", NODE_MODULES, package_name));
  println!("==debug:package_dir:{}==", package_dir.to_str().unwrap());
  package_dir.exists()
}

pub struct PackageSpecifierParsed {
  pub package_name: String,
  pub sub_path: Option<String>,
}

pub fn parse_package_specifier(specifier: &str) -> PackageSpecifierParsed {
  let mut path_list: Vec<&str> = specifier.split("/").collect();
  let scope_name_or_package_name = path_list.remove(0);

  let package_name = if scope_name_or_package_name.starts_with('@') {
    format!("{}/{}", scope_name_or_package_name, path_list.remove(0))
  } else {
    String::from(scope_name_or_package_name)
  };

  let sub_path = if path_list.len() > 0 {
    Some(path_list.join("/"))
  } else {
    None
  };

  PackageSpecifierParsed {
      package_name,
      sub_path,
  }

}

#[cfg(test)]
mod tests {
  use std::path::PathBuf;
  use std::env;

  use lazy_static::lazy_static;

  use super::{is_relative_path, is_root_dir, is_package_exists};

  lazy_static! {
    static ref TEST_DIR: PathBuf = env::current_dir()
      .unwrap()
      .join("__tests__")
      .canonicalize()
      .unwrap();
  }

  #[test]
  fn test_is_root_dir() {
    assert!(is_root_dir(&PathBuf::from("/")));
    assert!(!is_root_dir(&PathBuf::from("/dir")));
    assert!(!is_root_dir(&PathBuf::from("/dir/sub-dir")));
    assert!(!is_root_dir(&PathBuf::from("/dir/file.js")));
  }

  #[test]
  fn test_is_relative_path() {
    assert!(is_relative_path("./path"));
    assert!(is_relative_path("./path.js"));
    assert!(!is_relative_path("path"));
    assert!(!is_relative_path("@scope/path"));
    assert!(!is_relative_path("node:path"));
  }

  #[test]
  fn test_is_package_exists() {
    assert!(
      is_package_exists(
        &TEST_DIR,
        "@scope/main-field"
      )
    );

    assert!(
      is_package_exists(
        &TEST_DIR,
        "main-field"
      )
    );
  }
}
