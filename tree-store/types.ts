export interface Item {
  id: ItemId
  parent: ItemId | null
  label: string
}

export type ItemId = string | number
