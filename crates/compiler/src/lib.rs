#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

mod package;
mod cjs_to_esm;
mod resolve;
mod utils;
mod optionts;
mod replace_specifier;
mod compile;
mod constants;
mod analyzer;

pub use self::compile::{compile};

