use std::{fs::{self, File}, io::{self, Read, Write}, path::{Path}};

fn main() {
    let dir_path = Path::new("a");
    let is_existed = dir_path.exists();
    dir_path.is_symlink();
    if !is_existed {
        match fs::create_dir(dir_path) {
            Err(why) => println!("! {:?}", why.kind()),
            Ok(_) => {},
        }
    }
}
