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
        ast::*,
        codegen::{text_writer::JsWriter, Config, Emitter},
        parser::{lexer::Lexer, EsConfig, Parser, Syntax, TsConfig},
        transforms::base::{
            helpers::{Helpers, HELPERS},
            resolver,
        },
        visit::{VisitMut, VisitMutWith,noop_visit_mut_type},
    },
};

pub struct Cjs {
    paths: Vec<String>,
}

impl VisitMut for Cjs {
    noop_visit_mut_type!();

    fn visit_mut_call_expr(&mut self, CallExpr { callee, args, .. }: &mut CallExpr) {
        // let a = &**callee;
        match &callee {
            Callee::Expr(expr) => {
                match &**expr {
                    Expr::Ident(id) => {
                        if id.sym == *"require" {
                            match &*args[0].expr {
                                Expr::Lit(lit) => {
                                    match lit {
                                        Lit::Str(s) => {
                                            self.paths.push(
                                                s.value.to_string()
                                            );
                                        },
                                        _ => {}
                                    }
                                },
                                _ => {}
                            }
                        }
                    },
                    _ => {}
                }
            },
            _ => {}
        }
    }
}

#[cfg(test)]
mod tests {
    use super::Cjs;
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
            ast::*,
            codegen::{text_writer::JsWriter, Config, Emitter},
            parser::{lexer::Lexer, EsConfig, Parser, Syntax, TsConfig},
            transforms::base::{
                helpers::{Helpers, HELPERS},
                resolver,
            },
            visit::{VisitMut, VisitMutWith,as_folder,},
        },
    };

    #[test]
    fn it_works() {
        let source = r#"
const a = true ? require("./a1") : require('./a2')
module.exports = {
    a: a,
    b: 'bb'
};
        "#;

        let file_name = FileName::Custom("test.js".into());
        let source_map: Arc<SourceMap> = Default::default();
        let comments = SwcComments::default();
        let fm = source_map.new_source_file(file_name.clone(), source.into());

        let lexer = Lexer::new(
            Syntax::Es(EsConfig {
                jsx: true,
                fn_bind: true,
                decorators: true,
                decorators_before_export: true,
                export_default_from: true,
                import_assertions: true,
                allow_super_outside_method: true,
                allow_return_outside_function: true,
            }),
            EsVersion::latest(),
            StringInput::from(&*fm),
            Some(&comments),
        );

        let mut parser = Parser::new_from(lexer);

        match parser.parse_program() {
            Ok(mut program) => {
                let mut cjs = Cjs {
                    paths: vec![],
                };
                program.visit_mut_with(&mut as_folder(&mut cjs));
                println!("path is {:?}", &cjs.paths);
            },
            _ => {}
        }
    }
    
}
