import type { ICommonBase, ICommonItem, ICommonSection } from '~/lib/referenceSectionTypes'

export function getPageType(asPath: string) {
  if (!asPath) return ''
  if (asPath.includes('/fragrance-notes')) {
    return 'docs'
  }
  return 'docs'
}

/**
 * Flattens common sections recursively by their `items`.
 */
export function flattenSections(sections: ICommonBase[]): ICommonSection[] {
  return sections.reduce<ICommonSection[]>((acc, section: ICommonItem) => {
    if ('items' in section) {
      let newSections = acc

      if (section.type !== 'category') {
        newSections.push(section)
      }

      return newSections.concat(flattenSections(section.items ?? []))
    }
    return acc.concat(section)
  }, [])
}
