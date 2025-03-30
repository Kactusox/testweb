import React from 'react';
import styles from '../style/cardetails.module.css';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../shared/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Loading from '../components/Loading';
import { getCorrectFuelType, getCorrectTransmissionType, handleApiError, numberFormat } from '../shared/helper';
import NoData from '../components/NoData';

const CarDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [modelData, setModelData] = useState(null);
  const [filteredYear, setFilteredYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const modelId = searchParams.get('model');
  const yearParam = searchParams.get('year');

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/public/model/${modelId}`);
        setModelData(data);

        const yearData = data.years.find(y => y.year === Number(yearParam));
        if (!yearData) {
          throw new Error('Year not found for this model');
        }
        setFilteredYear(yearData);
      } catch (error) {
        setError(error.message);
        handleApiError(error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (modelId && yearParam) {
      fetchModelData();
    } else {
      navigate('/');
    }
  }, [modelId, yearParam, navigate]);

  if (loading) return <Loading />;
  if (error) return <NoData />;

  return (
    <div className={styles['car-details-container']}>
      <h5 className='text-start pb-5' onClick={() => navigate(-1)}>&#8592; Back icon*</h5>
      {modelData && filteredYear && (
        <>
          <div className="car-image-wrapper">
            <Swiper
              pagination={{ dynamicBullets: true }}
              modules={[Pagination]}
              loop={true}
              className="mySwiper"
            >
              {modelData.images.map((img) => (
                <SwiperSlide key={img.id}>
                  <img
                    src={img.imageUrl}
                    alt={modelData.modelName}
                    className="img-fluid"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <h2 className={styles['car-name']}>{modelData.modelName}</h2>

          <table className={styles['car-specs-table']}>
            {/* <p>{modelData.modelDescription}</p> */}
            
            <tbody>
              <tr>
                <td>Base Price:</td>
                <td>${numberFormat(filteredYear.price || 0)}</td>
              </tr>
              <tr>
                <td>Engine Name:</td>
                <td>{filteredYear.makeName}</td>
              </tr>
              <tr>
                <td>Fuel:</td>
                <td>{getCorrectFuelType(filteredYear.fuelType)}</td>
              </tr>
              <tr>
                <td>Transmission:</td>
                <td>{getCorrectTransmissionType(filteredYear.transmission)}</td>
              </tr>
              <tr>
                <td>Engine Power:</td>
                <td>{filteredYear.enginePower} KW</td>
              </tr>
              <tr>
                <td>HP:</td>
                <td>{filteredYear.horsePower} Hp</td>
              </tr>
              <tr>
                <td>Top Speed:</td>
                <td>{filteredYear.topSpeed} Mph</td>
              </tr>
              <tr>
                <td>Fuel Economy:</td>
                <td>{filteredYear.fuelEconomy} Mph</td>
              </tr>
              <tr>
                <td>Emissions:</td>
                <td>{filteredYear.emissions} g CO2/Km</td>
              </tr>
              {/* <tr>
                <td>Available Colors:</td>
                <td className='d-flex align-items-center justify-content-end'>
                  {modelData.colors.map(color => (
                    <div
                      key={color.id}
                      style={{
                        backgroundColor: color.colorCode,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '1px solid #ddd',
                        boxShadow: '0 0 10px #cecece'
                      }}
                      title={color.colorCode}
                    />
                  ))}
                </td>
              </tr> */}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CarDetails;