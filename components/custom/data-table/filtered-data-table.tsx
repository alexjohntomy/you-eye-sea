"use client";

import { useSearchParams } from "next/navigation";

import { useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
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
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 9, //custom default page size
      },
    },
  });
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex h-full w-full justify-center">
        <div className="border-foreground/10 shadow-none w-3/4 overflow-hidden rounded-md border">
          <Table className="bg-background">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="bg-muted/70 text-foreground text-xs font-bold whitespace-nowrap"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="border-foreground/8 odd:bg-background even:bg-muted/30 hover:bg-muted/50 transition-colors"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ButtonGroup className="flex flex-row md:flex-row">
        <Button
          className="border-foreground/10 bg-background text-foreground hover:bg-uic-red-50 disabled:text-foreground/25 disabled:bg-background rounded-l-md rounded-r-none border text-sm disabled:opacity-100"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          className="border-foreground/10 bg-background text-foreground hover:bg-uic-red-50 disabled:text-foreground/25 disabled:bg-background border text-sm disabled:opacity-100"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <h2 className="border-foreground/10 text-foreground bg-background flex h-9 items-center border px-5 text-sm font-medium tracking-wide italic">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </h2>
        <Button
          className="border-foreground/10 bg-background text-foreground hover:bg-uic-red-50 disabled:text-foreground/25 disabled:bg-background border text-sm disabled:opacity-100"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
        <Button
          className="border-foreground/10 bg-background text-foreground hover:bg-uic-red-50 disabled:text-foreground/25 disabled:bg-background rounded-r-md rounded-l-none border text-sm disabled:opacity-100"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
      </ButtonGroup>
      <h4 className="text-uic-navy-800/90 dark:text-uic-navy-300/50 text-[13px] font-light tracking-wide italic">
        Each row shows a professor's long-term average for this course,
        aggregated across all semesters they've taught it.
      </h4>
    </div>
  );
}

export { FilteredDataTable };
