export type XBellProject = {
  name: XBellProjects['names'];
} & Omit<XBellProjects, 'names'>
