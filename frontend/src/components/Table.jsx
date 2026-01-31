import PropTypes from 'prop-types';
import "../styles/components/Table.css";

function Table({ columns, data, onRowClick, emptyMessage = "No data available" }) {
    if (!data || data.length === 0) {
        return (
            <div className="table-empty">
                <p className="table-empty-message">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="table-outer-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        {/* Serial Number Column */}
                        <th className="serial-col">#</th>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`${rowIndex % 2 === 0 ? "row-even" : "row-odd"} ${onRowClick ? "clickable" : ""}`}
                        >
                            {/* Serial Number Cell */}
                            <td className="serial-cell">
                                {rowIndex + 1}
                            </td>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {column.render ? column.render(row, rowIndex) : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            accessor: PropTypes.string,
            render: PropTypes.func
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    onRowClick: PropTypes.func,
    emptyMessage: PropTypes.string
};

export default Table;

