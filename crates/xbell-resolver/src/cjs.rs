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

    fn visit_mut_call_expr(&mut self, call_expr: &mut CallExpr) {
        let CallExpr {
            callee,
            args,
            ..
        } = call_expr;
        // let a = &**callee;
        match callee {
            Callee::Expr(ref mut expr) => {
                match **expr {
                    Expr::Ident(ref mut id) => {
                        if id.sym == *"require" {
                            match &*args[0].expr {
                                Expr::Lit(lit) => {
                                    match lit {
                                        Lit::Str(s) => {
                                            id.sym = "require_commonjs".into();
                                            self.paths.push(
                                                s.value.to_string()
                                            );
                                        },
                                        _ => {}
                                    }
                                },
                                _ => {},
                            }
                        }
                    },
                    _ => {}
                }
            },
            _ => {}
        }
        call_expr.visit_mut_children_with(self);
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
            Ok(mut parsed_program) => {
                let mut cjs = Cjs {
                    paths: vec![],
                };
                parsed_program.visit_mut_with(&mut as_folder(&mut cjs));

                println!("path is {:?}", &cjs.paths);

                let mut buf = vec![];
                {
                    let mut emitter = Emitter {
                        cfg: Config {
                            minify: false,
                            ..Default::default()
                        },
                        cm: source_map.clone(),
                        comments: Some(&comments),
                        wr: JsWriter::new(source_map.clone(), "\n", &mut buf, None),
                    };

                    emitter.emit_program(&parsed_program).unwrap();
                }

                println!("{}", String::from_utf8(buf).expect("non-utf8?"));
            },
            _ => {}
        }
    }
    
}
