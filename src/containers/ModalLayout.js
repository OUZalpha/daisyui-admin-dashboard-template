import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/common/modalSlice";
import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import AddLeadModalBody from "../features/leads/components/AddLeadModalBody";
import ConfirmationModalBody from "../features/common/components/ConfirmationModalBody";
import UpdateUserModalBody from "../features/leads/components/UpdateUserModalBody"; // Import the UpdateUserModalBody

function ModalLayout() {
    const { isOpen, bodyType, size, extraObject, title } = useSelector((state) => state.modal);
    const dispatch = useDispatch();

    const close = () => {
        dispatch(closeModal());
    };

    // Define the modal body mapping
    const modalBody = {
        [MODAL_BODY_TYPES.LEAD_ADD_NEW]: <AddLeadModalBody closeModal={close} extraObject={extraObject} />,
        [MODAL_BODY_TYPES.CONFIRMATION]: <ConfirmationModalBody closeModal={close} extraObject={extraObject} />,
        [MODAL_BODY_TYPES.LEAD_UPDATE]: <UpdateUserModalBody closeModal={close} extraObject={extraObject} />,
    };

    return (
        <>
            {/* Modal */}
            <div className={`modal ${isOpen ? "modal-open" : ""}`}>
                <div className={`modal-box ${size === "lg" ? "max-w-5xl" : ""}`}>
                    {/* Close Button */}
                    <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={close}>
                        ✕
                    </button>
                    {/* Modal Title */}
                    <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>

                    {/* Render the appropriate modal body */}
                    {modalBody[bodyType] || <div className="text-center">Modal type not supported.</div>}
                </div>
            </div>
        </>
    );
}

export default ModalLayout;
