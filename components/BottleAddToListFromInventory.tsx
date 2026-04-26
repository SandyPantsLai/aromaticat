import { AddBottleToDmListButton } from '~/components/dmList/AddToDmListButtons'
import { getBottleOverviewByPageId } from '~/config/shop/bottlesLookup'

/**
 * Renders "Add to List" for a bottle **detail** page when this bottle exists in
 * {@link BOTTLES_OVERVIEW_INVENTORY} (same `href` tail as `pageId`).
 * Use `pageId` = frontmatter `id` (e.g. `lotus-flower` for `/shop/bottles/lotus-flower`).
 */
export function BottleAddToListFromInventory({ pageId }: { pageId: string }) {
  const entry = getBottleOverviewByPageId(pageId)
  if (entry == null) return null

  return (
    <div className="not-prose my-6 max-w-sm">
      <AddBottleToDmListButton entry={entry} />
    </div>
  )
}
