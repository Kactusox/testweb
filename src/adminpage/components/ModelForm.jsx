import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import httpClient from '../../shared/axios';
import { handleApiError } from '../../shared/helper';

const initialYearState = {
    year: '',
    price: '',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    enginePower: '',
    horsePower: '',
    topSpeed: '',
    fuelEconomy: '',
    emissions: ''
};

const fuelTypes = ['PETROL', 'ELECTRIC', 'HYBRID', 'DIESEL'];
const transmissions = ['AUTOMATIC', 'MANUAL', 'CVT'];

const ModelForm = ({ initialData, onSubmitSuccess, onCancel }) => {
    const [makes, setMakes] = useState([]);
    const [makeId, setMakeId] = useState('')
    const [formData, setFormData] = useState({
        modelName: '',
        modelDescription: '',
        colors: [{ colorCode: '#000000' }],
        years: [{ ...initialYearState }],
        isActive: true,
        images: []
    });


    const getCompanies = useCallback(async () => {
        try {
            const { data } = await httpClient.get("/admin/make/all")
            setMakes(data)
            setMakeId(data[0]?.id)
        } catch (error) {
            handleApiError(error)
        }
    }, [])

    useEffect(() => {
        getCompanies()
    }, [getCompanies])

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                colors: initialData.colors || [],
                years: initialData.years.map(year => ({
                    ...year,
                    price: year.price?.toString() || '',
                    enginePower: year.enginePower?.toString() || '',
                    horsePower: year.horsePower?.toString() || '',
                    topSpeed: year.topSpeed?.toString() || '',
                    fuelEconomy: year.fuelEconomy?.toString() || '',
                    emissions: year.emissions?.toString() || ''
                })) || [{ ...initialYearState }],
                images: []
            });
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = (index, value) => {
        const colors = [...formData.colors];
        colors[index].colorCode = value;
        setFormData(prev => ({ ...prev, colors }));
    };

    const addColor = () => {
        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, { colorCode: '#000000' }]
        }));
    };

    const removeColor = (index) => {
        const colors = formData.colors.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, colors }));
    };

    const handleYearChange = (index, e) => {
        const { name, value } = e.target;
        const years = [...formData.years];
        years[index][name] = value;
        setFormData(prev => ({ ...prev, years }));
    };

    const addYear = () => {
        const lastYear = formData.years[formData.years.length - 1];
        const newYear = {
            ...lastYear,  // Copy all fields from previous year
            id: undefined
        };
        setFormData(prev => ({
            ...prev,
            years: [...prev.years, newYear]
        }));
    };

    const removeYear = (index) => {
        const years = formData.years.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, years }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, e.target.files[0]]
            }));
        }
    };

    const removeImage = (index) => {
        const images = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formPayload = new FormData();
        const isEdit = !!initialData;

        try {
            formData.images.forEach(image => formPayload.append('images', image));

            const modelDto = {
                modelName: formData.modelName,
                modelDescription: formData.modelDescription,
                colors: formData.colors,
                years: formData.years.map(year => ({
                    ...year,
                    price: parseFloat(year.price),
                    enginePower: parseInt(year.enginePower),
                    horsePower: parseInt(year.horsePower),
                    topSpeed: parseInt(year.topSpeed),
                    fuelEconomy: parseInt(year.fuelEconomy),
                    emissions: parseInt(year.emissions)
                })),
                isActive: formData.isActive
            };

            if (isEdit) modelDto.id = initialData.id;

            const modelDtoBlob = new Blob([JSON.stringify(modelDto)], {
                type: 'application/json'
            });

            // Append as proper JSON part
            formPayload.append('modelCreateDto', modelDtoBlob, 'model.json');

            const url = `/admin/model${isEdit ? `/${initialData.id}` : `/${makeId}`}`;
            await httpClient[isEdit ? 'put' : 'post'](url, formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success(`Model ${isEdit ? 'updated' : 'created'} successfully!`);
            onSubmitSuccess();
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label>Model Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="form-group mb-3">
                <label>Description</label>
                <textarea
                    className="form-control"
                    name="modelDescription"
                    value={formData.modelDescription}
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group mb-3">
                <label className='me-3'>Model's make: </label>
                <select value={makeId} onChange={e => setMakeId(e.target.value)}>
                    {makes.map(make => <option key={make.id} value={make.id}>{make.makeName}</option>)}
                </select>
            </div>

            {/* <div className="form-group mb-3">
                <label>Colors</label>
                {formData.colors.map((color, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                        <input
                            type="color"
                            value={color.colorCode}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="form-control form-control-color"
                        />
                        <button
                            type="button"
                            className="btn btn-danger ms-2"
                            onClick={() => removeColor(index)}
                            disabled={formData.colors.length === 1}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addColor}>
                    Add Color
                </button>
            </div> */}

            <div className="form-group mb-3">
                <label>Car Features</label>
                {formData.years.map((year, index) => (
                    <div key={index} className="border p-3 mb-3">
                        <div className="row g-3">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Year"
                                name="year"
                                value={year.year}
                                onChange={(e) => handleYearChange(index, e)}
                                required
                            />
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Price ($)"
                                name="price"
                                value={year.price}
                                onChange={(e) => handleYearChange(index, e)}
                                step="0.01"
                                required
                            />
                            <select
                                className="form-control"
                                name="transmission"
                                value={year.transmission}
                                onChange={(e) => handleYearChange(index, e)}
                                required
                            >
                                {transmissions.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <select
                                className="form-control"
                                name="fuelType"
                                value={year.fuelType}
                                onChange={(e) => handleYearChange(index, e)}
                                required
                            >
                                {fuelTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Engine Power (hp)"
                                name="enginePower"
                                value={year.enginePower}
                                onChange={(e) => handleYearChange(index, e)}
                                required
                            />
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Horse Power (hp)"
                                name="horsePower"
                                value={year.horsePower}
                                onChange={(e) => handleYearChange(index, e)}
                                required
                            />
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Top Speed (km/h)"
                                name="topSpeed"
                                value={year.topSpeed}
                                onChange={(e) => handleYearChange(index, e)}
                                required
                            />
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Fuel Economy (mpg)"
                                name="fuelEconomy"
                                value={year.fuelEconomy}
                                onChange={(e) => handleYearChange(index, e)}
                                required
                            />
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Emissions (g/km)"
                                name="emissions"
                                value={year.emissions}
                                onChange={(e) => handleYearChange(index, e)}
                                required
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-danger mt-2"
                            onClick={() => removeYear(index)}
                            disabled={formData.years.length === 1}
                        >
                            Remove Year
                        </button>
                    </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addYear}>
                    Add Year
                </button>
            </div>

            <div className="form-group mb-3">
                <label>Images</label>
                <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <div className="d-flex flex-wrap mt-2">
                    {formData.images.map((image, index) => (
                        <div key={index} className="position-relative me-2 mb-2">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                onClick={() => removeImage(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <label htmlFor='active' className="form-check-label">Active</label>
            <input
                id='active'
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            />

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    {initialData ? 'Save Changes' : 'Create Model'}
                </button>
            </div>
        </form>
    );
};

export default ModelForm;

