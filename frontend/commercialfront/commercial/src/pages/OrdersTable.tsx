import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import { useQuery, useQueryClient } from "@tanstack/react-query"

type Order = {
    _id: string
    clientName: string
    restaurantName: string
    totalAmount: number
    createdAt: string
    status: string
}

const columns: ColumnDef<Order>[] = [
    { accessorKey: "_id", header: "ID Commande" },
    { accessorKey: "clientName", header: "Client" },
    { accessorKey: "restaurantName", header: "Restaurant" },
    { accessorKey: "totalAmount", header: "Montant (€)" },
    {
        accessorKey: "createdAt",
        header: "Heure de passation",
        cell: (info) => new Date(info.getValue() as string).toLocaleString()
    },
    { accessorKey: "status", header: "Statut actuel" },
]

type Props = {
    data: Order[]
}

export function OrdersTable() {
    const queryClient = useQueryClient()
    const [intervalMs, setIntervalMs] = React.useState(500)
    const [value, setValue] = React.useState('')

    const { status, data, error, isFetching } = useQuery({
        queryKey: ['orders'],
        queryFn: async (): Promise<Array<Order>> => {
            //   const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
            const response = await fetch('http://localhost:3003/api/commandes-details')
            return await response.json()
        },
        // Refetch the data every second
        refetchInterval: intervalMs,
    })
    console.log(status)

    if (status === 'pending') return <h1>Loading...</h1>

    if (status === 'error') return <span>Error: {error.message}</span>

    console.log(data)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (

        <div className="overflow-x-auto">
            {isFetching && <div className="text-sm text-gray-500">Rafraîchissement des données...</div>}
            <table className="min-w-full border border-gray-200 shadow rounded">
                <thead className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="p-2 border-b text-left">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                            <th className="p-2 border-b text-left">Actions</th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-2 border-b">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            <td className="p-2 border-b">
                                <button className="text-blue-500 hover:underline">Voir détails</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// const queryClient = useQueryClient()
// const [intervalMs, setIntervalMs] = React.useState(5000)
// const [value, setValue] = React.useState('')

// const { status, data, error, isFetching } = useQuery({
//     queryKey: ['orders'],
//     queryFn: async (): Promise<Array<string>> => {
//         //   const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
//         const response = await fetch('http://localhost:3003/api/commandes')
//         return await response.json()
//     },
//     // Refetch the data every second
//     refetchInterval: intervalMs,
// })

// console.log(status)

// if (status === 'pending') return <h1>Loading...</h1>

// if (status === 'error') return <span>Error: {error.message}</span>

// if (isFetching) return <div>Fetching ...</div>

// console.log(data)

// const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel()
// })