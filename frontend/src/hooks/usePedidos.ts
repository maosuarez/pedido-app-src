import { useState, useEffect } from "react";
import { getPedidos, createPedido, updatePedido, deletePedido } from "../services/api";
import type { Pedido, PedidoInput } from "../types/pedido";

export const usePedidos = () => {

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try{
            setLoading(true);
            setError(null);
            const data = await getPedidos();
            setPedidos(data);
        } catch (err) {
            setError("Error al cargar los pedidos")
        } finally {
            setLoading(false);
        }
    };

    const addPedido = async (data: PedidoInput) => {
        try{
            setLoading(true);
            setError(null);
            const nuevo = await createPedido(data);
            setPedidos((prev) => [...prev, nuevo]);
        } catch (err) {
            setError("Error al crear el pedido")
        } finally {
            setLoading(false);
        }
    };

    const editPedido = async (id:number, data: PedidoInput) => {
        try{
            setLoading(true);
            setError(null);
            const actualizado = await updatePedido(id, data);
            setPedidos((prev) => prev.map((p) => p.id === id ? actualizado : p));
        } catch (err) {
            setError("Error al actualizar el pedido");
        } finally {
            setLoading(false);
        }
    };

    const removePedido = async(id: number) => {
        try{
            setLoading(true);
            setError(null);
            await deletePedido(id);
            setPedidos((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError("Error al eliminar el pedido")
        } finally {
            setLoading(false);
        }
    };

    return { pedidos, loading, error, fetchPedidos, addPedido, editPedido, removePedido };

};