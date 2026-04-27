import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const AlertCard = ({ title, message, type = 'warning', time }) => {
  const styles = {
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
      Icon: AlertCircle
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-800',
      Icon: AlertTriangle
    },
    safe: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      iconColor: 'text-emerald-500',
      titleColor: 'text-emerald-800',
      Icon: ShieldCheck
    }
  };

  const config = styles[type] || styles.warning;
  const Icon = config.Icon;

  return (
    <div className={`flex gap-4 p-4 rounded-xl border ${config.bg} ${config.border} transition-all hover:shadow-sm`}>
      <div className={`mt-0.5 ${config.iconColor}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h4 className={`text-sm font-bold ${config.titleColor} mb-1`}>{title}</h4>
        <p className="text-sm text-slate-600 leading-snug">{message}</p>
      </div>
      {time && (
        <div className="text-xs font-semibold text-slate-400 whitespace-nowrap">
          {time}
        </div>
      )}
    </div>
  );
};

export default AlertCard;
