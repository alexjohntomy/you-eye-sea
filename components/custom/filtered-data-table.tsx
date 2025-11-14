"use client"

import { useSearchParams } from 'next/navigation'

interface TableProps {
    queryParams: string
}

// trying data table

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

// end

function FilteredDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

    const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  //important conditional
    const queryParams = useSearchParams()
    const hasAllFilters = queryParams.has("subject") && queryParams.has("sort") && queryParams.has("level")
    return hasAllFilters && (
        <div className='w-full flex justify-center h-full'>
            <div className="overflow-hidden rounded-sm border w-3/4">
                <Table className='bg-background/80'>
                    <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                            <TableHead key={header.id} className='font-bold'>
                                {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                            </TableHead>
                            )
                        })}
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {/* Basically add whatever content i want here like a div and then that will be card */}
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </div>

        </div>
        
    )
}

export { FilteredDataTable }