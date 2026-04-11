import Link from 'next/link';

export default function FormListItem({ id, title, status, deadline, type }) {
  const getStatusStyle = (s) => {
    switch (s.toLowerCase()) {
      case 'complete': return { background: '#dcfce7', color: '#16a34a' };
      case 'pending': return { background: '#fef9c3', color: '#a16207' };
      case 'offline': return { background: '#e2e8f0', color: '#64748b' };
      default: return { background: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <Link href={`/forms/${id}`} className="form-list-item" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '12px 20px', 
      background: '#fff', 
      border: '1px solid #e2e8f0', 
      borderRadius: '10px', 
      textDecoration: 'none', 
      color: '#1e293b',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      fontSize: '14px'
    }}>
      <div className="form-info" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontWeight: '600' }}>{id} - {title}</span>
      </div>
      <div className="form-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ 
          padding: '4px 10px', 
          borderRadius: '999px', 
          fontSize: '11px', 
          fontWeight: '700', 
          textTransform: 'uppercase',
          ...getStatusStyle(status)
        }}>{status}</span>
        {deadline && (
          <span style={{ 
            padding: '4px 10px', 
            borderRadius: '999px', 
            fontSize: '11px', 
            fontWeight: '600', 
            background: '#fee2e2', 
            color: '#991b1b' 
          }}>{deadline}</span>
        )}
        <span style={{ 
          padding: '4px 10px', 
          borderRadius: '999px', 
          fontSize: '11px', 
          fontWeight: '600', 
          background: type === 'Mandatory' ? '#ffedd5' : '#f1f5f9', 
          color: type === 'Mandatory' ? '#9a3412' : '#475569' 
        }}>
          {type}
        </span>
        <i className="fas fa-arrow-right" style={{ color: '#84cc16', marginLeft: '5px' }}></i>
      </div>
    </Link>
  );
}
