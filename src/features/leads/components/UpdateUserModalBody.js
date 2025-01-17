import { useState, useEffect } from "react";
import InputText from "../../../components/Input/InputText";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { updateLead } from "../leadSlice";

const ROLES = [
    { role_id: 3, role_label: "ADMIN", role_description: "ADMIN_ROLE" },
    { role_id: 1, role_label: "CLIENT", role_description: "CLIENT_ROLE" },
    { role_id: 2, role_label: "OWNER", role_description: "OWNER_ROLE" },
    { role_id: 4, role_label: "PERSONNEL", role_description: "PERSONNEL_ROLE" },
];

function UpdateUserModalBody({ closeModal, extraObject }) {
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        id: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        password: "",
        whatsapp_uid: "",
        role_id: 1, // Default to CLIENT role
        ...extraObject, // Populate fields from `extraObject`
    });

    const updateFormValue = ({ updateType, value }) => {
        setUser({ ...user, [updateType]: value });
    };

    const saveUpdatedUser = async () => {
        if (!user.first_name || !user.last_name || !user.email || !user.phone || !user.role_id) {
            alert("All fields are required!");
            return;
        }
    
        try {
            const token = localStorage.getItem("token"); // Retrieve token from local storage
    
            const response = await fetch(`https://wellbe-api.onrender.com/api/v1/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include the token
                },
                body: JSON.stringify({
                    user_email: user.email,
                    user_name: user.last_name,
                    user_first_name: user.first_name,
                    user_password: user.password || "defaultPassword123",
                    user_numero: user.phone,
                    user_whatsapp_uid: user.whatsapp_uid || "N/A",
                    role_id: parseInt(user.role_id, 10),
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update user");
            }
    
            const updatedUser = await response.json();
    
            // Dispatch the updated user data to the Redux store
            dispatch(updateLead({ id: user.id, updatedData: updatedUser }));
    
            dispatch(showNotification({ message: "User updated successfully!", status: 1 }));
            closeModal();
        } catch (error) {
            console.error("Error updating user:", error.message);
            alert(`Error: ${error.message}`);
        }
    };
    

    useEffect(() => {
        // Populate `user` state when `extraObject` is updated
        if (extraObject) {
            setUser({ ...user, ...extraObject });
        }
    }, [extraObject]);

    return (
        <>
            <InputText
                type="text"
                defaultValue={user.first_name}
                updateType="first_name"
                labelTitle="First Name"
                updateFormValue={updateFormValue}
            />
            <InputText
                type="text"
                defaultValue={user.last_name}
                updateType="last_name"
                labelTitle="Last Name"
                updateFormValue={updateFormValue}
            />
            <InputText
                type="email"
                defaultValue={user.email}
                updateType="email"
                labelTitle="Email"
                updateFormValue={updateFormValue}
            />
            <InputText
                type="text"
                defaultValue={user.phone}
                updateType="phone"
                labelTitle="Phone"
                updateFormValue={updateFormValue}
            />
            <InputText
                type="password"
                defaultValue={user.password}
                updateType="password"
                labelTitle="Password"
                updateFormValue={updateFormValue}
            />
            <InputText
                type="text"
                defaultValue={user.whatsapp_uid}
                updateType="whatsapp_uid"
                labelTitle="WhatsApp UID"
                updateFormValue={updateFormValue}
            />
            <div className="form-control mt-4">
                <label className="label">
                    <span className="label-text font-semibold">Role</span>
                </label>
                <select
                    className="select select-bordered"
                    value={user.role_id}
                    onChange={(e) => updateFormValue({ updateType: "role_id", value: e.target.value })}
                >
                    {ROLES.map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                            {role.role_label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={closeModal}>
                    Cancel
                </button>
                <button className="btn btn-primary" onClick={saveUpdatedUser}>
                    Save
                </button>
            </div>
        </>
    );
}

export default UpdateUserModalBody;
