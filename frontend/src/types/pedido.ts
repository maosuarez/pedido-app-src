export interface Pedido {
    id: number;
    cliente: string;
    descripcion: string | null;
    cantidad: number;
    estado: string;
    fechaCreacion: string;
    fechaActualizacion: string
}

export interface PedidoInput {
    cliente: string;
    descripcion?: string;
    cantidad: number;
    estado?: string
}