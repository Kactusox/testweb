import { memo } from "react";
import { highlightText } from "../../shared/highlightText";
import NoData from '../../components/NoData'
import Loading from '../../components/Loading'
import { FaEdit, FaTrash } from "react-icons/fa";


const CompanyTable = memo(({ data, isLoading, search, onDelete, onEdit }) => (
    <table className="table mt-5">
        <thead>
            <tr>
                <th>Company Name</th>
                <th className="text-center">Connected Models</th>
                <th className="text-end">Action</th>
            </tr>
        </thead>
        <tbody>
            {isLoading ? (
                <Loading />
            ) : data.length === 0 ? (
                <NoData />
            ) : (
                data.map((item) => (
                    <tr className={item.active ? '' : 'notActive'} key={item.id}>
                        <td className="filtered">{highlightText(item.makeName, search)}</td>
                        <td className="text-center">{item.models.length}</td>
                        <td className="text-end">
                            <button
                                onClick={() => onDelete(item)}
                                disabled={item.models.length > 0}
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
))

export default CompanyTable;