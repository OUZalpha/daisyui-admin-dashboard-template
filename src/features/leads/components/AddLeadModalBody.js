import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";

const INITIAL_USER_OBJ = {
    user_email: "",
    user_name: "",
    user_first_name: "",
    user_phone: "",
};

function AddUserModalBody({ closeModal }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

    const saveNewUser = async () => {
        if (userObj.user_first_name.trim() === "") return setErrorMessage("First Name is required!");
        if (userObj.user_email.trim() === "") return setErrorMessage("Email is required!");
        if (userObj.user_name.trim() === "") return setErrorMessage("User Name is required!");
        if (userObj.user_phone.trim() === "") return setErrorMessage("Phone Number is required!");

        try {
            setLoading(true);
            const response = await fetch("https://wellbe-api.onrender.com/api/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userObj),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save the new user");
            }

            dispatch(showNotification({ message: "New User Added Successfully!", status: 1 }));
            closeModal();
        } catch (error) {
            setErrorMessage(error.message || "An error occurred while adding the user.");
        } finally {
            setLoading(false);
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setUserObj({ ...userObj, [updateType]: value });
    };

    return (
        <>
            <InputText
                type="text"
                defaultValue={userObj.user_first_name}
                updateType="user_first_name"
                containerStyle="mt-4"
                labelTitle="First Name"
                updateFormValue={updateFormValue}
            />

            <InputText
                type="text"
                defaultValue={userObj.user_name}
                updateType="user_name"
                containerStyle="mt-4"
                labelTitle="User Name"
                updateFormValue={updateFormValue}
            />

            <InputText
                type="email"
                defaultValue={userObj.user_email}
                updateType="user_email"
                containerStyle="mt-4"
                labelTitle="Email"
                updateFormValue={updateFormValue}
            />

            <InputText
                type="text"
                defaultValue={userObj.user_phone}
                updateType="user_phone"
                containerStyle="mt-4"
                labelTitle="Phone Number"
                updateFormValue={updateFormValue}
            />

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()} disabled={loading}>
                    Cancel
                </button>
                <button className={`btn btn-primary px-6 ${loading ? "loading" : ""}`} onClick={saveNewUser}>
                    Save
                </button>
            </div>
        </>
    );
}

export default AddUserModalBody;
