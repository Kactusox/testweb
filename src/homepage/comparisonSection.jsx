import React, { useEffect, useState } from "react";
import '../style/mainPage.css'
import car1Img from '../img/car1.png'
import car2Img from '../img/car2.png'
import logo from '../img/Car.png'
import axios from "axios";
import { BASE_URL } from "../shared/axios";
import { handleApiError } from "../shared/helper";
import { useNavigate } from "react-router-dom";

function CompareCars() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  // State for both cars
  const [car1, setCar1] = useState({ make: '', model: '', year: '' });
  const [car2, setCar2] = useState({ make: '', model: '', year: '' });
  const [models1, setModels1] = useState([]);
  const [models2, setModels2] = useState([]);
  const [years1, setYears1] = useState([]);
  const [years2, setYears2] = useState([]);
  const [image1, setImage1] = useState(car1Img);
  const [image2, setImage2] = useState(car2Img);

  const getCars = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/public/make/all-active`);
      setData(data);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => { getCars(); }, []);

  const handleCarChange = (carNumber, type, value) => {
    const updateState = {
      1: setCar1,
      2: setCar2
    }[carNumber];

    const setModels = {
      1: setModels1,
      2: setModels2
    }[carNumber];

    const setYears = {
      1: setYears1,
      2: setYears2
    }[carNumber];

    const setImage = {
      1: setImage1,
      2: setImage2
    }[carNumber];

    if (type === 'make') {
      const makeData = data.find(m => m.makeName === value);
      updateState({ make: value, model: '', year: '' });
      setModels(makeData?.models || []);
      setYears([]);
      // Reset to default image when make changes
      setImage(carNumber === 1 ? car1Img : car2Img);
    } else if (type === 'model') {
      const models = carNumber === 1 ? models1 : models2;
      const modelData = models.find(m => m.id === value);

      // Update image if model has images
      if (modelData?.images?.length > 0) {
        setImage(modelData.images[0].imageUrl);
      } else {
        setImage(carNumber === 1 ? car1Img : car2Img);
      }

      updateState(prev => ({ ...prev, model: value, year: '' }));
      setYears(modelData?.years?.map(y => y.year) || []);
    } else if (type === 'year') {
      updateState(prev => ({ ...prev, year: value }));
    }
  };

  const handleCompare = () => {
    navigate(`/pages?model1=${car1.model}&year1=${car1.year}&model2=${car2.model}&year2=${car2.year}`);
  };

  const isCompareDisabled = !car1.make || !car1.model || !car1.year ||
    !car2.make || !car2.model || !car2.year;

  return (
    <>
      <div className='compareHeader'>
        <div className='textHeader'>
          <h3>Compare Cars</h3>
          <p>Choose Two Cars To Compare Side-By-Side</p>
        </div>
        <img src={logo} alt="car header logo" />
      </div>

      <div className="compare-cars-container">
        {/* Car 1 Card */}
        <div className="car-form-card">
          <div className="image-container">
            <img src={image1} alt="Car" className="car-image" />
          </div>

          <h2 className="form-title">{car1.model ?
            models1.find(m => m.id === car1.model)?.modelName : 'First Car'}
          </h2>

          <form className="car-forma">
            <div className="form-group">
              <label>Make</label>
              <select className="form-control"
                value={car1.make}
                onChange={(e) => handleCarChange(1, 'make', e.target.value)}
              >
                <option value="">Select Make</option>
                {data?.map(item => (
                  <option key={item.id} value={item.makeName}>
                    {item.makeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Model</label>
              <select className="form-control"
                value={car1.model}
                onChange={(e) => handleCarChange(1, 'model', e.target.value)}
                disabled={!car1.make}
              >
                <option value="">Select Model</option>
                {models1?.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.modelName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Year</label>
              <select className="form-control"
                value={car1.year}
                onChange={(e) => handleCarChange(1, 'year', e.target.value)}
                disabled={!car1.model}
              >
                <option value="">Select Year</option>
                {years1?.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Car 2 Card */}
        <div className="car-form-card">
          <div className="image-container">
            <img src={image2} alt="Car" className="car-image"/>
          </div>

          <h2 className="form-title">{car2.model ?
            models2.find(m => m.id === car2.model)?.modelName : 'Second Car'}
          </h2>

          <form className="car-forma">

            <div className="form-group">
              <label>Make</label>
              <select className="form-control"
                value={car2.make}
                onChange={(e) => handleCarChange(2, 'make', e.target.value)}
              >
                <option value="">Select Make</option>
                {data?.map(item => (
                  <option key={item.id} value={item.makeName}>
                    {item.makeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Model</label>
              <select className="form-control"
                value={car2.model}
                onChange={(e) => handleCarChange(2, 'model', e.target.value)}
                disabled={!car2.make}
              >
                <option value="">Select Model</option>
                {models2?.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.modelName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Year</label>
              <select className="form-control"
                value={car2.year}
                onChange={(e) => handleCarChange(2, 'year', e.target.value)}
                disabled={!car2.model}
              >
                <option value="">Select Year</option>
                {years2?.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>

      <button
        className="compare-btn compareBtn"
        onClick={handleCompare}
        disabled={isCompareDisabled}
      >
        Compare Cars
      </button>
    </>
  );
}

export default CompareCars;