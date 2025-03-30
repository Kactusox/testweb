import React, { useEffect, useState } from "react";
import './adminpageStyle/inbox.css'
import AdminLayout from "../components/AdminLayout";
import httpClient from "../shared/axios";
import { toast } from "react-toastify";
import { formatDate } from "../shared/helper";
import Loading from "../components/Loading";
import NoData from "../components/NoData";

function Inbox() {
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const getFeedbacks = async () => {
            setIsLoading(true)
            try {
                const { data } = await httpClient.get('/admin/inbox')
                setMessages(data)
            } catch (error) {
                toast.error('Error fetching feedbacks:', error)
            } finally {
                setIsLoading(false)
            }
        }

        getFeedbacks()
    }, [])
    return (
        <AdminLayout>

            <div className="custom-div d-flex justify-content-between h-5 bg-color-white">
                <h2>Messages</h2>
            </div>

            {isLoading ? (
                <Loading />
            ) : messages.length === 0 ? (
                <NoData />
            ) : (
                messages.map((msg) => (
                    <div className="msg-box mb-4" key={msg.id}>
                        <p><strong>Full Name:</strong> {msg.fullName}</p>
                        <p><strong>Email Address:</strong> {msg.email}</p>
                        <hr />
                        <p>{msg.description}</p>
                        {!!msg.created && <i><b>Sent at:</b> {formatDate(msg.created)}</i>}
                    </div>
                ))
            )}

        </AdminLayout>
    );
}

export default Inbox;