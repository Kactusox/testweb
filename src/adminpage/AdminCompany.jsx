import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import httpClient from '../shared/axios'
import { toast } from 'react-toastify'
import CompanyModal from './components/CompanyModal'
import CompanyTable from './components/CompanyTable'
import { handleApiError } from '../shared/helper'

const initialModalState = {
    isOpen: false,
    isEdit: false,
    isActive: false,
    companyText: '',
    id: '',
}

export default function AdminCompany() {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [modalState, setModalState] = useState(initialModalState)

    const filteredData = useMemo(() => {
        if (!search) return data
        const searchLower = search.toLowerCase()
        return data.filter(item => item.makeName.toLowerCase().includes(searchLower))
    }, [search, data])

    const handleDelete = useCallback(async (item) => {
        if (item.models.length > 0) {
            toast.error(`You cannot delete ${item.makeName}`)
            return
        }

        try {
            await httpClient.delete(`/admin/make/${item.id}`)
            toast.success(`${item.makeName} deleted successfully`)
            getCompanies()
        } catch (error) {
            handleApiError(error)
        }
    }, [])

    const openEditModal = useCallback((item) => {
        setModalState({
            isOpen: true,
            isEdit: true,
            isActive: item.active,
            companyText: item.makeName,
            id: item.id,
        })
    }, [])

    const closeModal = useCallback(() => {
        setModalState(initialModalState)
    }, [])

    const handleCompanySubmit = useCallback(async (e) => {
        e.preventDefault()
        const { isEdit, id, companyText, isActive } = modalState

        try {
            const url = isEdit ? `/admin/make/${id}` : '/admin/make'
            const method = isEdit ? 'put' : 'post'

            await httpClient[method](url, {
                makeName: companyText,
                ...(isEdit && { isActive })
            })

            toast.success(`Company ${isEdit ? 'updated' : 'created'} successfully`)
            closeModal()
            getCompanies()
        } catch (error) {
            handleApiError(error)
        }
    }, [modalState])

    const getCompanies = useCallback(async () => {
        setIsLoading(true)
        try {
            const { data } = await httpClient.get("/admin/make/all")
            setData(data)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        getCompanies()
    }, [getCompanies])

    return (
        <AdminLayout>
            <div className="AdminCompany">
                <div className="headWrap">
                    <h1>Make Information</h1>
                    <div className="wrap">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="form-control"
                            type="text"
                            placeholder="Search Make"
                        />
                        <button
                            type="button"
                            onClick={() => setModalState(prev => ({ ...prev, isOpen: true }))}
                            className="btn btn-primary"
                        >
                            Add Make
                        </button>
                    </div>
                </div>

                <CompanyTable
                    data={filteredData}
                    isLoading={isLoading}
                    search={search}
                    onDelete={handleDelete}
                    onEdit={openEditModal}
                />
            </div>

            <CompanyModal
                state={modalState}
                onSubmit={handleCompanySubmit}
                onClose={closeModal}
                setState={setModalState}
            />
        </AdminLayout>
    )
}
