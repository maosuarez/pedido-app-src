interface ConfirmDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }: ConfirmDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-7 max-w-sm w-[90%] shadow-xl">
                <p className="text-gray-700 mb-5">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        className="px-4 py-2 rounded-md text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors cursor-pointer"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                        onClick={onConfirm}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
