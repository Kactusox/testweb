import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../shared/axios';
import Loading from '../components/Loading';
import { getCorrectFuelType, getCorrectTransmissionType, getTypeValue, handleApiError, numberFormat } from '../shared/helper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../style/responsive-design/resultpage.css'
// import '../style/index.css'

function Pages() {
  const [searchParams] = useSearchParams();
  const [car1Data, setCar1Data] = useState(null);
  const [car2Data, setCar2Data] = useState(null);
  const [loading, setLoading] = useState(true);

  const model1 = searchParams.get('model1');
  const year1 = searchParams.get('year1');
  const model2 = searchParams.get('model2');
  const year2 = searchParams.get('year2');

  const [price, setPrice] = useState(5)
  const [fuelEconomy, setFuelEconomy] = useState(5)
  const [emissions, setEmissions] = useState(5)
  const [enginePower, setEnginePower] = useState(5)
  const [horsePower, setHorsePower] = useState(5)
  const [topSpeed, setTopSpeed] = useState(5)
  const [fuelType, setFuelType] = useState(5)
  const [transmission, setTransmission] = useState(5)

  const [score, setScore] = useState({ car1Score: 0, car2Score: 0 })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get(`${BASE_URL}/public/model/${model1}`),
          axios.get(`${BASE_URL}/public/model/${model2}`)
        ]);

        const car1YearData = res1.data.years.find(y => y.year === Number(year1));
        const car2YearData = res2.data.years.find(y => y.year === Number(year2));


        setCar1Data({ ...res1.data, yearData: car1YearData });
        setCar2Data({ ...res2.data, yearData: car2YearData });
      } catch (error) {
        handleApiError(error)
      } finally {
        setLoading(false);
      }
    };


    if (model1 && year1 && model2 && year2) {
      fetchData();
    } else {
      navigate('/')
    }
  }, [model1, year1, model2, year2, navigate]);


  const calculteWinner = useCallback(() => {
    if (!!car1Data && !!car2Data) {
      let totalWeight = price + fuelEconomy + emissions + enginePower + horsePower + topSpeed + fuelType + transmission

      const car1 = (car1Data.yearData.price * price) + (car1Data.yearData.fuelEconomy * fuelEconomy) + (car1Data.yearData.emissions * emissions) + (car1Data.yearData.enginePower * enginePower) + (car1Data.yearData.horsePower * horsePower) + (car1Data.yearData.topSpeed * topSpeed) + (getTypeValue(car1Data.yearData.fuelType) * fuelType) + (getTypeValue(car1Data.yearData.transmission) * transmission) / totalWeight
      const car2 = (car2Data.yearData.price * price) + (car2Data.yearData.fuelEconomy * fuelEconomy) + (car2Data.yearData.emissions * emissions) + (car2Data.yearData.enginePower * enginePower) + (car2Data.yearData.horsePower * horsePower) + (car2Data.yearData.topSpeed * topSpeed) + (getTypeValue(car2Data.yearData.fuelType) * fuelType) + (getTypeValue(car2Data.yearData.transmission) * transmission) / totalWeight

      setScore({ car1Score: car1, car2Score: car2 })

    }
  }, [car1Data, car2Data, price, fuelEconomy, emissions, enginePower, horsePower, topSpeed, fuelType, transmission]);

  useEffect(() => {
    calculteWinner()
  }, [calculteWinner])

  return (
    <div className='Pages'>
      <div className='contener'>
        <h5 className='text-start py-5' onClick={() => navigate(-1)}>&#8592; Back icon*</h5>
        <div className='result'>
          <div className='result-text'>Result</div>
        </div>
        <div className="comparison-page">
          {loading ? (
            <div><Loading /></div>
          ) : (
            <>
              <main className='img-main'>
                <div className='img-main-car'>
                  <div className="swiper-container">
                    <Swiper
                      pagination={{ dynamicBullets: true }}
                      modules={[Pagination]}
                      loop={true}
                      className="car1-swiper"
                    >
                      {car1Data?.images.map((img) => (
                        <SwiperSlide key={img.id}>
                          <img
                            src={img.imageUrl}
                            alt={img.id}
                            className="swiper-image"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  <div className="swiper-container">
                    <Swiper
                      pagination={{ dynamicBullets: true }}
                      modules={[Pagination]}
                      loop={true}
                      className="car2-swiper"
                    >
                      {car2Data?.images.map((img) => (
                        <SwiperSlide key={img.id}>
                          <img
                            src={img.imageUrl}
                            alt={img.id}
                            className="swiper-image"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </main>

              <div className='main-car-name'>
                <h3 className='car-name'>{car1Data?.modelName}</h3>
                <h3 className='car-name'>{car2Data?.modelName}</h3>
              </div>
              <div className='company'>
                <p className='car-company'>{car1Data?.yearData?.makeName}</p>
                <p className='car-company'>{car2Data?.yearData?.makeName}</p>
              </div>


              <main className='table-main'>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px', width: '100%' }}>
                  <table style={{ width: '48%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Best Price:</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>${numberFormat(car1Data?.yearData?.price || 0)}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Engine Name</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car1Data?.yearData?.makeName}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Year</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car1Data?.yearData?.year}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Fuel</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{getCorrectFuelType(car1Data?.yearData?.fuelType)}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Transmission</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{getCorrectTransmissionType(car1Data?.yearData?.transmission)}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Engine Power</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car1Data?.yearData?.enginePower} KW</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>HP</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car1Data?.yearData?.horsePower} HP</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Top Speed</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car1Data?.yearData?.topSpeed} MPH</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Emissions</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car1Data?.yearData?.emissions} G CO2/Km</td>
                      </tr>
                      {/* <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Available Colors</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }} className='d-flex align-items-center justify-content-end'>
                          {car1Data?.yearData?.colors.map(color => (
                            <div
                              key={color.id}
                              style={{
                                backgroundColor: color.colorCode,
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: '1px solid #111',
                              }}
                              title={color.colorCode}
                            />
                          ))}
                        </td>
                      </tr> */}
                    </tbody>
                  </table>

                  <table style={{ width: '48%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Best Price:</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>${numberFormat(car2Data?.yearData?.price || 0)}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Engine Name</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car2Data?.yearData?.makeName}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Year</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car2Data?.yearData?.year}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Fuel</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{getCorrectFuelType(car2Data?.yearData?.fuelType)}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Transmission</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{getCorrectTransmissionType(car2Data?.yearData?.transmission)}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Engine Power</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car2Data?.yearData?.enginePower} KW</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>HP</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car2Data?.yearData?.horsePower} HP</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Top Speed</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car2Data?.yearData?.topSpeed} MPH</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Emissions</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>{car2Data?.yearData?.emissions} G CO2/Km</td>
                      </tr>
                      {/* <tr>
                        <td style={{ textAlign: 'left', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }}>Available Colors</td>
                        <td style={{ textAlign: 'right', paddingTop: '45px', paddingBottom: '8px', borderBottom: '1px solid #ccc' }} className='d-flex align-items-center justify-content-end'>
                          {car2Data?.yearData?.colors.map(color => (
                            <div
                              key={color.id}
                              style={{
                                backgroundColor: color.colorCode,
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: '1px solid #000',
                              }}
                              title={color.colorCode}
                            />
                          ))}
                        </td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
              </main>
            </>
          )}
        </div>


        <div className='result'>
          <div className='result-text'>
            <span style={{ color: '#E0FD28' }}>Scoring</span> Results
          </div>
        </div>

        <main className='div-main'>
          <div className='main-div-left'>
            <button style={{ color: '#E47A6E' }} className='main-button'>
              {car1Data?.modelName}
            </button>
          </div>
          <div className='main-div-right'>
            <button style={{ color: '#38BA6C' }} className='main-button'>
              {car2Data?.modelName}
            </button>
          </div>
        </main>

        <main className='div-main mt-5'>
          <h5>Total: {numberFormat(Math.round(score.car1Score))}</h5>
          <h5>Total: {numberFormat(Math.round(score.car2Score))}</h5>
        </main>

        <div className='line'></div>

        <p className='Winner-car'>Winner Car: {score.car1Score > score.car2Score ? car1Data?.modelName : car2Data?.modelName}</p>

        <div className="scoring-table-container" style={{ marginTop: '30px', marginBottom: '30px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', textAlign: 'center' }}>
            <thead>
              <tr >
                <th style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Attributes</th>
                <th style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car1Data?.modelName}</th>
                <th style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car2Data?.modelName}</th>
                <th style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>Choose Custome Values (1-10)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Price ($)</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{numberFormat(car1Data?.yearData?.price || 0)}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{numberFormat(car2Data?.yearData?.price || 0)}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                  <select onChange={e => setPrice(Number(e.target.value))} defaultValue={price}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Fuel Economy (mpg)</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car1Data?.yearData?.fuelEconomy}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car2Data?.yearData?.fuelEconomy}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                  <select onChange={e => setFuelEconomy(Number(e.target.value))} defaultValue={fuelEconomy}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Emissions (g/km)</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car1Data?.yearData?.emissions}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car2Data?.yearData?.emissions}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                  <select onChange={e => setEmissions(Number(e.target.value))} defaultValue={emissions}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Engine Power (hp)</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car1Data?.yearData?.enginePower}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car2Data?.yearData?.enginePower}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                  <select onChange={e => setEnginePower(Number(e.target.value))} defaultValue={enginePower}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Horse Power (hp)</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car1Data?.yearData?.horsePower}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car2Data?.yearData?.horsePower}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                  <select onChange={e => setHorsePower(Number(e.target.value))} defaultValue={horsePower}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Top speed (km/h)</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car1Data?.yearData?.topSpeed}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{car2Data?.yearData?.topSpeed}</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                  <select onChange={e => setTopSpeed(Number(e.target.value))} defaultValue={topSpeed}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Fuel Type</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{getCorrectFuelType(car1Data?.yearData?.fuelType)} ({getTypeValue(car1Data?.yearData?.fuelType)})</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{getCorrectFuelType(car2Data?.yearData?.fuelType)} ({getTypeValue(car2Data?.yearData?.fuelType)})</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                  <select onChange={e => setFuelType(Number(e.target.value))} defaultValue={fuelType}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Transmission</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{getCorrectTransmissionType(car1Data?.yearData?.transmission)} ({getTypeValue(car1Data?.yearData?.transmission)})</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>{getCorrectTransmissionType(car2Data?.yearData?.transmission)} ({getTypeValue(car2Data?.yearData?.transmission)})</td>
                <td style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                  <select onChange={e => setTransmission(Number(e.target.value))} defaultValue={transmission}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>


        <div className='Compare-button'>
          <button className='button-compare' onClick={() => navigate('/')}>
            Compare other cars
          </button>
        </div>
      </div>
    </div >
  );
}

export default Pages;