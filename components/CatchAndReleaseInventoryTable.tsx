import { AddCatchReleaseToDmListButton } from '~/components/dmList/AddToDmListButtons'
import { CATCH_AND_RELEASE_INVENTORY } from '~/config/shop/catchAndReleaseInventory'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, cn } from 'ui'

/**
 * Renders the catch-and-release table with an “Add” action per row (backed by `CATCH_AND_RELEASE_INVENTORY`).
 */
export function CatchAndReleaseInventoryTable({ className }: { className?: string }) {
  if (CATCH_AND_RELEASE_INVENTORY.length === 0) return null

  return (
    <div className={cn('not-prose w-full overflow-x-auto', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[1%] whitespace-nowrap" />
            <TableHead>Brand</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="whitespace-nowrap">Remaining (ml)</TableHead>
            <TableHead className="whitespace-nowrap">Bottle size (ml)</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {CATCH_AND_RELEASE_INVENTORY.map((row) => (
            <TableRow key={`${row.brand}-${row.name}`}>
              <TableCell className="align-middle">
                <AddCatchReleaseToDmListButton row={row} />
              </TableCell>
              <TableCell translate="no">{row.brand}</TableCell>
              <TableCell translate="no">{row.name}</TableCell>
              <TableCell translate="no">{row.remainingMl}</TableCell>
              <TableCell translate="no">{row.bottleSizeMl}</TableCell>
              <TableCell translate="no">{row.cost}</TableCell>
              <TableCell className="text-foreground-lighter" translate="no">
                {row.comments}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
