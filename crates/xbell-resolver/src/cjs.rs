use std::fs;
use std::path::Path;

use std::sync::Arc;

use swc_core::{
    base::{Compiler, SwcComments},
    common::{
        errors::{Handler, HANDLER},
        input::{self, StringInput},
        source_map::SourceMapGenConfig,
        BytePos, FileName, Globals, LineCol, Mark, SourceMap, GLOBALS,
    },
    ecma::{
        ast::{EsVersion, Program},
        codegen::{text_writer::JsWriter, Config, Emitter},
        parser::{lexer::Lexer, EsConfig, Parser, Syntax, TsConfig},
        transforms::base::{
            helpers::{Helpers, HELPERS},
            resolver,
        },
        visit::{VisitMutWith,VisitMut},
    },
};

struct CJS;

impl VisitMut for CJS {

}