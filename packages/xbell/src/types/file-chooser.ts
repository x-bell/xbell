export interface FileChooser {
  /**
   * Returns whether this file chooser accepts multiple files.
   */
  isMultiple(): Promise<boolean>;

  /**
   * Sets the value of the file input this chooser is associated with. If some of the `filePaths` are relative paths,
   * then they are resolved relative to the current working directory. For empty array, clears the selected files.
   * @param files
   * @param options
   */
  setFiles(files: string|Array<string>|{
    /**
     * File name
     */
    name: string;

    /**
     * File type
     */
    mimeType: string;

    /**
     * File content
     */
    buffer: Buffer;
  }|Array<{
    /**
     * File name
     */
    name: string;

    /**
     * File type
     */
    mimeType: string;

    /**
     * File content
     */
    buffer: Buffer;
  }>, options?: {
    timeout?: number;
  }): Promise<void>;  
}
