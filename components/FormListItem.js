import Link from 'next/link';

export default function FormListItem({ form }) {
  const { id, title, status, deadline, type } = form || {};

  const getStatusStyle = (s = '') => {
    switch (s.toLowerCase()) {
      case 'complete': return { background: '#e8f5e9', color: '#4CAF50', border: '1px solid #c8e6c9' };
      case 'pending': return { background: '#fff3e0', color: '#FF9800', border: '1px solid #ffe0b2' };
      case 'offline': return { background: '#f5f5f5', color: '#666', border: '1px solid #e0e0e0' };
      default: return { background: '#f8fafc', color: '#333', border: '1px solid #e0e0e0' };
    }
  };

  return (
    <Link href={`/forms/${id}`} className="form-list-item" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 25px', 
      background: '#fff', 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px', 
      textDecoration: 'none', 
      color: '#333',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      fontSize: '14px',
      transition: 'all 0.2s ease-in-out'
    }}>
      <div className="form-info" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontWeight: '600', color: '#2c3e50' }}>{id} - {title}</span>
      </div>
      <div className="form-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span className="badge-status" style={{ 
          padding: '4px 12px', 
          borderRadius: '4px', 
          fontSize: '11px', 
          fontWeight: '700', 
          textTransform: 'uppercase',
          ...getStatusStyle(status)
        }}>{status}</span>
        
        {deadline && (
          <span className="badge-deadline" style={{ 
            padding: '4px 12px', 
            borderRadius: '4px', 
            fontSize: '11px', 
            fontWeight: '700', 
            background: '#fff', 
            color: '#f44336',
            border: '1px solid #f44336'
          }}>{deadline}</span>
        )}

        <span className="badge-type" style={{ 
          padding: '4px 12px', 
          borderRadius: '4px', 
          fontSize: '11px', 
          fontWeight: '700', 
          background: type === 'Mandatory' ? '#FF9800' : '#333', 
          color: '#fff' 
        }}>
          {type}
        </span>
        
        <i className="fas fa-chevron-right" style={{ color: '#FF9800', marginLeft: '10px', fontSize: '12px' }}></i>
      </div>
    </Link>
  );
}
