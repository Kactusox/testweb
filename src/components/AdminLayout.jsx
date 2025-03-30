

import { FaCarSide, FaUserFriends, FaChartBar, FaSignOutAlt, FaInbox } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { FaMoneyCheckDollar } from "react-icons/fa6";

export default function AdminLayout({ children }) {
    const [date, setDate] = useState(new Date());
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return function cleanup() {
            clearInterval(timer);
        };
    });
    const handleLogOut = () => {
        dispatch(logout());
        navigate('/');
    }
    return (
        <div className="AdminLayout">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome Admin {date.toLocaleTimeString()}</p>
            </div>

            <div className="bodyContainer">
                <div className="sidebar">
                    <ul className="dashboard-options">
                        <Link to='/admin' className="list-options"><FaChartBar className="icons"></FaChartBar>Dashboard</Link>
                        <Link to='/admin-company' className="list-options"><FaMoneyCheckDollar className="icons"></FaMoneyCheckDollar> Make Management</Link>
                        <Link to='/admin-car' className="list-options"><FaCarSide className="icons"></FaCarSide> Car Management</Link>
                        <Link to='/users' className="list-options"><FaUserFriends className="icons"></FaUserFriends> User Management</Link>
                        <Link to='/inbox' className="list-options"><FaInbox className="icons"></FaInbox> Inbox</Link>
                        <Link to='/admin' className="list-options"><CiSettings className="icons"></CiSettings> System Settings</Link>
                    </ul>

                    <button type="button" onClick={handleLogOut} className="logout"><FaSignOutAlt className="icons"></FaSignOutAlt>  Log Out</button>
                </div>

                <div className="mainBody">
                    {children}
                </div>

            </div >
        </div >
    )
}
