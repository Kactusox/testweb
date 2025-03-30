import { Search } from 'lucide-react';
import './adminpageStyle/adminCarStyle.css';
import AdminLayout from '../components/AdminLayout';
import { useCallback, useEffect, useState } from 'react';
import httpClient, { BASE_URL } from '../shared/axios';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { toast } from 'react-toastify';
import { handleApiError } from '../shared/helper';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ModelModal from './components/ModelModal';

function CarManagement() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentModel, setCurrentModel] = useState(null);

    const handleModalOpen = (model = null) => {
        setCurrentModel(model);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentModel(null);
    };

    const handleDelete = async (item) => {
        try {
            await httpClient.delete(`/admin/model/${item.id}`);
            toast.success(item.modelName + ' deleted successfully');
            getModels();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleSubmitSuccess = () => {
        getModels();
        handleModalClose();
    };

    const getModels = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await httpClient.get(BASE_URL + "/admin/model");
            setData(data);
            setFilteredData(data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (search.trim()) {
            const filtered = data.filter((item) =>
                item.modelName.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    }, [search, data]);

    useEffect(() => {
        getModels();
    }, [getModels]);

    useEffect(() => {
        console.log("Fetched data", data);
    }, [data]);

    return (
        <AdminLayout>
            <div className="headWrap">
                <h1>Car Management</h1>
                <div className="wrap">
                    <div className="input-group">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="form-control"
                            type="text"
                            placeholder="Search Models"
                        />
                        <span className="input-group-text bg-white border-end-0">
                            <Search className="text-muted" size={20} />
                        </span>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleModalOpen()}
                    >
                        Add Car
                    </button>
                </div>
            </div>

            <div className="row py-5">
                {isLoading ? (
                    <Loading />
                ) : filteredData.length === 0 ? (
                    <NoData />
                ) : (
                    filteredData.map((item) => (
                        <div key={item.id} className="col-lg-4 mb-4">
                            <div className="cards">
                                {!!item.images && (
                                    <Swiper
                                        pagination={{
                                            dynamicBullets: true,
                                        }}
                                        loop={true}
                                        modules={[Pagination]}
                                        className="mySwiper"
                                    >
                                        {item.images.map((img) => (
                                            <SwiperSlide key={img.id}>
                                                <div className="image-container" style={{ height: "250px", overflow: "hidden" }}>
                                                    <img 
                                                        className="w-100 h-100" 
                                                        src={img.imageUrl} 
                                                        alt="" 
                                                        style={{ objectFit: "cover", objectPosition: "center" }}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                )}
                                <h5 className='mt-3'>{item.modelName}</h5>
                                <p>{item.years?.[0]?.makeName || 'N/A'} - {item.years?.[0]?.year || 'Year Unavailable'}</p>
                                <button
                                    className="btn btn-warning me-3"
                                    onClick={() => handleModalOpen(item)}
                                >
                                    <FaEdit color='#000'/> Edit
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleDelete(item)}
                                    className="btn btn-danger"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ModelModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmitSuccess={handleSubmitSuccess}
                initialData={currentModel}
            />
        </AdminLayout>
    );
};

export default CarManagement;