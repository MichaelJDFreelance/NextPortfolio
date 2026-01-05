"use client"

import {flexRender} from "@tanstack/react-table";
import {useTransactionsTable} from "@/context/TransactionsTableProvider";

export function Table() {
    const {tableDef} = useTransactionsTable();

    return (
            <table className={`w-full text-left`}>
                <thead>
                {tableDef.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th className={`
                                ${header.column.columnDef.meta?.mobileHidden
                                ? "max-md:hidden"
                                : ""} py-3 ${header.column.id==="amount" && "text-right"}
                            `}
                                id={`header-for-${header.id}`} key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>

                <tbody>
                {tableDef.getRowModel().rows.map(row => (
                    <tr key={row.id} id={`row-for-${row.id}`}>
                        {row.getVisibleCells().map(cell => (
                            <td className={`
                                ${cell.column.columnDef.meta?.mobileHidden
                                ? "max-md:hidden"
                                : ""} py-4 ${cell.column.id==="amount" && "text-right"}
                            `}
                                key={cell.id} id={`cell-for-${cell.column.id}`}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
    );
}