import { memo } from "react";
import { highlightText } from "../../shared/highlightText";
import NoData from '../../components/NoData'
import Loading from '../../components/Loading'
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTable = memo(({ data, isLoading, search, onDelete, onEdit }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Phone number</th>
                    <th>Role</th>
                    <th className="text-center">Created At</th>
                    <th className="text-end">Action</th>
                </tr>
            </thead>
            <tbody>
                {isLoading ? (
                    <Loading />
                ) : data?.length === 0 ? (
                    <NoData />
                ) : (
                    data?.map((item) => (
                        <tr className={item.isActive ? '' : 'notActive'} key={item.id}>
                            <td className="filtered">{item.id}</td>
                            <td className="filtered">{highlightText(item.firstname, search)}</td>
                            <td className="filtered"><a style={{color: '#0d6efd !important'}} href={`tel: ${item.phoneNumber}`}>{item.phoneNumber}</a></td>
                            <td className="filtered"> {item.role}</td>
                            <td className="text-center">12.12.12</td>
                            <td className="text-end">
                                <button
                                    onClick={() => onDelete(item)}
                                    className="btn btn-danger me-3"
                                >
                                    <FaTrash />
                                </button>
                                <button
                                    onClick={() => onEdit(item)}
                                    className="btn btn-primary"
                                >
                                    <FaEdit />
                                </button>
                            </td>
                        </tr>
                    ))
                )}

            </tbody>
        </table>
    )
})

export default UserTable;