export interface QueryItem {
  type?: 'text' | 'testId' | 'class' | 'role' | 'title' | 'title';
  value: string;
  isFrame?: boolean;
}
