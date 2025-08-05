import React from 'react';

interface Project {
  id: number;
  name: string;
  business_name: string;
  business_type: string;
  status: string;
  domain?: string;
  wp_admin_url?: string;
  trial_expires_at?: string;
  created_at: string;
  template?: {
    name: string;
    preview_image: string;
  };
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', color: 'bg-green-100 text-green-800' },
      generating: { label: 'قيد الإنشاء', color: 'bg-yellow-100 text-yellow-800' },
      draft: { label: 'مسودة', color: 'bg-gray-100 text-gray-800' },
      failed: { label: 'فشل', color: 'bg-red-100 text-red-800' },
      archived: { label: 'مؤرشف', color: 'bg-purple-100 text-purple-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTrialTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'انتهت';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} يوم`;
    return `${hours} ساعة`;
  };

  return (
    <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{project.business_name}</h3>
            {getStatusBadge(project.status)}
          </div>
          <p className="text-gray-600 mb-2">{project.name}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>نوع النشاط: {project.business_type === 'company' ? 'شركة' : project.business_type === 'store' ? 'متجر' : 'صفحة هبوط'}</span>
            <span>تاريخ الإنشاء: {new Date(project.created_at).toLocaleDateString('ar-EG')}</span>
          </div>
          
          {project.trial_expires_at && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-yellow-800 font-medium">
                  فترة التجربة تنتهي خلال: {getTrialTimeRemaining(project.trial_expires_at)}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {project.template && (
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 mr-4">
            <img 
              src={`/storage/${project.template.preview_image}`} 
              alt={project.template.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {project.status === 'active' && project.wp_admin_url && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              زيارة الموقع
            </a>
            <a
              href={project.wp_admin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              لوحة التحكم
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
