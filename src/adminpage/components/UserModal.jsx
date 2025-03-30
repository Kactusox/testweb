const UserModal = ({ state, onSubmit, onClose, setState }) => (
    <div className={`myModal ${state.isOpen ? 'active' : ''}`}>
        <form onSubmit={onSubmit} className="wrap">
            <h5 className="mb-3">{state.isEdit ? 'Edit' : 'Add'} User</h5>
            <input
                placeholder="Username"
                required
                className="form-control mb-3"
                type="text"
                value={state.firstName}
                onChange={(e) => setState(prev => ({ ...prev, firstName: e.target.value }))}
            />
            <input
                placeholder="Phone number"
                required
                className="form-control mb-3"
                type="text"
                value={state.phoneNumber}
                onChange={(e) => setState(prev => ({ ...prev, phoneNumber: e.target.value }))}
            />

            {!state.isEdit && <input
                placeholder="Password"
                required
                className="form-control mb-3"
                type="password"
                value={state.password}
                onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
            />}

            <select className="form-control mb-3" value={state.role} onChange={e => setState(prev => ({ ...prev, role: e.target.value }))} >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
            </select>
            {state.isEdit && (
                <label>
                    Active:
                    <input
                        type="checkbox"
                        checked={state.isActive}
                        onChange={(e) => setState(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                </label>
            )}
            <br />
            <button type="button" onClick={onClose} className="btn btn-danger closeBtn">
                Close
            </button>
            <button type="submit" className={`btn ${state.isEdit ? 'btn-warning' : 'btn-primary'}`}>
                {state.isEdit ? 'Save' : 'Add'}
            </button>
        </form>
        <div onClick={onClose} className="close"></div>
    </div>
)

export default UserModal;