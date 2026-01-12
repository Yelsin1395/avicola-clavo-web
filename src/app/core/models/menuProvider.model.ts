export interface MenuProvider {
  title: string;
  icon?: string;
  path?: string;
  isEnabled: boolean;
  children?: MenuProvider[];
}
