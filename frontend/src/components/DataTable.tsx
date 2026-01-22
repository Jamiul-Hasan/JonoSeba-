import { ReactNode, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface ColumnDef<T> {
  key: keyof T | string
  header: string
  render?: (value: T[keyof T], row: T) => ReactNode
  width?: string
  sortable?: boolean
  searchable?: boolean
}

export interface RowAction<T> {
  label: string
  onClick: (row: T) => void | Promise<void>
  variant?: 'default' | 'destructive'
  icon?: ReactNode
}

interface DataTableProps<T extends Record<string, any>> {
  columns: ColumnDef<T>[]
  data: T[]
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchableFields?: (keyof T)[]
  rowActions?: RowAction<T>[]
  onRowClick?: (row: T) => void
  isLoading?: boolean
  pageSize?: number
  totalItems?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  emptyMessage?: string
  rowClassName?: (row: T) => string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'খুঁজুন...',
  searchValue = '',
  onSearchChange,
  searchableFields,
  rowActions,
  onRowClick,
  isLoading = false,
  pageSize = 10,
  totalItems,
  currentPage = 1,
  onPageChange,
  emptyMessage = 'কোনো ডেটা পাওয়া যায়নি',
  rowClassName,
}: DataTableProps<T>) {
  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchValue || !onSearchChange) return data

    const fields = searchableFields || columns
      .filter(col => col.searchable !== false)
      .map(col => col.key as keyof T)

    return data.filter(row =>
      fields.some(field => {
        const value = row[field]
        return String(value).toLowerCase().includes(searchValue.toLowerCase())
      })
    )
  }, [data, searchValue, onSearchChange, searchableFields, columns])

  // Pagination
  const totalPages = totalItems
    ? Math.ceil(totalItems / pageSize)
    : Math.ceil(filteredData.length / pageSize)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredData.slice(start, end)
  }, [filteredData, currentPage, pageSize])

  const canPrevious = currentPage > 1
  const canNext = currentPage < totalPages

  return (
    <div className="space-y-6">
      {/* Search Input */}
      {onSearchChange && (
        <div className="relative">
          <label htmlFor="data-table-search" className="sr-only">
            {searchPlaceholder}
          </label>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            id="data-table-search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9 focus:ring-2 focus:ring-primary focus:ring-offset-0"
            aria-label="Search table"
          />
        </div>
      )}

      {/* Table - Desktop & Mobile */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map(column => (
                  <TableHead
                    key={String(column.key)}
                    style={{ width: column.width }}
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wide',
                      column.sortable && 'cursor-pointer hover:bg-muted transition-colors'
                    )}
                    scope="col"
                  >
                    {column.header}
                  </TableHead>
                ))}
                {rowActions && rowActions.length > 0 && (
                  <TableHead className="w-12 text-right" scope="col">
                    <span className="sr-only">ক্রিয়া</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (rowActions?.length ? 1 : 0)}
                    className="text-center py-12 text-muted-foreground"
                  >
                    লোড হচ্ছে...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (rowActions?.length ? 1 : 0)}
                    className="text-center py-12 text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'transition-colors',
                      'focus-within:ring-2 focus-within:ring-primary focus-within:ring-inset',
                      onRowClick && 'cursor-pointer hover:bg-muted/50',
                      rowClassName?.(row)
                    )}
                  >
                    {columns.map(column => (
                      <TableCell key={String(column.key)} className="py-4">
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] ?? '-')}
                      </TableCell>
                    ))}

                    {rowActions && rowActions.length > 0 && (
                      <TableCell className="text-right py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 focus:ring-2 focus:ring-primary focus:ring-offset-0"
                              onClick={e => e.stopPropagation()}
                              aria-label="Row actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {rowActions.map((action, idx) => (
                              <div key={idx}>
                                {idx > 0 && action.variant === 'destructive' && (
                                  <DropdownMenuSeparator />
                                )}
                                <DropdownMenuItem
                                  onClick={e => {
                                    e.stopPropagation()
                                    action.onClick(row)
                                  }}
                                  className={cn(
                                    'focus:ring-2 focus:ring-primary',
                                    action.variant === 'destructive' && 'text-destructive'
                                  )}
                                >
                                  {action.icon && (
                                    <span className="mr-2 h-4 w-4">{action.icon}</span>
                                  )}
                                  {action.label}
                                </DropdownMenuItem>
                              </div>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-between pt-4 border-t border-border"
          aria-label="পৃষ্ঠা নেভিগেশন"
        >
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold">পৃষ্ঠা {currentPage}</span> / {totalPages}
            {totalItems && ` (মোট ${totalItems} আইটেম)`}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={!canPrevious}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-0"
              aria-label="পূর্ববর্তী পৃষ্ঠা"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              পূর্ববর্তী
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={!canNext}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-0"
              aria-label="পরবর্তী পৃষ্ঠা"
            >
              পরবর্তী
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  )
}
