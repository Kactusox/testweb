import { Navigate, Outlet } from "react-router-dom"
import { CAR_COMPARISON_TOKEN } from "../shared/types"

const PrivateRoutes = () => {
    let auth = localStorage.getItem(CAR_COMPARISON_TOKEN)
    return (
        auth ? <Outlet /> : <Navigate to='/' />
    )
}

export default PrivateRoutes