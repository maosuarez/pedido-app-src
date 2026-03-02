import { useEffect } from "react";
import { useForm } from "../hooks/useForm";
import type { Pedido, PedidoInput } from "../types/pedido";

interface PedidoFormProps {
    pedidoEditando: Pedido | null;
    onSave: (data: PedidoInput) => void;
    onCancelEdit: () => void;
}

const initialValues: PedidoInput = {
    cliente: "",
    descripcion: "",
    cantidad: 1,
    estado: "PENDIENTE",
};

const PedidoForm = ({ pedidoEditando, onSave, onCancelEdit }: PedidoFormProps) => {
    const { values, handleChange, reset, setFormValues } = useForm<PedidoInput>(initialValues);

    useEffect(() => {
        if (pedidoEditando) {
            setFormValues({
                cliente: pedidoEditando.cliente,
                descripcion: pedidoEditando.descripcion || "",
                cantidad: pedidoEditando.cantidad,
                estado: pedidoEditando.estado,
            });
        } else {
            reset();
        }
    }, [pedidoEditando]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(values);
        reset();
    };

    const handleCancel = () => {
        reset();
        onCancelEdit();
    };

    const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors";

    return (
        <form className="bg-white rounded-lg p-6 shadow-lg" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold text-slate-800 mb-4">
                {pedidoEditando ? "Editar Pedido" : "Nuevo Pedido"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="cliente" className="text-sm font-semibold text-gray-600">
                        Cliente
                    </label>
                    <input
                        type="text"
                        id="cliente"
                        name="cliente"
                        value={values.cliente}
                        onChange={handleChange}
                        placeholder="Nombre del cliente"
                        className={inputClass}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="cantidad" className="text-sm font-semibold text-gray-600">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        id="cantidad"
                        name="cantidad"
                        value={values.cantidad}
                        onChange={handleChange}
                        min={1}
                        className={inputClass}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="estado" className="text-sm font-semibold text-gray-600">
                        Estado
                    </label>
                    <div className="relative">
                        <select
                            id="estado"
                            name="estado"
                            value={values.estado}
                            onChange={handleChange}
                            className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                        >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="EN_PROCESO">En Proceso</option>
                            <option value="COMPLETADO">Completado</option>
                            <option value="CANCELADO">Cancelado</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-4 w-4 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                    <label htmlFor="descripcion" className="text-sm font-semibold text-gray-600">
                        Descripcion
                    </label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={values.descripcion || ""}
                        onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                        placeholder="Descripcion del pedido"
                        rows={3}
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="flex gap-3 mt-5">
                <button
                    type="submit"
                    className="px-5 py-2 rounded-md text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                    {pedidoEditando ? "Actualizar" : "Crear Pedido"}
                </button>
                {pedidoEditando && (
                    <button
                        type="button"
                        className="px-5 py-2 rounded-md text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors cursor-pointer"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default PedidoForm;
