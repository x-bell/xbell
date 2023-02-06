use std::fs;
use std::path::Path;
use xbell_resolver::package::Package;

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
        visit::{VisitMutWith,as_folder},
    },
};

fn main() {
    // let package_dir = Path::new(
    //     "",
    // ).canonicalize().unwrap();
    // let package = Package::new(&package_dir);
    // match &package.entry_path {
    //     Some(package_entry_path) => {
    //         let content = fs::read(&package_entry_path).unwrap();
    //         let str = String::from_utf8(content).unwrap();
    //         println!("pkg entry_path content is {:?}", str);
    //     },
    //     _ => {},
    // }

    // println!("pkg entry_path is {:?}", &package.entry_path);
    // println!("pkg is_esm is {:?}", package.is_esm);

    let source = r#"
import React from "react";
import ReactDOM from "react-dom";
import {Button, Input} from "antd";
import Child from "./component/Child";

class Page extends React.Component {
    render() {
        return (
            <div className={"test"}>
                <div>Page</div>
                <Child/>
                <Button>click me</Button>
                <Input/>
            </div>
        );
    }
}

ReactDOM.render(<Page/>, document.getElementById("root"));
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
        Ok(parsed_program) => {
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
            // compiler.print(
            //     &parsed_program,
            //     None,
            //     None,
            //     true,
            //     EsVersion::latest(),
            //     a,

            // )
        }
        Err(err) => {}
    };
}
