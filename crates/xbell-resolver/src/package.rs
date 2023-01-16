use serde::{Deserialize, Serialize};
use std::{
    collections::{BTreeMap, HashMap},
    fs::{self, File},
    io::{self, Read, Write},
    path::{Path, PathBuf},
    str::FromStr,
};

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum ExportsField {
    Map(BTreeMap<String, ExportsField>),
    Path(String),
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum TypeField {
    #[serde(rename = "commonjs")]
    CommonJs,
    #[serde(rename = "module")]
    Module,
    Invalid(String),
}

pub struct Package {
    pub package_json: PackageJson,
    pub is_esm: bool,
    pub entry_path: Option<PathBuf>,
}

impl Package {
    pub fn new(package_dir: &Path) -> Package {
        let package_json = PackageJson::new(package_dir);
        let is_esm = package_json.is_esm();
        let entry_path = package_json.get_entry_path(package_dir, &vec!["default"]);
        Package {
            package_json,
            is_esm,
            entry_path,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PackageJson {
    name: String,
    version: String,
    main: Option<String>,
    module: Option<String>,
    #[serde(rename = "type")]
    t: Option<TypeField>,
    exports: Option<ExportsField>,
}

impl PackageJson {
    pub fn new(package_dir: &Path) -> PackageJson {
        let is_symlink = package_dir.is_symlink();
        let real_link_str = if is_symlink {
            let real_link = package_dir.canonicalize().unwrap();
            real_link
        } else {
            PathBuf::from(package_dir)
        };

        let real_link = real_link_str;

        println!("path is {:?}", real_link.to_str());
        let content = fs::read_to_string(real_link.join("package.json")).unwrap();
        let package_json = read_package_json(&content);
        package_json
    }

    pub fn is_esm(&self) -> bool {
        match &self.t {
            Some(t) => match t {
                TypeField::Module => true,
                _ => false,
            },
            _ => false,
        }
    }

    pub fn get_entry_path(&self, package_dir: &Path, conditions: &Vec<&str>) -> Option<PathBuf> {
        match &self.exports {
            Some(exports) => get_sub_path_by_exports(package_dir, exports, ".", &conditions),
            None => None,
        }
    }
}

fn read_package_json(raw_json: &str) -> PackageJson {
    let parsed: PackageJson = serde_json::from_str(raw_json).unwrap();
    return parsed;
}

fn get_sub_path_by_exports(
    package_dir: &Path,
    exports: &ExportsField,
    sub_path: &str,
    conditions: &Vec<&str>,
) -> Option<PathBuf> {
    match exports {
        ExportsField::Map(map) => {
            let vec = Vec::from_iter(map.iter());
            for (key, value) in vec {
                if key == sub_path {
                    return parse_exports(package_dir, value, conditions);
                }
            }

            parse_exports(package_dir, exports, conditions)
        }
        ExportsField::Path(path) => Some(package_dir.join(path).canonicalize().unwrap()),
    }
}

fn parse_exports(
    package_dir: &Path,
    exports: &ExportsField,
    conditions: &Vec<&str>,
) -> Option<PathBuf> {
    match exports {
        ExportsField::Map(map) => {
            let target_condition = conditions
                .iter()
                .find(|&condition| map.contains_key(*condition));
            match target_condition {
                Some(condition) => {
                    let inner_map = map.get(*condition).unwrap();
                    parse_exports(package_dir, inner_map, conditions)
                }
                None => None,
            }
        }
        ExportsField::Path(path) => Some(package_dir.join(path).canonicalize().unwrap()),
    }
}
