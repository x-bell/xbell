import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import Type from '@site/src/components/Type';
import Tag from '@site/src/components/Tag';


export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Map the "highlight" tag to our <Highlight /> component!
  // `Highlight` will receive all props that were passed to `highlight` in MDX
  type: Type,
  tag: Tag,
};
