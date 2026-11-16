import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, MapPin, AlertTriangle, CheckCircle2, Clock, Truck, 
  ShieldCheck, BarChart3, RefreshCw, X, ChevronRight, Filter, Search, 
  Trash2, Send, Check, AlertCircle, Building, Map, Info, UserCheck, Sparkles
} from 'lucide-react';

// Types
export type WasteType = 'Organic/Wet' | 'Dry/Recyclable' | 'Hazardous' | 'Construction & Demolition' | 'Mixed';
export type EstimatedVolume = 'Small' | 'Medium' | 'Large/Bulk';
export type UrgencyLevel = 'Normal' | 'High';
export type TicketStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Collected' | 'Resolved';

export interface Ticket {
  id: string;
  image: string;
  wasteType: WasteType;
  volume: EstimatedVolume;
  urgency: UrgencyLevel;
  description: string;
  zone: string;
  wardNumber: string;
  wardName: string;
  latitude: number;
  longitude: number;
  landmark: string;
  status: TicketStatus;
  createdAt: string;
  assignedVehicle?: string;
  supervisorNotes?: string;
  reporterName?: string;
  reporterPhone?: string;
}

const BBMP_ZONES_AND_WARDS = [
  { zone: 'East Zone', wards: ['Ward 79 - CV Raman Nagar', 'Ward 111 - Indiranagar', 'Ward 112 - Halasuru', 'Ward 114 - Shanthala Nagar'] },
  { zone: 'Mahadevapura Zone', wards: ['Ward 85 - Doddanekkundi', 'Ward 149 - Varthur', 'Ward 150 - Bellandur', 'Ward 84 - HBR Layout'] },
  { zone: 'South Zone', wards: ['Ward 152 - Jayanagar', 'Ward 168 - Jayanagar East', 'Ward 173 - Basavanagudi', 'Ward 174 - Hanumanthnagar'] },
  { zone: 'West Zone', wards: ['Ward 94 - Malleshwaram', 'Ward 95 - Rajajinagar', 'Ward 109 - Gandhi Nagar', 'Ward 110 - Chickpet'] },
  { zone: 'Bommanahalli Zone', wards: ['Ward 175 - BTM Layout', 'Ward 191 - HSR Layout', 'Ward 192 - Bommanahalli', 'Ward 193 - Mangammanapalya'] },
  { zone: 'Yelahanka Zone', wards: ['Ward 1 - Yelahanka Satellite Town', 'Ward 3 - Byatarayanapura', 'Ward 4 - Kodigehalli'] }
];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'BBMP-2026-8942',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c1c?auto=format&fit=crop&w=800&q=80',
    wasteType: 'Mixed',
    volume: 'Large/Bulk',
    urgency: 'High',
    description: 'Large pile of mixed household garbage and plastic waste dumped near street corner.',
    zone: 'Mahadevapura Zone',
    wardNumber: 'Ward 150',
    wardName: 'Bellandur (Outer Ring Road junction)',
    latitude: 12.9279,
    longitude: 77.6771,
    landmark: 'Near Ecospace Tech Park back gate',
    status: 'In Progress',
    createdAt: '2026-11-13T10:30:00Z',
    assignedVehicle: 'Compactor KA-01-GA-4412',
    supervisorNotes: 'Crew dispatched for urgent morning clearance.',
    reporterName: 'Suresh Kumar',
    reporterPhone: '9845098450'
  },
  {
    id: 'BBMP-2026-8941',
    image: 'https://images.unsplash.com/photo-1605600659873-d808a14e4d83?auto=format&fit=crop&w=800&q=80',
    wasteType: 'Construction & Demolition',
    volume: 'Large/Bulk',
    urgency: 'Normal',
    description: 'Discarded tiles, broken bricks, and cement bags dumped on roadside.',
    zone: 'Bommanahalli Zone',
    wardNumber: 'Ward 191',
    wardName: 'HSR Layout (27th Main)',
    latitude: 12.9121,
    longitude: 77.6445,
    landmark: 'Opposite BDA Complex',
    status: 'Assigned',
    createdAt: '2026-11-13T09:15:00Z',
    assignedVehicle: 'Tractor Tipper KA-03-MB-9021',
    supervisorNotes: 'Scheduled for evening pickup shift.',
    reporterName: 'Priya Sharma',
    reporterPhone: '9900199001'
  },
  {
    id: 'BBMP-2026-8938',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    wasteType: 'Organic/Wet',
    volume: 'Medium',
    urgency: 'High',
    description: 'Overflowing wet waste bin with discarded food packages attracting strays.',
    zone: 'East Zone',
    wardNumber: 'Ward 111',
    wardName: 'Indiranagar (100ft Road)',
    latitude: 12.9716,
    longitude: 77.6412,
    landmark: 'Near CMH Road Metro Station',
    status: 'Collected',
    createdAt: '2026-11-12T16:20:00Z',
    assignedVehicle: 'Auto Tipper KA-05-P-1188',
    supervisorNotes: 'Collected and sent to compost plant.',
    reporterName: 'Ananya Rao',
    reporterPhone: '9741197411'
  },
  {
    id: 'BBMP-2026-8930',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    wasteType: 'Dry/Recyclable',
    volume: 'Small',
    urgency: 'Normal',
    description: 'Cardboard boxes and plastic wrappers left near bus stop.',
    zone: 'South Zone',
    wardNumber: 'Ward 152',
    wardName: 'Jayanagar (4th Block)',
    latitude: 12.9250,
    longitude: 77.5938,
    landmark: 'Near South End Circle',
    status: 'Resolved',
    createdAt: '2026-11-12T08:40:00Z',
    assignedVehicle: 'EV Tipper KA-02-EV-0992',
    supervisorNotes: 'Recyclables sorted and transferred to dry waste collection centre (DWCC).',
    reporterName: 'Kiran Nayak',
    reporterPhone: '9448894488'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'citizen' | 'supervisor' | 'wards'>('citizen');
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('clean_bbmp_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TICKETS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save tickets
  useEffect(() => {
    localStorage.setItem('clean_bbmp_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('citizen')}>
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">CleanBBMP</span>
              <span className="text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Bengaluru</span>
            </div>
            <p className="text-xs text-slate-500">Bruhat Bengaluru Mahanagara Palike</p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button 
            onClick={() => setActiveTab('citizen')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'citizen' ? 'border-emerald-600 text-emerald-700 font-semibold' : 'border-transparent hover:text-slate-900'}`}
          >
            Citizen Portal
          </button>
          <button 
            onClick={() => setActiveTab('supervisor')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'supervisor' ? 'border-emerald-600 text-emerald-700 font-semibold' : 'border-transparent hover:text-slate-900'}`}
          >
            BBMP Supervisor View
          </button>
          <button 
            onClick={() => setActiveTab('wards')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'wards' ? 'border-emerald-600 text-emerald-700 font-semibold' : 'border-transparent hover:text-slate-900'}`}
          >
            Ward Analytics & Map
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('citizen')}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>+ Report Waste</span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Sub-bar */}
      <div className="md:hidden flex items-center justify-around bg-white border-b border-slate-200 px-2 py-2 text-xs font-medium text-slate-600">
        <button 
          onClick={() => setActiveTab('citizen')} 
          className={`py-1 px-3 rounded-lg ${activeTab === 'citizen' ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}`}
        >
          Citizen Portal
        </button>
        <button 
          onClick={() => setActiveTab('supervisor')} 
          className={`py-1 px-3 rounded-lg ${activeTab === 'supervisor' ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}`}
        >
          Supervisor View
        </button>
        <button 
          onClick={() => setActiveTab('wards')} 
          className={`py-1 px-3 rounded-lg ${activeTab === 'wards' ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}`}
        >
          Wards
        </button>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'citizen' && (
          <CitizenPortal tickets={tickets} setTickets={setTickets} showToast={showToast} />
        )}
        {activeTab === 'supervisor' && (
          <SupervisorDashboard tickets={tickets} setTickets={setTickets} showToast={showToast} />
        )}
        {activeTab === 'wards' && (
          <WardAnalyticsView tickets={tickets} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Bruhat Bengaluru Mahanagara Palike (BBMP). Powered by Google Gemini AI & CleanBBMP.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-800 cursor-pointer">SWM Rules 2016</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-800 cursor-pointer">Citizen Charter</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-800 cursor-pointer">Helpline: 1533</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------
// CITIZEN PORTAL COMPONENT
// ----------------------------------------------------
function CitizenPortal({ tickets, setTickets, showToast }: { tickets: Ticket[], setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>, showToast: (msg: string) => void }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    waste_type: WasteType;
    estimated_volume: EstimatedVolume;
    urgency_level: UrgencyLevel;
    description: string;
  } | null>(null);

  const [selectedZone, setSelectedZone] = useState('Mahadevapura Zone');
  const [selectedWard, setSelectedWard] = useState('Ward 150 - Bellandur');
  const [landmark, setLandmark] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [latitude, setLatitude] = useState(12.9279);
  const [longitude, setLongitude] = useState(77.6771);
  const [locating, setLocating] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'report' | 'track'>('report');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Geolocation trigger
  const handleGetLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setLocating(false);
          showToast('GPS Location acquired successfully.');
        },
        (err) => {
          setLocating(false);
          showToast('Unable to retrieve location. Using default Bengaluru coordinates.');
        },
        { timeout: 10000 }
      );
    } else {
      setLocating(false);
      showToast('Geolocation is not supported by your browser.');
    }
  };

  // Handle file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = reader.result as string;
        setSelectedImage(base64Str);
        analyzeWithGemini(base64Str);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraActive(false);
      showToast('Camera access denied or unavailable. Please upload from gallery.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        stopCamera();
        analyzeWithGemini(dataUrl);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
    }
    setCameraActive(false);
  };

  // Gemini AI Vision Analysis API Call
  const analyzeWithGemini = async (base64Image: string) => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      if (!res.ok) throw new Error('Failed to analyze image');
      const data = await res.json();
      setAnalysisResult(data);
      showToast('AI Vision analysis complete! Form auto-populated.');
    } catch (err) {
      // Fallback mock if server call fails
      setAnalysisResult({
        waste_type: 'Mixed',
        estimated_volume: 'Medium',
        urgency_level: 'Normal',
        description: 'Observed scattered civic waste and discarded packaging requiring clearance.'
      });
      showToast('AI analysis completed with estimated fallback values.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Handle ticket submission
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      showToast('Please capture or upload an image of the waste.');
      return;
    }
    const newTicket: Ticket = {
      id: `BBMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      image: selectedImage,
      wasteType: analysisResult?.waste_type || 'Mixed',
      volume: analysisResult?.estimated_volume || 'Medium',
      urgency: analysisResult?.urgency_level || 'Normal',
      description: analysisResult?.description || landmark || 'Unattended garbage pile reported by citizen.',
      zone: selectedZone,
      wardNumber: selectedWard.split(' - ')[0],
      wardName: selectedWard,
      latitude,
      longitude,
      landmark: landmark || 'Bengaluru Roadside',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      reporterName: reporterName || 'Anonymous Citizen',
      reporterPhone: reporterPhone || 'Not Provided'
    };

    setTickets([newTicket, ...tickets]);
    showToast(`Complaint ${newTicket.id} submitted successfully to BBMP!`);
    setSelectedImage(null);
    setAnalysisResult(null);
    setLandmark('');
    setActiveSubTab('track');
  };

  const currentZoneObj = BBMP_ZONES_AND_WARDS.find(z => z.zone === selectedZone) || BBMP_ZONES_AND_WARDS[0];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 md:p-12 shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-emerald-200 mb-4 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI-Powered Garbage Detection & Ward Dispatch</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Keep Bengaluru Clean & Green
          </h1>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed mb-6">
            Snap a photo of unattended garbage in your neighborhood. Gemini AI instantly classifies the waste type, estimates volume, and routes your grievance to the BBMP Field Supervisor for immediate cleanup.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setActiveSubTab('report')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeSubTab === 'report' ? 'bg-white text-emerald-900 shadow-lg' : 'bg-emerald-800/80 text-white hover:bg-emerald-700'}`}
            >
              Report New Waste
            </button>
            <button 
              onClick={() => setActiveSubTab('track')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeSubTab === 'track' ? 'bg-white text-emerald-900 shadow-lg' : 'bg-emerald-800/80 text-white hover:bg-emerald-700'}`}
            >
              Track My Grievances ({tickets.length})
            </button>
          </div>
        </div>
      </div>

      {/* SubTab Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button 
          onClick={() => setActiveSubTab('report')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeSubTab === 'report' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          Report Waste
        </button>
        <button 
          onClick={() => setActiveSubTab('track')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeSubTab === 'track' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          Track Requests ({tickets.length})
        </button>
      </div>

      {activeSubTab === 'report' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Top: Photo capture & AI analysis */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              <span>1. Capture Waste Photo</span>
            </h2>

            {!selectedImage && !cameraActive && (
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50 group flex flex-col items-center justify-center min-h-[220px]"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">Upload from gallery</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                <button 
                  type="button"
                  onClick={startCamera}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>Use Device Camera</span>
                </button>
              </div>
            )}

            {cameraActive && (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={capturePhoto} 
                    className="flex-1 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm hover:bg-emerald-700 transition-colors"
                  >
                    Snap Photo
                  </button>
                  <button 
                    type="button" 
                    onClick={stopCamera} 
                    className="py-2.5 px-4 bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {selectedImage && (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                  <img src={selectedImage} alt="Captured waste" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => { setSelectedImage(null); setAnalysisResult(null); }} 
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {analyzing && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-950">AI is analyzing garbage type and volume...</p>
                      <p className="text-[11px] text-emerald-700">Gemini 2.5 Flash Vision OCR & Classification</p>
                    </div>
                  </div>
                )}

                {analysisResult && !analyzing && (
                  <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> AI Vision Analysis
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                        {analysisResult.urgency_level} Urgency
                      </span>
                    </div>
                    <p className="text-slate-300">{analysisResult.description}</p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span>Type: <strong className="text-white">{analysisResult.waste_type}</strong></span>
                      <span>Volume: <strong className="text-white">{analysisResult.estimated_volume}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right / Bottom: Form Details & Submission */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <form onSubmit={handleSubmitTicket} className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>2. Location & Ward Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">BBMP Zone</label>
                  <select 
                    value={selectedZone} 
                    onChange={(e) => {
                      setSelectedZone(e.target.value);
                      const z = BBMP_ZONES_AND_WARDS.find(item => item.zone === e.target.value);
                      if (z && z.wards.length > 0) setSelectedWard(z.wards[0]);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {BBMP_ZONES_AND_WARDS.map(z => (
                      <option key={z.zone} value={z.zone}>{z.zone}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">BBMP Ward</label>
                  <select 
                    value={selectedWard} 
                    onChange={(e) => setSelectedWard(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {currentZoneObj.wards.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Landmark / Street Details</label>
                  <button 
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{locating ? 'Detecting GPS...' : 'Detect GPS Coordinates'}</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near 3rd Cross, Beside Public Park, 100ft Road"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">Coordinates tagged: Lat {latitude.toFixed(4)}, Long {longitude.toFixed(4)}</p>
              </div>

              {/* AI Auto-filled or editable summary overrides */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Waste Type</label>
                  <select 
                    value={analysisResult?.waste_type || 'Mixed'}
                    onChange={(e) => setAnalysisResult(prev => prev ? {...prev, waste_type: e.target.value as WasteType} : { waste_type: e.target.value as WasteType, estimated_volume: 'Medium', urgency_level: 'Normal', description: '' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                  >
                    <option value="Organic/Wet">Organic/Wet</option>
                    <option value="Dry/Recyclable">Dry/Recyclable</option>
                    <option value="Hazardous">Hazardous</option>
                    <option value="Construction & Demolition">Construction & Demolition</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Estimated Volume</label>
                  <select 
                    value={analysisResult?.estimated_volume || 'Medium'}
                    onChange={(e) => setAnalysisResult(prev => prev ? {...prev, estimated_volume: e.target.value as EstimatedVolume} : { waste_type: 'Mixed', estimated_volume: e.target.value as EstimatedVolume, urgency_level: 'Normal', description: '' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                  >
                    <option value="Small">Small (Bin size)</option>
                    <option value="Medium">Medium (Heaped pile)</option>
                    <option value="Large/Bulk">Large/Bulk (Dumpster/Truck)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Urgency</label>
                  <select 
                    value={analysisResult?.urgency_level || 'Normal'}
                    onChange={(e) => setAnalysisResult(prev => prev ? {...prev, urgency_level: e.target.value as UrgencyLevel} : { waste_type: 'Mixed', estimated_volume: 'Medium', urgency_level: e.target.value as UrgencyLevel, description: '' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High (Health Hazard)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Your Name (Optional)</label>
                  <input 
                    type="text" 
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number (Optional)</label>
                  <input 
                    type="text" 
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="e.g. 9845098450"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={!selectedImage}
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance to BBMP</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Track Requests List */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Submitted Complaints & Tracking</h2>
            <span className="text-xs font-medium text-slate-500">{tickets.length} total tickets registered</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img src={ticket.image} alt="Waste spot" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                      {ticket.id}
                    </div>
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{ticket.zone}</span>
                      <span>{ticket.wardName}</span>
                    </div>

                    <p className="text-sm font-medium text-slate-900 line-clamp-2">{ticket.description}</p>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{ticket.landmark}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">Type: {ticket.wasteType}</span>
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">Volume: {ticket.volume}</span>
                      {ticket.urgency === 'High' && (
                        <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> High Urgency
                        </span>
                      )}
                    </div>

                    {ticket.assignedVehicle && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Assigned Vehicle: <strong>{ticket.assignedVehicle}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Reported: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  <span className="font-medium text-slate-700">Reporter: {ticket.reporterName || 'Citizen'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// SUPERVISOR DASHBOARD COMPONENT
// ----------------------------------------------------
function SupervisorDashboard({ tickets, setTickets, showToast }: { tickets: Ticket[], setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>, showToast: (msg: string) => void }) {
  const [filterZone, setFilterZone] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [assignVehicleInput, setAssignVehicleInput] = useState('');
  const [supervisorNotesInput, setSupervisorNotesInput] = useState('');
  const [newStatusInput, setNewStatusInput] = useState<TicketStatus>('In Progress');

  const filteredTickets = tickets.filter(t => {
    if (filterZone !== 'All' && t.zone !== filterZone) return false;
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    return true;
  });

  const handleUpdateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: newStatusInput,
          assignedVehicle: assignVehicleInput || t.assignedVehicle,
          supervisorNotes: supervisorNotesInput || t.supervisorNotes
        };
      }
      return t;
    });

    setTickets(updated);
    showToast(`Ticket ${selectedTicket.id} updated successfully to ${newStatusInput}.`);
    setSelectedTicket(null);
  };

  const pendingCount = tickets.filter(t => t.status === 'Pending').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress' || t.status === 'Assigned').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Collected').length;

  return (
    <div className="space-y-8">
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">BBMP Field Supervisor Portal</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded">Authorized Staff</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage ward sanitation crews, assign garbage collection vehicles, and resolve citizen grievances.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Pending</p>
            <p className="text-lg font-bold text-amber-600 font-mono">{pendingCount}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Active / In Progress</p>
            <p className="text-lg font-bold text-blue-600 font-mono">{inProgressCount}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Resolved</p>
            <p className="text-lg font-bold text-emerald-600 font-mono">{resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Filter Zone:</span>
            <select 
              value={filterZone} 
              onChange={(e) => setFilterZone(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800"
            >
              <option value="All">All BBMP Zones</option>
              {BBMP_ZONES_AND_WARDS.map(z => (
                <option key={z.zone} value={z.zone}>{z.zone}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Status:</span>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Collected">Collected</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">{filteredTickets.length} tickets matching filters</span>
      </div>

      {/* Tickets Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Grievance ID</th>
                <th className="p-4">Ward & Zone</th>
                <th className="p-4">Waste Type / Volume</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Vehicle</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <img src={ticket.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                      <div>
                        <span>{ticket.id}</span>
                        <p className="text-[11px] font-normal text-slate-500">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{ticket.wardName}</p>
                    <p className="text-xs text-slate-500">{ticket.zone}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium text-xs mb-1">{ticket.wasteType}</span>
                    <p className="text-xs text-slate-500">Volume: {ticket.volume}</p>
                  </td>
                  <td className="p-4">
                    {ticket.urgency === 'High' ? (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-xs font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" /> High
                      </span>
                    ) : (
                      <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">Normal</span>
                    )}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-600">
                    {ticket.assignedVehicle || <span className="text-amber-600 italic">Unassigned</span>}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setNewStatusInput(ticket.status);
                        setAssignVehicleInput(ticket.assignedVehicle || '');
                        setSupervisorNotesInput(ticket.supervisorNotes || '');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No tickets found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Manage Ticket {selectedTicket.id}</h3>
                <p className="text-xs text-slate-500">{selectedTicket.wardName} - {selectedTicket.zone}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTicket} className="space-y-4">
              <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <img src={selectedTicket.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-slate-900">{selectedTicket.description}</p>
                  <p className="text-slate-500">Landmark: {selectedTicket.landmark}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Update Status</label>
                <select 
                  value={newStatusInput}
                  onChange={(e) => setNewStatusInput(e.target.value as TicketStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800"
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Collected">Collected</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Assign Collection Vehicle / Crew</label>
                <input 
                  type="text" 
                  value={assignVehicleInput}
                  onChange={(e) => setAssignVehicleInput(e.target.value)}
                  placeholder="e.g. Compactor Truck KA-01-AB-1234 (Auto Tipper)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Supervisor Log Notes</label>
                <textarea 
                  rows={3}
                  value={supervisorNotesInput}
                  onChange={(e) => setSupervisorNotesInput(e.target.value)}
                  placeholder="Add operational notes or instructions for sanitation crew..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedTicket(null)} 
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// WARD ANALYTICS & MAP COMPONENT
// ----------------------------------------------------
function WardAnalyticsView({ tickets }: { tickets: Ticket[] }) {
  const totalTonsCollectedToday = 482.5;
  const activeVehiclesCount = 1420;
  const wardComplianceScore = 94.2;

  const zoneStats = BBMP_ZONES_AND_WARDS.map(z => {
    const zTickets = tickets.filter(t => t.zone === z.zone);
    const resolved = zTickets.filter(t => t.status === 'Resolved' || t.status === 'Collected').length;
    return {
      zone: z.zone,
      totalWards: z.wards.length,
      ticketsCount: zTickets.length,
      resolvedCount: resolved,
      efficiency: zTickets.length > 0 ? Math.round((resolved / zTickets.length) * 100) : 95
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">BBMP Ward Sanitation & Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time SWM tracking across Bengaluru's 8 major municipal zones.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Daily Waste Cleared</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{totalTonsCollectedToday} Tons</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">↑ +4.2% vs yesterday</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Active Collection Fleet</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{activeVehiclesCount} Tippers</h3>
            <p className="text-xs text-blue-600 font-medium mt-1">GPS live tracking active</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Map className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">City Cleanliness Index</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{wardComplianceScore}%</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">Swachh Survekshan benchmark</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Zone Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-bold text-slate-900">BBMP Zone Performance Breakdown</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zoneStats.map(zs => (
            <div key={zs.zone} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{zs.zone}</h3>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                  {zs.efficiency}% Cleared
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Registered Wards:</span>
                  <span className="font-mono font-semibold text-slate-800">{zs.totalWards} Wards</span>
                </div>
                <div className="flex justify-between">
                  <span>Grievances Logged:</span>
                  <span className="font-mono font-semibold text-slate-800">{zs.ticketsCount} tickets</span>
                </div>
                <div className="flex justify-between">
                  <span>Resolved / Collected:</span>
                  <span className="font-mono font-semibold text-emerald-600">{zs.resolvedCount} completed</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${zs.efficiency}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper status badge component
function StatusBadge({ status }: { status: TicketStatus }) {
  const styles: Record<TicketStatus, string> = {
    'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Collected': 'bg-teal-50 text-teal-700 border-teal-200',
    'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span>{status}</span>
    </span>
  );
}
