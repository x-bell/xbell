use std::{fs, path::PathBuf};
use crate::constants::XBELL_FS_PREFIX;

use swc_core::ecma::utils::StmtOrModuleItem;
use swc_core::{
    common::{
        DUMMY_SP
    },
    ecma::{
        ast::*,
        utils::{prepend_stmts},
        visit::{noop_visit_mut_type, as_folder, Fold, VisitMut, VisitMutWith},
    },
};

// const XBELL_ASSET_PREFIX: &str = "/__xbell_asset_prefix__";


pub struct CjsToEsm {
    pub specifiers: Vec<String>,
    pub file_name: PathBuf,
}

impl CjsToEsm {
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

impl VisitMut for CjsToEsm {
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
            let mut asset_url = String::from(XBELL_FS_PREFIX);
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

pub fn cjs_to_esm(file_name: &str) -> impl Fold + VisitMut  {
    as_folder(CjsToEsm {
        specifiers: vec![],
        file_name: PathBuf::from(file_name),
    })
}

#[cfg(test)]
mod tests {
    use crate::{compile::compile, optionts::CompileOptions};
    use std::{fs, env};

    use lazy_static::lazy_static;

  lazy_static! {
    static ref CONDITIONS: Vec<String> = vec![];

    static ref EXTENSIONS: Vec<String> = vec![".ts", ".tsx", ".js", "cjs", ".mjs", ".jsx"]
      .iter()
      .map(|ext| ext.to_string())
      .collect();

    static ref TEST_DIR: String = env::current_dir()
      .unwrap()
      .join("__tests__")
      .canonicalize()
      .unwrap()
      .to_str()
      .unwrap()
      .to_string();
  }

    #[test]
    fn it_works() {
        let current_dir = env::current_dir().unwrap();
        let current_dir = current_dir.to_str().unwrap();
        let file_name = format!("{}/{}", current_dir, "__tests__/fixtures/condition-require.js");
        let source = fs::read_to_string(file_name.clone()).unwrap();

        let compile_options = CompileOptions {
            extensions: EXTENSIONS.clone(),
            conditions: CONDITIONS.clone(),
            cwd: TEST_DIR.to_string(),
          };

        let esm_code = compile(source, file_name, compile_options);
        println!("esm_code is {}", esm_code);
    }
}
