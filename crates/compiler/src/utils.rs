pub fn is_relative_path(specifier: &str) -> bool {
  specifier.starts_with(".")
}
