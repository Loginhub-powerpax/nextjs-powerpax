import Link from 'next/link';

export default function FormListItem({ id, title, status, deadline, type }) {
  const getStatusClass = (s) => {
    switch (s.toLowerCase()) {
      case 'complete': return 'status-complete';
      case 'pending': return 'status-pending';
      case 'offline': return 'status-offline';
      default: return 'status-default';
    }
  };

  return (
    <Link href={`/forms/${id}`} className="form-list-item">
      <div className="form-info">
        <span className="form-id-title">{id} - {title}</span>
      </div>
      <div className="form-actions">
        <span className={`badge ${getStatusClass(status)}`}>{status}</span>
        {deadline && <span className="badge badge-deadline">Deadline: {deadline}</span>}
        <span className={`badge badge-type ${type === 'Mandatory' ? 'type-mandatory' : 'type-optional'}`}>
          {type}
        </span>
        <i className="fas fa-arrow-right"></i>
      </div>
    </Link>
  );
}
