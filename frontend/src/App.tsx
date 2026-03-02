import { useState } from "react";
import { usePedidos } from "./hooks/usePedidos";
import PedidoForm from "./components/PedidoForm";
import PedidoList from "./components/PedidoList";
import type { Pedido, PedidoInput } from "./types/pedido";

function App() {
    const { pedidos, loading, error, addPedido, editPedido, removePedido } = usePedidos();
    const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);

    const handleSave = async (data: PedidoInput) => {
        if (pedidoEditando) {
            await editPedido(pedidoEditando.id, data);
        } else {
            await addPedido(data);
        }
        setPedidoEditando(null);
    };

    const handleEdit = (pedido: Pedido) => {
        setPedidoEditando(pedido);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setPedidoEditando(null);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-4 pb-12 min-h-screen">
            <header className="text-center py-6 mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Gestion de Pedidos</h1>
            </header>

            <main className="flex flex-col gap-8">
                <PedidoForm
                    pedidoEditando={pedidoEditando}
                    onSave={handleSave}
                    onCancelEdit={handleCancelEdit}
                />

                <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">
                        Pedidos ({pedidos.length})
                    </h2>
                    <PedidoList
                        pedidos={pedidos}
                        loading={loading}
                        error={error}
                        onEdit={handleEdit}
                        onDelete={removePedido}
                    />
                </section>
            </main>
        </div>
    );
}

export default App;
