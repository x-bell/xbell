
#[derive(Clone)]
#[napi(object)]
pub struct CompileOptions {
  pub conditions: Vec<String>,
  pub extensions: Vec<String>,
  pub cwd: String,
}
