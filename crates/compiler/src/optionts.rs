
#[derive(Clone)]
#[napi(object)]
#[derive(Default)]
pub struct CompileOptions {
  pub conditions: Vec<String>,
  pub extensions: Vec<String>,
  pub cwd: String,
  pub is_callback_function: bool,
}
