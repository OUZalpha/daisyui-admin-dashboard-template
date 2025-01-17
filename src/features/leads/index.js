import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { getLeadsContent } from "./leadSlice";
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { showNotification } from "../common/headerSlice";

const TopSideButtons = () => {
    const dispatch = useDispatch();

    const openAddNewPersonnelModal = () => {
        dispatch(openModal({ title: "Add New Personnel", bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW }));
    };

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={openAddNewPersonnelModal}>Add New</button>
        </div>
    );
};

function Leads() {
    const { leads } = useSelector((state) => state.lead);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                // Fetch users data from API
                const response = await fetch("https://wellbe-api.onrender.com/api/v1/users");
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();

                // Map data to required structure and dispatch
                const mappedData = data.map(user => ({
                    id: user.user_uuid,
                    name: `${user.user_first_name} ${user.user_name}`,
                    email: user.user_email,
                    phone: user.user_phone,
                    role: user.Role?.role_label || "Unknown",
                    active: user.user_active,
                }));
                dispatch(getLeadsContent(mappedData));
            } catch (error) {
                console.error("Error fetching leads:", error.message);
                dispatch(showNotification({ message: error.message, status: 0 }));
            }
        };

        fetchLeads();
    }, [dispatch]);

    const deleteCurrentLead = (id) => {
        dispatch(
            openModal({
                title: "Confirmation",
                bodyType: MODAL_BODY_TYPES.CONFIRMATION,
                extraObject: {
                    message: `Are you sure you want to delete this user?`,
                    type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE,
                    id,
                },
            })
        );
    };

    const updateUser = (lead) => {
        dispatch(
            openModal({
                title: "Update User",
                bodyType: MODAL_BODY_TYPES.LEAD_UPDATE,
                extraObject: lead,
            })
        );
    };

    return (
        <>
            <TitleCard title="Users" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                {/* Users List in table format loaded from slice after API call */}
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td>{lead.name}</td>
                                    <td>{lead.email}</td>
                                    <td>{lead.phone}</td>
                                    <td>{lead.role}</td>
                                    <td>
                                        <div className={`badge ${lead.active ? "badge-success" : "badge-danger"}`}>
                                            {lead.active ? "Active" : "Inactive"}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button
                                                className="btn btn-square btn-ghost"
                                                onClick={() => updateUser(lead)}
                                            >
                                                <PencilIcon className="w-5" />
                                            </button>
                                            <button
                                                className="btn btn-square btn-ghost"
                                                onClick={() => deleteCurrentLead(lead.id)}
                                            >
                                                <TrashIcon className="w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </>
    );
}

export default Leads;
