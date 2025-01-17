import DashboardStats from './components/DashboardStats';
import AmountStats from './components/AmountStats';
import PageStats from './components/PageStats';

import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import CircleStackIcon from '@heroicons/react/24/outline/CircleStackIcon';
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon';
import UserChannels from './components/UserChannels';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import DashboardTopBar from './components/DashboardTopBar';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import DoughnutChart from './components/DoughnutChart';
import { useState, useEffect } from 'react';

function Dashboard() {
    const [statsData, setStatsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError("");

                // Fetch total users
                const totalUsersResponse = await fetch("https://wellbe-api.onrender.com/api/v1/users");
                if (!totalUsersResponse.ok) throw new Error("Failed to fetch total clients");
                const totalUsers = await totalUsersResponse.json();

                // Example logic for filtering active and non-active clients
                const activeClients = totalUsers.filter(user => user.isActive).length;
                const nonActiveClients = totalUsers.length - activeClients;

                setStatsData([
                    {
                        title: "Total Clients",
                        value: totalUsers.length.toString(),
                        icon: <UserGroupIcon className="w-8 h-8" />,
                        description: "",
                    },
                    {
                        title: "Clients Non Actif",
                        value: nonActiveClients.toString(),
                        icon: <CircleStackIcon className="w-8 h-8" />,
                        description: "",
                    },
                    {
                        title: "Clients Actifs",
                        value: activeClients.toString(),
                        icon: <UsersIcon className="w-8 h-8" />,
                        description: "",
                    },
                ]);
            } catch (err) {
                setError(err.message || "An error occurred while fetching stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const updateDashboardPeriod = (newRange) => {
        // Dashboard range changed, write code to refresh your values
        dispatch(showNotification({ message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status: 1 }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            {/** ---------------------- Select Period Content ------------------------- */}
            <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />

            {/** ---------------------- Different stats content 1 ------------------------- */}
            <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                {
                    statsData.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k} />
                        );
                    })
                }
            </div>

            {/** ---------------------- Different charts ------------------------- */}
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <LineChart />
                <BarChart />
            </div>
        </>
    );
}

export default Dashboard;
