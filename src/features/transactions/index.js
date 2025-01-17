import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import TitleCard from "../../components/Cards/TitleCard";
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import SearchBar from "../../components/Input/SearchBar";

const TopSideButtons = ({ removeFilter, applySearch }) => {
    const [searchText, setSearchText] = useState("");

    const handleSearch = () => {
        if (searchText === "") {
            removeFilter();
        } else {
            applySearch(searchText);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [searchText]);

    return (
        <div className="inline-block float-right">
            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText} />
        </div>
    );
};

function Transactions() {
    const dispatch = useDispatch();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);

    // Fetch Appointments Data
    const fetchAppointments = async () => {
        try {
            const response = await fetch("https://wellbe-api.onrender.com/api/v1/appointments");
            if (!response.ok) throw new Error("Failed to fetch appointments");
            const data = await response.json();

            // If the API includes user names, directly use them.
            // Otherwise, make additional API calls to get user details if required.
            setAppointments(data);
            setFilteredAppointments(data); // Save the full data for filtering
        } catch (error) {
            console.error("Error fetching appointments:", error.message);
            dispatch(showNotification({ message: error.message, status: 0 }));
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const removeFilter = () => {
        setFilteredAppointments(appointments); // Reset to full data
    };

    // Search by user name, `user_uuid`, or `schedule_uuid`
    const applySearch = (value) => {
        const filtered = appointments.filter(
            (appointment) =>
                (appointment.user_name &&
                    appointment.user_name.toLowerCase().includes(value.toLowerCase())) ||
                appointment.user_uuid.toLowerCase().includes(value.toLowerCase()) ||
                appointment.schedule_uuid.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredAppointments(filtered);
    };

    return (
        <>
            <TitleCard
                title="Appointments"
                topMargin="mt-2"
                TopSideButtons={<TopSideButtons applySearch={applySearch} removeFilter={removeFilter} />}
            >
                {/* Appointments list in table format */}
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Schedule UUID</th>
                                <th>User UUID</th>
                                <th>User Name</th>
                                <th>Appointment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.schedule_uuid}</td>
                                    <td>{appointment.user_uuid}</td>
                                    <td>{appointment.user_name || "N/A"}</td>
                                    <td>{moment(appointment.appointment_date).format("D MMM YYYY, h:mm A")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </>
    );
}

export default Transactions;
