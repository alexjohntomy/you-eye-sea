"use client"

import { useSearchParams } from 'next/navigation'

import { useState } from "react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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

import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from '@/components/ui/button'
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface TableProps {
    queryParams: string
}

function FilteredDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

    const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
    });

    const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
  })
    return (
        <div className='flex flex-col w-full items-center gap-3'>
            <div className='w-full flex justify-center h-full'>
                <div className="overflow-hidden rounded-sm border w-3/4">
                    <Table className='bg-background/80'>
                        <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                <TableHead key={header.id} className='font-black bg-uic-navy-500 text-background'>
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

            <ButtonGroup className='flex md:flex-row flex-row'>
                <Button
                className='rounded-sm border border-uic-navy-600/30 text-sm bg-background text-foreground hover:bg-uic-navy-100'
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                >
                {'<<'}
                </Button>
                <Button
                className='border border-uic-navy-600/30 text-sm bg-background text-foreground hover:bg-uic-navy-100'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                {'<'}
                </Button>
                <h2 className='flex items-center border border-uic-navy-600/20 tracking-wide text-sm font-medium italic text-foreground bg-background/30 px-5 h-full'>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</h2>
                <Button
                className='border border-uic-navy-600/30 text-sm bg-background text-foreground hover:bg-uic-navy-100'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                {'>'}
                </Button>
                <Button
                className='rounded-sm border border-uic-navy-600/30 text-sm bg-background text-foreground hover:bg-uic-navy-100'
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                >
                {'>>'}
                </Button>
            </ButtonGroup>
    </div>   
    )
}

export { FilteredDataTable }