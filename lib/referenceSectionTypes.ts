/**
 * Shapes for spec "common sections" JSON trees (CLI, client libs, etc.).
 * Kept here so CLI config pages and search tooling do not depend on removed reference UI.
 */
export interface ICommonSection {
  id: string
  slug?: string
  type?: string
  title?: string
  name?: string
  items?: ICommonItem[]
  [key: string]: unknown
}

export interface ICommonItem extends ICommonSection {}

export type ICommonBase = ICommonItem
