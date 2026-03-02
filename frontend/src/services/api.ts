import axios from "axios";
import type { Pedido, PedidoInput } from "../types/pedido";

const api = axios.create({
    baseURL: "/api"
});

export const getPedidos = async(): Promise<Pedido[]> => {
    const response = await api.get<Pedido[]>("/pedidos");
    return response.data;
}; 

export const getPedido = async(id: number): Promise<Pedido> => {
    const response = await api.get<Pedido>(`/pedidos/${id}`);
    return response.data;
};

export const createPedido = async(data: PedidoInput): Promise<Pedido> => {
    const response = await api.post<Pedido>("/pedidos", data);
    return response.data;
};

export const updatePedido = async(id: number,data: PedidoInput): Promise<Pedido> => {
    const response = await api.put<Pedido>(`/pedidos/${id}`, data);
    return response.data;
};

export const deletePedido = async(id: number): Promise<void> => {
    await api.delete<Pedido>(`/pedidos/${id}`);
};