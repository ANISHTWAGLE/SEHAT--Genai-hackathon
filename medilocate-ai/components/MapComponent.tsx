import React, { useEffect, useRef } from 'react';
import { Coordinates, HospitalMarker } from '../types';

interface MapComponentProps {
  userLocation: Coordinates;
  hospitals: HospitalMarker[];
}

declare global {
  interface Window {
    L: any;
  }
}

export const MapComponent: React.FC<MapComponentProps> = ({ userLocation, hospitals }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize Map if not already initialized
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView(
        [userLocation.latitude, userLocation.longitude], 
        13
      );

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      layerGroupRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    layerGroupRef.current.clearLayers();

    // Custom Icons
    const userIcon = window.L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const hospitalIcon = window.L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add User Marker
    window.L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
      .bindPopup("<b>You are here</b>")
      .addTo(layerGroupRef.current);

    // Add Hospital Markers
    const bounds = window.L.latLngBounds([
      [userLocation.latitude, userLocation.longitude]
    ]);

    hospitals.forEach(hospital => {
      if (hospital.lat && hospital.lng) {
        
        // Construct Popup Content with Buttons
        let popupContent = `
          <div class="min-w-[160px] font-sans">
            <div class="font-bold text-slate-900 text-sm mb-2">${hospital.name}</div>
        `;
        
        // Button container
        popupContent += `<div class="flex flex-col gap-2">`;

        // Call Button
        if (hospital.phone) {
          popupContent += `
            <a href="tel:${hospital.phone}" class="flex items-center justify-center w-full gap-2 bg-green-600 text-white text-xs font-bold py-2 px-3 rounded hover:bg-green-700 transition-colors text-decoration-none border-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width:14px;height:14px;">
                <path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clip-rule="evenodd" />
              </svg>
              Call Now
            </a>
          `;
        }

        // Directions Button
        popupContent += `
            <a href="https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}" target="_blank" class="flex items-center justify-center w-full gap-2 bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded hover:bg-blue-700 transition-colors text-decoration-none border-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width:14px;height:14px;">
                <path fill-rule="evenodd" d="M10 2a6 6 0 0 0-6 6c0 3.314 6 10 6 10s6-6.686 6-10a6 6 0 0 0-6-6Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" clip-rule="evenodd" />
              </svg>
              Get Directions
            </a>
        `;

        popupContent += `</div></div>`;

        window.L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon })
          .bindPopup(popupContent)
          .addTo(layerGroupRef.current);
        
        bounds.extend([hospital.lat, hospital.lng]);
      }
    });

    // Fit bounds to show all markers
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });

  }, [userLocation, hospitals]);

  return (
    <div className="w-full h-64 sm:h-80 lg:h-[600px] rounded-2xl overflow-hidden shadow-md border border-slate-200 z-0 transition-all duration-300">
      <div ref={mapRef} className="w-full h-full bg-slate-100" />
    </div>
  );
};