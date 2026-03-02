import { useState } from "react";
import type { Pedido } from "../types/pedido";
import StatusBadge from "./StatusBadge";
import ConfirmDialog from "./ConfirmDialog";

interface PedidoListProps {
    pedidos: Pedido[];
    loading: boolean;
    error: string | null;
    onEdit: (pedido: Pedido) => void;
    onDelete: (id: number) => void;
}

const PedidoList = ({ pedidos, loading, error, onEdit, onDelete }: PedidoListProps) => {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteId !== null) {
            onDelete(deleteId);
            setDeleteId(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteId(null);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Cargando pedidos...</div>;
    }

    if (error) {
        return <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
    }

    if (pedidos.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400 bg-white rounded-xl shadow-md">
                No hay pedidos registrados. Crea el primero.
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-sm bg-white rounded-xl overflow-hidden shadow-md">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Cliente</th>
                            <th className="px-4 py-3 text-left">Descripcion</th>
                            <th className="px-4 py-3 text-left">Cantidad</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Fecha</th>
                            <th className="px-4 py-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">{pedido.id}</td>
                                <td className="px-4 py-3 font-medium">{pedido.cliente}</td>
                                <td className="px-4 py-3 text-gray-500">{pedido.descripcion || "—"}</td>
                                <td className="px-4 py-3">{pedido.cantidad}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge estado={pedido.estado} />
                                </td>
                                <td className="px-4 py-3 text-gray-500">{formatDate(pedido.fechaCreacion)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            className="px-3 py-1.5 rounded-md text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer"
                                            onClick={() => onEdit(pedido)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                                            onClick={() => handleDeleteClick(pedido.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                isOpen={deleteId !== null}
                message="¿Estas seguro de que quieres eliminar este pedido?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
};

export default PedidoList;
