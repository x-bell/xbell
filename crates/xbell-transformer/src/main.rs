use std::{future::Future, sync::Arc};

use swc_core::{
    base::SwcComments,
    common::{
        errors::{Handler, HANDLER},
        input::StringInput,
        source_map::SourceMapGenConfig,
        BytePos, FileName, Globals, LineCol, Mark, SourceMap, GLOBALS,
    },
    ecma::{
        ast::{EsVersion, Program},
        parser::{lexer::Lexer, EsConfig, Parser, Syntax, TsConfig},
        transforms::base::{
            helpers::{Helpers, HELPERS},
            resolver,
        },
        visit::VisitMutWith,
    },
};

fn main() {
    println!("Hello, world!");
}
