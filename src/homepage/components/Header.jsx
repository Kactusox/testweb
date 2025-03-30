import { Link, useNavigate } from 'react-router-dom';
import '../../style/mainPage.css'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { handleApiError } from '../../shared/helper';
import axios from 'axios';
import { BASE_URL } from '../../shared/axios';

export default function Header() {
    const navigate = useNavigate()
    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [year, setYear] = useState('')
    const [data, setData] = useState([])
    const [models, setModels] = useState([])
    const [years, setYears] = useState([])

    const user = '';
    

    const handleSignInClick = () => {
        navigate('/login');
    };

    const getCars = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/public/make/all-active`);
            setData(data);
        } catch (error) {
            handleApiError(error)
        }
    }

    useEffect(() => {
        getCars()
    }, [])

    const handleChangeMake = (e) => {
        const selectedMake = e.target.value;
        setMake(selectedMake);
        setModel('');
        setYear('');

        // Find the selected make object
        const makeObj = data.find(m => m.makeName === selectedMake);
        setModels(makeObj?.models || []);
    }

    const handleChangeModel = (e) => {
        const selectedModelId = e.target.value;
        setModel(selectedModelId);
        setYear('');

        // Find the selected model object
        const modelObj = models.find(m => m.id === selectedModelId);
        setYears(modelObj?.years || []);
    }

    const handleChangeYear = (e) => {
        setYear(e.target.value);
    }

    const handleSearchClick = () => {
        if (make && model && year) {
            navigate(`/searchresult?model=${model}&year=${year}`);
        }
    }

    return (
        <>
        <div className='mainContainer'>
            <header className="header">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1>Car Comparison</h1>
                    <nav>
                        <ul className="nav">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <button className="sign-in-btn" onClick={handleSignInClick}>
                                <FontAwesomeIcon className='icon' icon={faUser} /> Sign In
                            </button>
                        </ul>
                    </nav>
                </div>
            </header>


            <div className="text-center">
                <h2>Find Your Perfect Car by Comparing</h2>
                <div className="search-bar">
                    <select onChange={handleChangeMake} value={make}>
                        <option value="">Select Make</option>
                        {data?.map((item) => (
                            <option key={item.id} value={item.makeName}>{item.makeName}</option>
                        ))}
                    </select>

                    <select
                        onChange={handleChangeModel}
                        value={model}
                        disabled={!make}
                    >
                        <option value="">Select Model</option>
                        {models?.map((model) => (
                            <option key={model.id} value={model.id}>{model.modelName}</option>
                        ))}
                    </select>

                    <select
                        onChange={handleChangeYear}
                        value={year}
                        disabled={!model}
                    >
                        <option value="">Select Year</option>
                        {years?.map((year) => (
                            <option key={year.id} value={year.year}>{year.year}</option>
                        ))}
                    </select>

                    <button
                        type='button'
                        className="searchBtn"
                        onClick={handleSearchClick}
                        disabled={!make || !model || !year}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />Search Cars
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}