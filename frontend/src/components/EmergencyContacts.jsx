import React from 'react';
import Card from './Card';
import { PhoneCall, ShieldAlert, Ambulance, Flame } from 'lucide-react';

const EmergencyContacts = () => {
  // In a full implementation, we could fetch these dynamically based on location.
  // For now, we display universal/common numbers or standard local equivalents.
  
  const contacts = [
    {
      name: 'Police',
      number: '911',
      icon: <ShieldAlert size={20} className="text-blue-500" />,
      bg: 'bg-blue-50'
    },
    {
      name: 'Ambulance',
      number: '912',
      icon: <Ambulance size={20} className="text-emerald-500" />,
      bg: 'bg-emerald-50'
    },
    {
      name: 'Fire Department',
      number: '913',
      icon: <Flame size={20} className="text-red-500" />,
      bg: 'bg-red-50'
    },
    {
      name: 'Tourist Helpline',
      number: '1-800-TOURIST',
      icon: <PhoneCall size={20} className="text-purple-500" />,
      bg: 'bg-purple-50'
    }
  ];

  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Local Emergency Contacts
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contacts.map((contact, index) => (
          <a
            key={index}
            href={`tel:${contact.number}`}
            className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group"
          >
            <div className={`p-3 rounded-lg ${contact.bg} group-hover:scale-105 transition-transform`}>
              {contact.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{contact.name}</p>
              <p className="text-lg font-bold text-slate-800">{contact.number}</p>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
};

export default EmergencyContacts;
