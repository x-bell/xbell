use serde::{Deserialize, Serialize};
use std::{
    collections::{BTreeMap},
    fs::{self},
    path::{Path, PathBuf},
};
use crate::{resolve::fix_extension, optionts::CompileOptions};
use crate::constants::{DEFAULT_CONDITION};

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
    pub dir: PathBuf,
}

impl Package {
    pub fn new(package_dir: &Path) -> Package {
        let package_json = PackageJson::new(package_dir);
        let is_esm = package_json.is_esm();
        Package {
            dir: package_dir.to_path_buf(),
            package_json,
            is_esm,
        }
    }

    fn parse_exports(
        &self,
        exports: &ExportsField,
        conditions: &Vec<String>,
    ) -> Option<PathBuf> {
        match exports {
            ExportsField::Map(map) => {
                let target_condition = conditions
                    .iter()
                    .find(|&condition| map.contains_key(condition));
                match target_condition {
                    Some(condition) => {
                        let inner_map = map.get(condition).unwrap();
                        self.parse_exports(inner_map, conditions)
                    }
                    None => None,
                }
            }
            ExportsField::Path(path) => Some(self.dir.join(path).canonicalize().unwrap()),
        }
    }

    fn get_sub_path_by_exports(
        &self,
        exports: &ExportsField,
        sub_path: &str,
        conditions: &Vec<String>,
    ) -> Option<PathBuf> {
        match exports {
            ExportsField::Map(map) => {
                let vec = Vec::from_iter(map.iter());
                for (key, value) in vec {
                    if key == sub_path {
                        return self.parse_exports(value, conditions);
                    }
                }

                self.parse_exports(exports, conditions)
            }
            ExportsField::Path(path) => Some(self.dir.join(path).canonicalize().unwrap()),
        }
    }

    pub fn get_entry(&self, compile_options: &CompileOptions) -> Option<PathBuf> {
        let mut conditions: Vec<String> = compile_options.conditions.clone();

        // TODO:
        if !conditions.contains(&DEFAULT_CONDITION.into()) {
            conditions.push(DEFAULT_CONDITION.into());
        }

        if let Some(exports) = &self.package_json.exports {
            return self.get_sub_path_by_exports(exports, ".", &conditions);
        } else if let Some(browser) = &self.package_json.browser {
            let file_name = fix_extension(&self.dir.join(browser), &compile_options.extensions) ;
            return Some(file_name.canonicalize().unwrap());
        } else if let Some(module) = &self.package_json.module {
            let file_name = fix_extension(&self.dir.join(module), &compile_options.extensions) ;
            return Some(file_name.canonicalize().unwrap());
        } else if let Some(main) = &self.package_json.main {
            let file_name = fix_extension(&self.dir.join(main), &compile_options.extensions) ;
            return Some(file_name.canonicalize().unwrap());
        }

        None
    }

    pub fn get_sub_path(&self, sub_path: &str, conditions: &Vec<String>) -> Option<PathBuf> {
        let mut conditions: Vec<String> = conditions.clone();
        let relative_sub_path = format!("./{}", sub_path);

        // TODO:
        if !conditions.contains(&DEFAULT_CONDITION.into()) {
            conditions.push(DEFAULT_CONDITION.into());
        }

        if let Some(exports) = &self.package_json.exports {
            return self.get_sub_path_by_exports(exports, &relative_sub_path, &conditions);
        } else {
            return Some(PathBuf::from(&self.dir).join(sub_path));
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PackageJson {
    name: String,
    version: String,
    main: Option<String>,
    browser: Option<String>,
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

        // println!("path is {:?}", real_link.to_str());
        let content = fs::read_to_string(real_link.join("package.json")).unwrap();
        let package_json: PackageJson = serde_json::from_str(&content).unwrap();
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
}

