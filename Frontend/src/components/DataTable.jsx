export default function DataTable({ columns, rows, renderActions }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => <th key={col.key}>{col.label}</th>)}
            {renderActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
              {renderActions && <td>{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
