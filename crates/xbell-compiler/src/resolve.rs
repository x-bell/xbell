use crate::optionts::CompileOptions;
use crate::utils::is_relative_path;
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

pub fn resolve_file(importer: &str, specifier: &str, options: &CompileOptions) -> PathBuf {
    if is_relative_path(specifier) {
        return resolve_relative_path(importer, specifier, options);
    }

    panic!("Not resolved path \"{}\" in \"{}\"", specifier, importer);
}

#[cfg(test)]
mod tests {
    use super::resolve_file;
    use crate::optionts::CompileOptions;
    use std::env;

    #[test]
    fn with_ext() {
        let current_dir = env::current_dir().unwrap();
        let current_dir = current_dir.to_str().unwrap();
        let options = CompileOptions {
            conditions: vec![
                ".ts".into(),
                ".tsx".into(),
                ".js".into(),
                "cjs".into(),
                ".mjs".into(),
                ".jsx".into(),
            ],
            extensions: vec![],
        };
        let specifier = "./crates/xbell-compiler/fixtures/condition-require.js";
        let ret = resolve_file(current_dir, specifier, &options);

        let final_relative_path = ret.to_str().unwrap().replace(current_dir, ".");
        assert_eq!(specifier, final_relative_path);
    }

    #[test]
    fn no_ext() {
        let current_dir = env::current_dir().unwrap();
        println!("current_dir is {}", current_dir.to_str().unwrap());

        let current_dir = current_dir.to_str().unwrap();
        let options = CompileOptions {
            extensions: vec![
                ".ts".into(),
                ".tsx".into(),
                ".js".into(),
                "cjs".into(),
                ".mjs".into(),
                ".jsx".into(),
            ],
            conditions: vec![],
        };

        let specifier = "./crates/xbell-compiler/fixtures/condition-require";
        let specifier_with_ext = specifier.to_string() + ".js";
        let ret = resolve_file(current_dir, specifier, &options);

        let final_relative_path = ret.to_str().unwrap().replace(current_dir, ".");
        assert_eq!(specifier_with_ext, final_relative_path);
    }
}
