use swc_core::{
    common::{DUMMY_SP},
    ecma::{
        ast::{Program, *},
        transforms::testing::test,
        utils::{prepend_stmt, StmtLike},
        visit::{as_folder, noop_visit_mut_type, FoldWith, VisitMut, VisitMutWith},
    },
};

use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

pub struct XBellTransformer;

impl XBellTransformer {
    fn visit_mut_stmt_like<T>(&mut self, orig: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        for item in &mut *orig {
            item.visit_mut_with(self);
        }

        // prepend_stmts(&mut new, hoisted.into_iter());
        let stmt = T::from_stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            declare: false,
            kind: VarDeclKind::Const,
            span: DUMMY_SP,
            decls: vec![VarDeclarator {
                name: Pat::Object(ObjectPat {
                    span: DUMMY_SP,
                    optional: false,
                    type_ann: None,
                    props: vec![ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: PropName::Ident(Ident::new("jsx".into(), DUMMY_SP)),
                        value: Box::new(Pat::Ident(BindingIdent {
                            id: Ident::new("_jsx".into(), DUMMY_SP),
                            type_ann: None,
                        }))
                    })]
                }),
                span: DUMMY_SP,
                definite: false,
                init: Some(Box::new(Expr::Await(AwaitExpr {
                    span: DUMMY_SP,
                    arg: Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee:  Callee::Import(Import {
                            span: DUMMY_SP,
                        }),
                        args: vec![
                            ExprOrSpread {
                                spread: None,
                                expr: Box::new(
                                    Expr::Lit(Lit::Str(Str {
                                        span: DUMMY_SP,
                                        value: "react/jsx-runtime".into(),
                                        raw: None,
                                    }))
                                )
                            }
                        ],
                        type_args: None,
                    })),
                })))
                },
            ]
        }))));
        prepend_stmt(
            orig,
            stmt,
        );

        // *orig = new;
    }
}

impl VisitMut for XBellTransformer {
    noop_visit_mut_type!();

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(stmts)
    }
}

/// An example plugin function with macro support.
/// `plugin_transform` macro interop pointers into deserialized structs, as well
/// as returning ptr back to host.
///
/// It is possible to opt out from macro by writing transform fn manually
/// if plugin need to handle low-level ptr directly via
/// `__transform_plugin_process_impl(
///     ast_ptr: *const u8, ast_ptr_len: i32,
///     unresolved_mark: u32, should_enable_comments_proxy: i32) ->
///     i32 /*  0 for success, fail otherwise.
///             Note this is only for internal pointer interop result,
///             not actual transform result */`
///
/// This requires manual handling of serialization / deserialization from ptrs.
/// Refer swc_plugin_macro to see how does it work internally.
#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(XBellTransformer))
}

// An example to test plugin transform.
// Recommended strategy to test plugin's transform is verify
// the Visitor's behavior, instead of trying to run `process_transform` with mocks
// unless explicitly required to do so.
test!(
    Default::default(),
    |_| as_folder(XBellTransformer),
    boo,
    // Input codes
    r#"async () => {
        _jsx('div', {}, []);
    }"#,
    // Output codes after transformed with plugin
    r#"async () => {
        const { jsx: _jsx  } = await import("react/jsx-runtime");
        _jsx('div', {}, []);
    }"#
);
