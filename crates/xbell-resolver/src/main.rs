use xbell_resolver::package::{Package};
use std::path::Path;
use std::fs;

fn main() {
    let package_dir = Path::new(
        "",
    ).canonicalize().unwrap();
    let package = Package::new(&package_dir);
    match &package.entry_path {
        Some(package_entry_path) => {
            let content = fs::read(&package_entry_path).unwrap();
            let str = String::from_utf8(content).unwrap();
            println!("pkg entry_path content is {:?}", str);
        },
        _ => {},
    }

    println!("pkg entry_path is {:?}", &package.entry_path);
    println!("pkg is_esm is {:?}", package.is_esm);
}
