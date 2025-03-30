import { FaCarAlt, FaCarBattery, FaCarSide, FaHeadset, FaUsers, } from "react-icons/fa";
import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from "react";
import httpClient from "../shared/axios";

export default function Admindashboard() {
  const [data, setData] = useState({})
  useEffect(() => {
    const getStatistics = async () => {
      const res = await httpClient('/admin/statistics')
      setData(res.data)
    }

    getStatistics()
  }, [])
  return (
    <AdminLayout>
      <div className="total-user">
        <h3> <FaHeadset className="icons"></FaHeadset> Total Admins</h3>
        <p> {data.admins}</p>
      </div>

      <div className="total-user">
        <h3> <FaUsers className="icons"></FaUsers> Total Users</h3>
        <p> {data.users}</p>
      </div>

      <div className="total-car">
        <h3><FaCarSide className="icons"></FaCarSide> Total Cars</h3>
        <p>{data.totalModels}</p>
      </div>

      <div className="total-car">
        <h3><FaCarBattery className="icons"></FaCarBattery> Total Makes</h3>
        <p>{data.totalMakes}</p>
      </div>
    </AdminLayout>
  )
}
