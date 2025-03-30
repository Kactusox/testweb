import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { handleApiError } from '../../shared/helper';
import httpClient from '../../shared/axios';

const initialYear = {
    year: '',
    price: '',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    enginePower: '',
    horsePower: '',
    topSpeed: '',
    fuelEconomy: '',
    emissions: '',
};

export default function ModelForm() {
    const [modelName, setModelName] = useState('');
    const [modelDescription, setModelDescription] = useState('');
    const [colors, setColors] = useState([{ colorCode: '#000000' }]);
    const [years, setYears] = useState([initialYear]);
    const [isActive, setIsActive] = useState(true);
    const [images, setImages] = useState([]);
    const [makeId, setMakeId] = useState('');
    const [makes, setMakes] = useState([]);

    const updateArray = (index, value, setter) => {
        setter(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...value };
            return updated;
        });
    };

    const addItem = (setter, newItem) => {
        setter(prev => [...prev, newItem]);
    };

    const removeItem = (index, setter) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const addImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImages(prev => [...prev, file]);
        }
    };

    const validateForm = () => {
        if (!modelName || !modelDescription || !makeId || images.length === 0) return false;

        for (const color of colors) {
            if (!color.colorCode) return false;
        }
        for (const year of years) {
            for (const key in year) {
                if (!year[key]) return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fill all required fields.');
            return;
        }

        const uniqueYears = Array.from(new Set(years.map(JSON.stringify))).map(JSON.parse);

        const modelCreateDto = {
            modelName,
            modelDescription,
            colors: colors.filter(c => c.colorCode),
            years: uniqueYears,
            isActive,
        };

        const formData = new FormData();
        formData.append(
            'modelCreateDto',
            new Blob([JSON.stringify(modelCreateDto)], { type: 'application/json' })
        );
        images.forEach(image => formData.append('images', image));

        try {
            await httpClient.post(`/admin/model/${makeId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Model created successfully!');
        } catch (err) {
            handleApiError(err);
        }
    };

    const getCompanies = useCallback(async () => {
        try {
            const { data } = await httpClient.get("/admin/make/all");
            setMakes(data);
            setMakeId(data[0]?.id || '');
        } catch (err) {
            handleApiError(err);
        }
    }, []);

    useEffect(() => {
        getCompanies();
    }, [getCompanies]);

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create Model</h3>

            <div>
                <label>Model Name:</label>
                <input required value={modelName} onChange={e => setModelName(e.target.value)} />
            </div>

            <div>
                <label>Model Description:</label>
                <input required value={modelDescription} onChange={e => setModelDescription(e.target.value)} />
            </div>

            <div>
                <label>Choose Make:</label>
                <select value={makeId} onChange={e => setMakeId(e.target.value)} required>
                    <option value="" disabled>Select Make</option>
                    {makes.map(make => (
                        <option key={make.id} value={make.id}>{make.makeName}</option>
                    ))}
                </select>
            </div>

            <div>
                <h4>Colors</h4>
                {colors.map((color, index) => (
                    <div key={index}>
                        <input
                            required
                            type="color"
                            value={color.colorCode}
                            onChange={e => updateArray(index, { colorCode: e.target.value }, setColors)}
                        />
                        {colors.length > 1 && (
                            <button type="button" onClick={() => removeItem(index, setColors)}>Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addItem(setColors, { colorCode: '#000000' })}>Add Color</button>
            </div>

            <div>
                <h4>Years</h4>
                {years.map((year, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                        {Object.entries(year).map(([key, value]) => (
                            (key !== 'transmission' && key !== 'fuelType') ? (
                                <input
                                    key={key}
                                    required
                                    type="number"
                                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={value}
                                    onChange={e => updateArray(index, { [key]: e.target.value }, setYears)}
                                />
                            ) : null
                        ))}

                        <select
                            value={year.transmission}
                            onChange={e => updateArray(index, { transmission: e.target.value }, setYears)}
                        >
                            <option value="AUTOMATIC">AUTOMATIC</option>
                            <option value="MANUAL">MANUAL</option>
                            <option value="CVT">CVT</option>
                        </select>

                        <select
                            value={year.fuelType}
                            onChange={e => updateArray(index, { fuelType: e.target.value }, setYears)}
                        >
                            <option value="PETROL">PETROL</option>
                            <option value="ELECTRIC">ELECTRIC</option>
                            <option value="HYBRID">HYBRID</option>
                            <option value="DIESEL">DIESEL</option>
                        </select>

                        {years.length > 1 && (
                            <button type="button" onClick={() => removeItem(index, setYears)}>Remove Year</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addItem(setYears, { ...years[years.length - 1] })}>Add Year</button>
            </div>

            <div>
                <h4>Images</h4>
                <input type="file" accept="image/*" onChange={addImage} />
                <div>
                    {images.map((image, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={URL.createObjectURL(image)} alt="preview" width="100px" />
                            <button type="button" onClick={() => removeItem(index, setImages)}>Remove</button>
                        </div>
                    ))}
                </div>
            </div>

            <label>
                Active:
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
            </label>

            <br />
            <button className='btn btn-primary' type="submit">Submit</button>
        </form>
    );
}
