import PropTypes from 'prop-types';
import "../styles/components/StatCard.css";

function StatCard({ icon: Icon, title, value, trend, color = "primary", onClick }) {
    const iconColors = {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444"
    };

    return (
        <div
            onClick={onClick}
            className={`stat-card ${onClick ? "clickable" : ""}`}
        >
            <div className="stat-card-content">
                <div className="stat-card-info">
                    <p className="stat-card-title">{title}</p>
                    <h3 className="stat-card-value">{value}</h3>
                    {trend && (
                        <p className={`stat-card-trend ${trend.startsWith('+') ? "trend-up" : "trend-down"}`}>
                            {trend}
                        </p>
                    )}
                </div>

                <div className={`stat-card-icon-container icon-bg-${color}`}>
                    {Icon && <Icon size={24} color={iconColors[color]} />}
                </div>
            </div>
        </div>
    );
}

StatCard.propTypes = {
    icon: PropTypes.elementType,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    trend: PropTypes.string,
    color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger']),
    onClick: PropTypes.func
};

export default StatCard;

