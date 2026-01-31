import PropTypes from 'prop-types';
import "../styles/components/FormInput.css";

function FormInput({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    options = [] // For select inputs
}) {
    return (
        <div className="form-input-container">
            {label && (
                <label htmlFor={name} className="form-input-label">
                    {label} {required && <span className="required-star">*</span>}
                </label>
            )}

            {type === "select" ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`form-select-field ${error ? "error" : ""}`}
                >
                    <option value="">Select {label}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : type === "textarea" ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    rows={4}
                    className={`form-textarea-field ${error ? "error" : ""}`}
                />
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`form-input-field ${error ? "error" : ""}`}
                />
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

FormInput.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    )
};

export default FormInput;

