interface StatusBadgeProps {
    estado: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    PENDIENTE: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
    EN_PROCESO: { label: "En Proceso", className: "bg-blue-100 text-blue-800" },
    COMPLETADO: { label: "Completado", className: "bg-green-100 text-green-800" },
    CANCELADO: { label: "Cancelado", className: "bg-red-100 text-red-800" },
};

const StatusBadge = ({ estado }: StatusBadgeProps) => {
    const config = statusConfig[estado] || { label: estado, className: "bg-gray-100 text-gray-800" };

    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${config.className}`}>
            {config.label}
        </span>
    );
};

export default StatusBadge;
