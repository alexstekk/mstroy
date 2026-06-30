export interface Item {
  id: ItemId;
  parent: ItemId | null;
  label: string;
  [key: string]: unknown;
  // [key: keyof any]: any;
}

export type ItemId = string | number;
