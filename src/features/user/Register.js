import { useState } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";

function Register() {
    const INITIAL_REGISTER_OBJ = {
        user_name: "",
        user_email: "",
        user_password: "",
        user_numero: "",
        user_whatsapp_uid: "",
        role_id: 1, // Default role is CLIENT
    };

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Basic validations
        if (registerObj.user_name.trim() === "") return setErrorMessage("Name is required!");
        if (registerObj.user_email.trim() === "") return setErrorMessage("Email is required!");
        if (registerObj.user_password.trim() === "") return setErrorMessage("Password is required!");

        try {
            setLoading(true);

            // Call API to register the user
            const response = await fetch("https://wellbe-api.onrender.com/api/v1/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerObj),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to register user");
            }

            const data = await response.json();
            console.log("User registered:", data);

            // Success message
            alert("Registration successful!");
            setLoading(false);
            window.location.href = "/login";
        } catch (error) {
            console.error("Error occurred:", error);
            if (error.response) {
                console.error("API Response:", error.response);
                setErrorMessage(error.response.data.message || "An error occurred during registration.");
            } else if (error.message) {
                console.error("Error Message:", error.message);
                setErrorMessage(error.message || "An unexpected error occurred.");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        }
        
        
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setRegisterObj({ ...registerObj, [updateType]: value });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className="">
                        <LandingIntro />
                    </div>
                    <div className="py-24 px-10">
                        <h2 className="text-2xl font-semibold mb-2 text-center">Register</h2>
                        <form onSubmit={submitForm}>
                            <div className="mb-4">
                                <InputText
                                    defaultValue={registerObj.user_name}
                                    updateType="user_name"
                                    containerStyle="mt-4"
                                    labelTitle="Name"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    defaultValue={registerObj.user_email}
                                    updateType="user_email"
                                    containerStyle="mt-4"
                                    labelTitle="Email"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    defaultValue={registerObj.user_password}
                                    type="password"
                                    updateType="user_password"
                                    containerStyle="mt-4"
                                    labelTitle="Password"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    defaultValue={registerObj.user_numero}
                                    updateType="user_numero"
                                    containerStyle="mt-4"
                                    labelTitle="Phone Number"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    defaultValue={registerObj.user_whatsapp_uid}
                                    updateType="user_whatsapp_uid"
                                    containerStyle="mt-4"
                                    labelTitle="WhatsApp UID"
                                    updateFormValue={updateFormValue}
                                />
                            </div>

                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button
                                type="submit"
                                className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}
                                disabled={loading}
                            >
                                Register
                            </button>

                            <div className="text-center mt-4">
                                Already have an account?{" "}
                                <Link to="/login">
                                    <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                                        Login
                                    </span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
