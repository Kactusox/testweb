import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import './adminpageStyle/usermanagement.css'
import AdminLayout from "../components/AdminLayout";
import UserTable from "./components/UserTable";
import { toast } from "react-toastify";
import httpClient from "../shared/axios";
import UserModal from "./components/UserModal";
import { handleApiError } from "../shared/helper";

const initialModalState = {
    isOpen: false,
    isEdit: false,
    isActive: true,

    id: '',
    firstName: '',
    phoneNumber: '',
    password: '',
    role: 'USER'
}

function UserManagement() {
    const [search, setSearch] = useState('')
    const [modalState, setModalState] = useState(initialModalState)
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filteredRole, setFilteredRole] = useState('ALL')


    const handleChangeRole = (e) => {
        setFilteredRole(e.target.value)
    }

    // Delete a user 
    const deleteUser = async (item) => {
        try {
            await httpClient.delete(`/admin/user/${item.id}`)
            toast.success(item.firstName + ' deleted successfully')
            getUsers()
        } catch (error) {
            handleApiError(error)
        }
    }

    const filteredData = useMemo(() => {
        // First filter by role
        const roleFiltered = data.filter(item => {
            if (filteredRole === 'ALL') return true
            return item.role === filteredRole
        })

        // Then filter by search term
        if (!search) return roleFiltered
        const searchLower = search.toLowerCase()

        return roleFiltered.filter(item =>
            item.firstname.toLowerCase().includes(searchLower)
        )
    }, [search, data, filteredRole]) // Include filteredRole in dependencies


    const getUsers = useCallback(async () => {
        setIsLoading(true)
        try {
            const { data } = await httpClient.get("/admin/user")
            setData(data)
        }
        finally {
            setIsLoading(false)
        }
    }, [])

    const handleUserSubmit = useCallback(async (e) => {
        e.preventDefault()
        const { isEdit, id, firstName, phoneNumber, password, role, isActive } = modalState

        try {
            const url = isEdit ? `/admin/user/${id}` : '/api/v1/auth/register'
            const method = isEdit ? 'put' : 'post'

            await httpClient[method](url, {
                firstname: firstName,
                phoneNumber,
                password,
                role,
                ...(isEdit && { isActive })
            })

            toast.success(`User ${isEdit ? 'updated' : 'created'} successfully`)
            closeModal()
            getUsers()
        } catch (error) {
            handleApiError(error)
        }
    }, [modalState])

    const openEditModal = useCallback((item) => {
        setModalState({
            isOpen: true,
            isEdit: true,
            isActive: item.isActive,
            id: item.id,
            firstName: item.firstname,
            phoneNumber: item.phoneNumber,
            role: item.role,
        })
    }, [])

    const closeModal = useCallback(() => {
        setModalState(initialModalState)
    }, [])

    useEffect(() => {
        getUsers()
    }, [getUsers])

    return (
        <AdminLayout>
            <div className="headWrap">
                <h1>Users Information</h1>
                <div className="wrap">
                    <div className="input-group">
                        <select onChange={e => handleChangeRole(e)} style={{ width: '100px', textAlign: 'center' }} className="form-control">
                            <option value="ALL">All Roles</option>
                            <option value="USER">Users</option>
                            <option value="ADMIN">Admins</option>
                        </select>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="form-control"
                            type="text"
                            placeholder="Search User"
                        />
                        <span className="input-group-text bg-white border-end-0">
                            <Search className="text-muted" size={20} />
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setModalState(prev => ({ ...prev, isOpen: true }))}
                        className="btn btn-primary"
                    >
                        Add User
                    </button>
                </div>
            </div>


            <UserTable
                data={filteredData}
                isLoading={isLoading}
                search={search}
                onDelete={deleteUser}
                onEdit={openEditModal}
            />

            <UserModal
                state={modalState}
                onSubmit={handleUserSubmit}
                onClose={closeModal}
                setState={setModalState}
            />

        </AdminLayout>
    );
};

export default UserManagement;