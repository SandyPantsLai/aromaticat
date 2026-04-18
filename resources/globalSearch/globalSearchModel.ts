import { type RootQueryTypeSearchDocsArgs } from '~/__generated__/graphql'
import { convertPostgrestToApiError, type ApiErrorGeneric } from '~/app/api/utils'
import { Result } from '~/features/helpers.fn'
import { supabase, type DatabaseCorrected } from '~/lib/supabase'

import { isFeatureEnabled } from 'common/enabled-features'
import { BlogModel } from '../blog/blogModel'
import { GuideModel } from '../guide/guideModel'
import { SearchResultInterface } from './globalSearchInterface'

type FtsRow = DatabaseCorrected['public']['Functions']['docs_search_fts']['Returns'][number]

function ftsRowToSearchContentRow(
  row: FtsRow,
  includeFullContent: boolean
): DatabaseCorrected['public']['Functions']['search_content']['Returns'][number] {
  return {
    id: row.id,
    type: row.type,
    page_title: row.title,
    href: row.path,
    content: includeFullContent ? (row.description ?? '') : '',
    metadata: {},
    subsections: [],
  } as DatabaseCorrected['public']['Functions']['search_content']['Returns'][number]
}

export abstract class SearchResultModel {
  static async search(
    args: RootQueryTypeSearchDocsArgs,
    requestedFields: Array<string>
  ): Promise<Result<SearchResultModel[], ApiErrorGeneric>> {
    return SearchResultModel.searchViaFts(args, requestedFields)
  }

  static async searchHybrid(
    args: RootQueryTypeSearchDocsArgs,
    requestedFields: Array<string>
  ): Promise<Result<SearchResultModel[], ApiErrorGeneric>> {
    return SearchResultModel.searchViaFts(args, requestedFields)
  }

  private static async searchViaFts(
    args: RootQueryTypeSearchDocsArgs,
    requestedFields: Array<string>
  ): Promise<Result<SearchResultModel[], ApiErrorGeneric>> {
    const query = args.query.trim()
    const includeFullContent = requestedFields.includes('content')
    const useAltSearchIndex = !isFeatureEnabled('search:fullIndex')
    const fn = useAltSearchIndex ? 'docs_search_fts_nimbus' : 'docs_search_fts'

    const raw = await supabase().rpc(fn, { query })

    return new Result(raw)
      .mapError(convertPostgrestToApiError)
      .map((rows) => {
        const list = rows ?? []
        const limited =
          args.limit !== undefined && args.limit !== null && args.limit > 0
            ? list.slice(0, args.limit)
            : list

        return limited
          .map((row) =>
            createModelFromMatch(ftsRowToSearchContentRow(row as FtsRow, includeFullContent))
          )
          .filter((item): item is SearchResultInterface => item !== null)
      })
  }
}

function createModelFromMatch({
  type,
  page_title,
  href,
  content,
  subsections,
}: DatabaseCorrected['public']['Functions']['search_content']['Returns'][number]): SearchResultInterface | null {
  switch (type) {
    case 'markdown':
      return new GuideModel({
        title: page_title,
        href,
        content,
        subsections,
      })
    case 'blog':
      return new BlogModel({
        title: page_title,
        href,
        content,
      })
    case 'troubleshooting':
      return new BlogModel({
        title: page_title,
        href,
        content,
      })
    default:
      return null
  }
}
