import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { MapPin, Star, Navigation, ArrowRight, Landmark } from 'lucide-react';

const places = [
  {
    id: 1,
    name: 'Hazur Sahib Gurudwara',
    location: 'Nanded, Maharashtra',
    distance: '3.2 km away',
    rating: 4.9,
    description: 'One of the five takhts in Sikhism, built at the site where Guru Gobind Singh died.',
    safety: 'High Safety Zone',
    coordinates: { lat: 19.1436, lng: 77.3204 }
  },
  {
    id: 2,
    name: 'Ajanta Caves',
    location: 'Aurangabad, Maharashtra',
    distance: '250 km away',
    rating: 4.8,
    description: 'Ancient rock-cut Buddhist cave monuments dating from the 2nd century BCE.',
    safety: 'Monitored Zone',
    coordinates: { lat: 20.5519, lng: 75.7033 }
  },
  {
    id: 3,
    name: 'Ellora Caves',
    location: 'Aurangabad, Maharashtra',
    distance: '260 km away',
    rating: 4.8,
    description: 'A UNESCO World Heritage site featuring impressive Hindu, Buddhist, and Jain temples.',
    safety: 'Monitored Zone',
    coordinates: { lat: 20.0268, lng: 75.1771 }
  },
  {
    id: 4,
    name: 'Gateway of India',
    location: 'Mumbai, Maharashtra',
    distance: '580 km away',
    rating: 4.7,
    description: 'An arch monument built in the early 20th century, overlooking the Arabian Sea.',
    safety: 'High Safety Zone',
    coordinates: { lat: 18.9220, lng: 72.8347 }
  },
  {
    id: 5,
    name: 'Mahabaleshwar',
    location: 'Satara, Maharashtra',
    distance: '420 km away',
    rating: 4.6,
    description: 'A beautiful hill station known for its strawberries and panoramic valley views.',
    safety: 'Safe Zone',
    coordinates: { lat: 17.9307, lng: 73.6477 }
  },
  {
    id: 6,
    name: 'Nanded Fort',
    location: 'Nanded, Maharashtra',
    distance: '5.1 km away',
    rating: 4.3,
    description: 'Historical ruins offering a glimpse into the region\'s rich architectural past.',
    safety: 'Caution (Low Lighting)',
    coordinates: { lat: 19.1415, lng: 77.3060 }
  }
];

const TouristPlaces = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleRouteClick = (place) => {
    // Navigate to dashboard and pass the destination coordinates in state
    navigate('/tourist/dashboard', { state: { routeTo: place.coordinates, placeName: place.name } });
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-800/20 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar role="Tourist" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <Navbar title="Explore Places" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 fade-in-up">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Recommended for You
              </h2>
              <p className="text-slate-500 mt-1">Discover safe and highly-rated tourist destinations in Maharashtra.</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <Card key={place.id} className="flex flex-col group hover:border-blue-200 transition-colors">
                  
                  {/* Top Row: Icon & Safety Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                      <Landmark size={24} />
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm 
                      ${place.safety.includes('High') ? 'bg-emerald-100 text-emerald-700' : 
                        place.safety.includes('Caution') ? 'bg-amber-100 text-amber-700' : 
                        'bg-blue-100 text-blue-700'}`}
                    >
                      {place.safety}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {place.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" /> {place.rating}
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                      <MapPin size={14} /> {place.location}
                    </p>
                    
                    <p className="text-sm text-slate-600 mb-6 flex-1 leading-relaxed">
                      {place.description}
                    </p>
                    
                    {/* Action Bar */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Navigation size={14} /> {place.distance}
                      </span>
                      <button 
                        onClick={() => handleRouteClick(place)}
                        className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        Get Route <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TouristPlaces;
