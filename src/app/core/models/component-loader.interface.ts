export interface ComponentLoader {
  loadComponent: () => Promise<any>;
}
