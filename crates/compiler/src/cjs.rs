use crate::package;
use std::path::Path;
use std::{fs, path::PathBuf};

use std::sync::Arc;

use swc_core::ecma::utils::StmtOrModuleItem;
use swc_core::{
    base::{Compiler, SwcComments},
    common::{
        errors::{Handler, HANDLER},
        input::{self, StringInput},
        source_map::SourceMapGenConfig,
        util::take::Take,
        BytePos, FileName, Globals, LineCol, Mark, SourceMap, DUMMY_SP, GLOBALS,
    },
    ecma::{
        ast::*,
        codegen::{text_writer::JsWriter, Config, Emitter},
        parser::{lexer::Lexer, EsConfig, Parser, Syntax, TsConfig},
        transforms::base::{
            helpers::{Helpers, HELPERS},
            resolver,
        },
        utils::{prepend_stmts, StmtLike},
        visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith},
    },
};

const XBELL_ASSET_PREFIX: &str = "/__xbell_asset_prefix__";


pub struct Cjs {
    pub specifiers: Vec<String>,
    pub file_name: PathBuf,
}

impl Cjs {
    pub fn get_file_name(&self, specifier: &str) -> PathBuf {
        let mut dirname = PathBuf::from(&self.file_name);
        dirname.pop();

        let filename = PathBuf::from(&dirname);
        let filename = filename.join(specifier);
        // log_many("filename:", filename.to_str().unwrap());
        
        let ret = match fs::canonicalize(filename) {
            Ok(ret) => ret,
            Err(e) => {
                // log_many("error", &e.to_string());
                panic!("{}", e.to_string());
            }
        };
        // log_many("ret:", ret.to_str().unwrap());

        return ret;
    }

    pub fn get_file_name_var(&self, specifier: &str) -> String {
        let filename = self.get_file_name(specifier);
        filename
            .to_str()
            .unwrap()
            .replace("/", "_")
            .replace(".", "_")
    }
}

impl VisitMut for Cjs {
    noop_visit_mut_type!();

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        println!("");
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        for item in &mut *items {
            item.visit_mut_with(self);
        }

        // let items = items.take();

        let cjs_imports = self.specifiers.iter().map(|sepcifier| {
            let file_name = self.get_file_name(sepcifier);
            let file_name_var = self.get_file_name_var(sepcifier);
            // TODO: check packages file alias
            let mut asset_url = String::from(XBELL_ASSET_PREFIX);
            asset_url.push_str("/@fs");
            asset_url.push_str(file_name.to_str().unwrap());

            ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                type_only: false,
                asserts: None,
                specifiers: vec![ImportSpecifier::Default(ImportDefaultSpecifier {
                    span: DUMMY_SP,
                    local: Ident {
                        span: DUMMY_SP,
                        sym: file_name_var.into(),
                        optional: false,
                    },
                })],
                span: DUMMY_SP,
                src: Box::new(Str {
                    value: asset_url.into(),
                    span: DUMMY_SP,
                    raw: None,
                }),
            }))
        });

        let mut prepend_items: Vec<ModuleItem> = cjs_imports.collect();

        prepend_items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                definite: false,
                span: DUMMY_SP,
                name: Pat::Ident(BindingIdent {
                    type_ann: None,
                    id: Ident {
                        span: DUMMY_SP,
                        sym: "module".into(),
                        optional: false,
                    },
                }),
                init: Some(Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(Ident {
                            span: DUMMY_SP,
                            optional: false,
                            sym: "exports".into(),
                        }),
                        value: Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![],
                        })),
                    })))],
                }))),
            }],
        })))));

        prepend_items.push(ModuleItem::Stmt(
            VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Let,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    definite: false,
                    init: Some(Box::new(
                        Bool {
                            span: DUMMY_SP,
                            value: false,
                        }
                        .into(),
                    )),
                    name: BindingIdent {
                        type_ann: None,
                        id: Ident {
                            span: DUMMY_SP,
                            sym: "flag".into(),
                            optional: false,
                        },
                    }
                    .into(),
                }],
            }
            .into(),
        ));

        let stmts = items
            .iter()
            .filter_map(|item| {
                if item.is_stmt() {
                    Some(item.clone().into_stmt().unwrap())
                } else {
                    None
                }
            })
            .collect();

        prepend_items.push(ModuleItem::Stmt(
            FnDecl {
                declare: false,
                ident: Ident {
                    span: DUMMY_SP,
                    optional: false,
                    sym: "origin".into(),
                },
                function: Box::new(Function {
                    params: vec![],
                    decorators: vec![],
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts,
                    }),
                    is_generator: false,
                    is_async: false,
                    type_params: None,
                    return_type: None,
                }),
            }
            .into(),
        ));

        prepend_items.push(ModuleItem::Stmt(
            FnDecl {
                declare: false,
                ident: Ident {
                    span: DUMMY_SP,
                    optional: false,
                    sym: "exe".into(),
                },
                function: Box::new(Function {
                    params: vec![],
                    decorators: vec![],
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![
                            Stmt::If(IfStmt {
                                span: DUMMY_SP,
                                test: Box::new(Expr::Unary(UnaryExpr {
                                    span: DUMMY_SP,
                                    op: UnaryOp::Bang,
                                    arg: Box::new(Expr::Ident(Ident {
                                        span: DUMMY_SP,
                                        sym: "flag".into(),
                                        optional: false,
                                    })),
                                })),
                                alt: None,
                                cons: Box::new(Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr: Box::new(Expr::Call(CallExpr {
                                        span: DUMMY_SP,
                                        args: vec![],
                                        callee: Callee::Expr(Box::new(Expr::Ident(Ident {
                                            span: DUMMY_SP,
                                            optional: false,
                                            sym: "origin".into(),
                                        }))),
                                        type_args: None,
                                    })),
                                })),
                            }),
                            Stmt::Expr(ExprStmt {
                                span: DUMMY_SP,
                                expr: Box::new(Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    op: AssignOp::Assign,
                                    left: PatOrExpr::Expr(Box::new(Expr::Ident(Ident {
                                        span: DUMMY_SP,
                                        optional: false,
                                        sym: "flag".into(),
                                    }))),
                                    right: Box::new(Expr::Lit(Lit::Bool(Bool {
                                        span: DUMMY_SP,
                                        value: true,
                                    }))),
                                })),
                            }),
                            Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(Box::new(Expr::Object(ObjectLit {
                                    span: DUMMY_SP,
                                    props: vec![
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(Ident {
                                                    span: DUMMY_SP,
                                                    optional: false,
                                                    sym: "default".into(),
                                                }),
                                                value: Box::new(Expr::Member(MemberExpr {
                                                    span: DUMMY_SP,
                                                    obj: Box::new(Expr::Ident(Ident {
                                                        span: DUMMY_SP,
                                                        sym: "module".into(),
                                                        optional: false,
                                                    })),
                                                    prop: MemberProp::Ident(Ident {
                                                        span: DUMMY_SP,
                                                        optional: false,
                                                        sym: "exports".into(),
                                                    }),
                                                })),
                                            },
                                        ))),
                                        PropOrSpread::Spread(SpreadElement {
                                            dot3_token: DUMMY_SP,
                                            expr: Box::new(Expr::Member(MemberExpr {
                                                span: DUMMY_SP,
                                                obj: Box::new(Expr::Ident(Ident {
                                                    span: DUMMY_SP,
                                                    sym: "module".into(),
                                                    optional: false,
                                                })),
                                                prop: MemberProp::Ident(Ident {
                                                    span: DUMMY_SP,
                                                    optional: false,
                                                    sym: "exports".into(),
                                                }),
                                            })),
                                        }),
                                    ],
                                }))),
                            }),
                        ],
                    }),
                    is_generator: false,
                    is_async: false,
                    type_params: None,
                    return_type: None,
                }),
            }
            .into(),
        ));

        prepend_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
            ExportDefaultExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::Ident(Ident {
                    span: DUMMY_SP,
                    sym: "exe".into(),
                    optional: false,
                })),
            },
        )));

        *items = vec![];
        prepend_stmts(items, prepend_items.into_iter());
    }

    fn visit_mut_call_expr(&mut self, call_expr: &mut CallExpr) {
        let CallExpr { callee, args, .. } = call_expr;
        // let a = &**callee;
        match callee {
            Callee::Expr(ref mut expr) => match **expr {
                Expr::Ident(ref mut id) => {
                    if id.sym == *"require" {
                        match &*args[0].expr {
                            Expr::Lit(lit) => match lit {
                                Lit::Str(s) => {
                                    let specifier = s.value.to_string();
                                    let filename_var = self.get_file_name_var(&specifier);

                                    id.sym = filename_var.into();
                                    self.specifiers.push(specifier);
                                }
                                _ => {}
                            },
                            _ => {}
                        }
                    }
                }
                _ => {}
            },
            _ => {}
        }
        call_expr.visit_mut_children_with(self);
    }
}

pub fn cjs_to_esm(source_code: &str, file_name: &str) -> String {

    let file_name_for_source_map = FileName::Real(file_name.into());
    let source_map: Arc<SourceMap> = Default::default();
    let comments = SwcComments::default();
    let fm = source_map.new_source_file(file_name_for_source_map.clone(), source_code.into());

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

    let mut parsed_program = parser.parse_module().unwrap();
    let mut cjs = Cjs {
        specifiers: vec![],
        file_name: PathBuf::from(file_name),
    };

    parsed_program.visit_mut_with(&mut as_folder(&mut cjs));

    println!("path is {:?}", &cjs.specifiers);

    let mut buf = vec![];
    let mut emitter = Emitter {
        cfg: Config {
            minify: false,
            ..Default::default()
        },
        cm: source_map.clone(),
        comments: Some(&comments),
        wr: JsWriter::new(source_map.clone(), "\n", &mut buf, None),
    };

    emitter.emit_module(&parsed_program).unwrap();
    String::from_utf8(buf).unwrap()
}

#[cfg(test)]
mod tests {
    use super::{cjs_to_esm};
    use std::{fs, env};

    #[test]
    fn it_works() {
        let current_dir = env::current_dir().unwrap();
        let current_dir = current_dir.to_str().unwrap();
        let file_name = &format!("{}/{}", current_dir, "__tests__/fixtures/condition-require.js");
        let source = &fs::read_to_string(file_name).unwrap();

        let esm_code = cjs_to_esm(source, file_name.as_str());
        println!("esm_code is {}", esm_code);
    }
}
