import React, { useState, useCallback, useMemo } from 'react';
import { findNearbyHospitals } from './services/geminiService';
import { AppStatus, Coordinates, GeminiResponse, GroundingChunk, HospitalMarker } from './types';
import { EmergencyButton } from './components/EmergencyButton';
import { SimpleMarkdown } from './components/SimpleMarkdown';
import { MapComponent } from './components/MapComponent';
import { MapPinIcon, AlertCircleIcon, SearchIcon } from './components/Icons';

export default function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<GeminiResponse | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLocateAndSearch = useCallback(() => {
    setStatus(AppStatus.LOCATING);
    setErrorMsg(null);
    setData(null);
    setUserLocation(null);

    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setStatus(AppStatus.ERROR);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setStatus(AppStatus.THINKING);
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(coords);

        try {
          const result = await findNearbyHospitals(coords);
          setData(result);
          setStatus(AppStatus.SUCCESS);
        } catch (err: any) {
          setErrorMsg(err.message || "Something went wrong.");
          setStatus(AppStatus.ERROR);
        }
      },
      (error) => {
        // Enhanced error logging to prevent [object Object] output
        console.error(`Geolocation Error: Code ${error.code} - ${error.message}`);
        
        let message = "Unable to retrieve your location.";
        
        // Handle specific error codes
        // 1: PERMISSION_DENIED
        // 2: POSITION_UNAVAILABLE
        // 3: TIMEOUT
        switch (error.code) {
          case 1:
            message = "Location permission denied. Please enable location access in your browser settings.";
            break;
          case 2:
            message = "Location information is unavailable. Please check your network or GPS signal.";
            break;
          case 3:
            message = "Location request timed out. Please try again.";
            break;
          default:
            message = `Unable to get location: ${error.message}`;
        }
        
        setErrorMsg(message);
        setStatus(AppStatus.ERROR);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout to 15s for better GPS lock chance
        maximumAge: 0
      }
    );
  }, []);

  // Filter chunks to render relevant map sources
  const renderGroundingSource = (chunk: GroundingChunk, index: number) => {
    if (chunk.maps) {
      return (
        <a
          key={index}
          href={chunk.maps.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-white hover:border-red-300 hover:text-red-600 transition-colors shadow-sm"
        >
          <MapPinIcon className="w-4 h-4 text-red-500" />
          <span className="truncate max-w-[200px]">{chunk.maps.title}</span>
        </a>
      );
    }
    if (chunk.web) {
        return (
          <a
            key={index}
            href={chunk.web.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-white hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
          >
            <SearchIcon className="w-4 h-4 text-blue-500" />
            <span className="truncate max-w-[200px]">{chunk.web.title}</span>
          </a>
        );
      }
    return null;
  };

  // Process data to extract markers and clean text
  const { cleanText, hospitalMarkers } = useMemo(() => {
    if (!data?.text) return { cleanText: '', hospitalMarkers: [] };

    const lines = data.text.split('\n');
    const markers: HospitalMarker[] = [];
    
    // Filter out coordinate lines but parse them
    const visibleLines = lines.filter(line => {
      if (line.includes('__COORD_DATA__:')) {
        try {
          const jsonPart = line.split('__COORD_DATA__:')[1].trim();
          const markerData = JSON.parse(jsonPart);
          if (markerData.lat && markerData.lng) {
            markers.push(markerData);
          }
        } catch (e) {
          console.warn("Failed to parse marker data", e);
        }
        return false; // Don't show this line
      }
      return true;
    });

    return {
      cleanText: visibleLines.join('\n'),
      hospitalMarkers: markers
    };
  }, [data]);

  const containerMaxWidth = status === AppStatus.SUCCESS ? 'max-w-7xl' : 'max-w-3xl';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className={`mx-auto px-4 h-16 flex items-center justify-between transition-all duration-500 ${containerMaxWidth}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
              +
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              MediLocate AI
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            Emergency Assistant
          </div>
        </div>
      </header>

      <main className={`mx-auto px-4 py-8 pb-24 transition-all duration-500 ${containerMaxWidth}`}>
        
        {/* Hero / Action Section */}
        <div className={`flex flex-col items-center justify-center gap-8 transition-all duration-500 ${status === AppStatus.SUCCESS ? 'min-h-[auto] mb-12' : 'min-h-[40vh]'}`}>
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Emergency Medical Search
            </h2>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              Find the nearest hospitals, trauma centers, and facilities instantly using AI and real-time Maps data.
            </p>
          </div>

          <EmergencyButton status={status} onClick={handleLocateAndSearch} />
          
          {status === AppStatus.ERROR && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl max-w-md animate-in fade-in slide-in-from-bottom-2">
              <AlertCircleIcon className="w-6 h-6 flex-shrink-0" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {status === AppStatus.SUCCESS && data && userLocation && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left Column: Map */}
                <div className="w-full lg:w-1/2 lg:sticky lg:top-24 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">Live Map</h3>
                        <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                            {hospitalMarkers.length} locations found
                        </span>
                    </div>
                    
                    <MapComponent userLocation={userLocation} hospitals={hospitalMarkers} />

                    {/* Grounding Sources (Map Chips) */}
                    {(data.groundingChunks && data.groundingChunks.length > 0) && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Data Sources
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {data.groundingChunks.map((chunk, idx) => renderGroundingSource(chunk, idx))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Right Column: Details List */}
                <div className="w-full lg:w-1/2 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 lg:border-none lg:pb-0">
                        <h3 className="text-xl font-bold text-slate-900">Facility Details</h3>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                            Verified by AI
                        </span>
                    </div>

                    {/* AI Text Content */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 prose prose-slate max-w-none">
                      <SimpleMarkdown content={cleanText} />
                    </div>
                </div>

            </div>
          </div>
        )}
      </main>
      
      {/* Footer disclaimer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4 px-4 text-center z-10">
        <p className="text-xs text-slate-400">
          <strong>Disclaimer:</strong> Information provided by AI. Always call 911 (or local emergency services) for life-threatening emergencies.
        </p>
      </footer>
    </div>
  );
}