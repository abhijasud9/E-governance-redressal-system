import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ onLocationSelected }) => {
    useMapEvents({
        click(e) {
            onLocationSelected(e.latlng);
        },
    });
    return null;
};

const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const Map = ({ center = [20.5937, 78.9629], complaints = [], onLocationSelected, zoom = 13, readOnly = false }) => {
    const [mapCenter, setMapCenter] = useState(center);

    useEffect(() => {
        if (!readOnly && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setMapCenter([position.coords.latitude, position.coords.longitude]);
                if (onLocationSelected) {
                    onLocationSelected({ lat: position.coords.latitude, lng: position.coords.longitude });
                }
            });
        }
    }, [readOnly, onLocationSelected]);

    return (
        <MapContainer center={mapCenter} zoom={zoom} className="h-full w-full rounded-2xl overflow-hidden shadow-inner">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={mapCenter} />

            {!readOnly && onLocationSelected && (
                <LocationPicker onLocationSelected={(latlng) => {
                    setMapCenter([latlng.lat, latlng.lng]);
                    onLocationSelected(latlng);
                }} />
            )}

            {!readOnly && (
                <Marker position={mapCenter} />
            )}

            {readOnly && complaints.map((complaint) => (
                <Marker key={complaint.id} position={[complaint.latitude, complaint.longitude]}>
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold border-b pb-1 mb-1">{complaint.title}</h3>
                            <p className="text-xs text-slate-600 line-clamp-2">{complaint.description}</p>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase py-0.5 px-1.5 rounded bg-amber-100 text-amber-700">
                                    {complaint.status}
                                </span>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
