

const CompanyModal = ({ state, onSubmit, onClose, setState }) => (
    <div className={`myModal ${state.isOpen ? 'active' : ''}`}>
        <form onSubmit={onSubmit} className="wrap">
            <h5>{state.isEdit ? 'Edit' : 'Add'} Make</h5>
            <input
                placeholder="Make name"
                required
                className="form-control"
                type="text"
                value={state.companyText}
                onChange={(e) => setState(prev => ({ ...prev, companyText: e.target.value }))}
            />
            {state.isEdit && (
                <label className="mt-3 mb-3">
                    Active:
                    <input
                        type="checkbox"
                        checked={state.isActive}
                        onChange={(e) => setState(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                </label>
            )}
            <br />
            <button type="button" onClick={onClose} className="btn btn-danger  me-3">
                Close
            </button>
            <button type="submit" className={`btn  ${state.isEdit ? 'btn-warning' : 'btn-primary'}`}>
                {state.isEdit ? 'Save' : 'Add'}
            </button>
        </form>
        <div onClick={onClose} className="close"></div>
    </div>
)

export default CompanyModal;