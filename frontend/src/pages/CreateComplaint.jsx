import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { resolveImageUrl } from '../api/api';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
    ArrowLeft,
    Upload,
    MapPin,
    Check,
    Loader2,
    AlertCircle,
    Image as ImageIcon,
    Target,
    Info,
    CheckCircle2,
    Camera,
    X
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const LocationMarker = ({ latitude, longitude }) => {
    return latitude && longitude ? <Marker position={[latitude, longitude]} /> : null;
};

const RecenterMap = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lon && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon))) {
            try {
                map.setView([lat, lon], 15);
            } catch (err) {
                console.error('Map setView error:', err);
            }
        }
    }, [lat, lon, map]);
    return null;
};

const CameraModal = ({ onCapture, onClose, onToast }) => {
    const [stream, setStream] = useState(null);
    const videoRef = (node) => {
        if (node && stream) {
            node.srcObject = stream;
        }
    };

    useEffect(() => {
        let mediaStream = null;
        const startCamera = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setStream(mediaStream);
            } catch (_err) {
                onToast?.error('Camera access denied');
                onClose();
            }
        };
        startCamera();
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onClose, onToast]);

    const capture = () => {
        const video = document.querySelector('video');
        if (!video) return;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
            if (blob) onCapture(blob);
        }, 'image/jpeg');
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-black rounded-2xl overflow-hidden aspect-[3/4]">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 z-10"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                    <button
                        type="button"
                        onClick={capture}
                        className="w-16 h-16 rounded-full border-4 border-white bg-white/20 hover:bg-white/40 transition-colors flex items-center justify-center"
                    >
                        <div className="w-12 h-12 bg-white rounded-full"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

const CreateComplaint = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        latitude: '',
        longitude: '',
        address: '',
        imageUrl: ''
    });
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const reverseGeocode = useCallback(async (lat, lon) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            setFormData(prev => ({ ...prev, address: data.display_name }));
        } catch (_err) {
            console.error(_err);
        }
    }, []);

    const getCurrentLocation = useCallback((options = { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }) => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setError(''); // Clear previous error
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setFormData(prev => ({ ...prev, latitude, longitude }));
                reverseGeocode(latitude, longitude);
                setError('');
            },
            (err) => {
                console.error('Geolocation error:', err);

                // Fallback logic for Code 2 (Unavailable) if we were trying high accuracy
                if (err.code === 2 && options.enableHighAccuracy) {
                    console.log('High accuracy failed, retrying with low accuracy...');
                    getCurrentLocation({ enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 });
                    return;
                }

                let errMsg = 'Failed to get your location.';
                if (err.code === 1) errMsg = 'Location access denied. Please enable it in browser settings.';
                else if (err.code === 2) errMsg = 'Location unavailable. Please ensure GPS/Location is enabled and try moving to an open area.';
                else if (err.code === 3) errMsg = 'Location request timed out. Please try again.';

                setError(errMsg);
                toast?.error(errMsg);
            },
            options
        );
    }, [reverseGeocode, toast]);

    useEffect(() => {
        if (step === 2 && !formData.latitude) {
            getCurrentLocation();
        }
    }, [step, formData.latitude, getCurrentLocation]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/resources/categories');
                setCategories(res.data);
            } catch (_err) {
                console.error(_err);
                setError('Failed to load categories. Please try again.');
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.latitude || !formData.longitude) {
            setError('Please pinpoint the location on the map using the target button.');
            setStep(2);
            return;
        }
        if (!formData.categoryId) {
            setError('Please select a category.');
            setStep(1);
            return;
        }
        if (!formData.description) {
            setError('Please provide a description.');
            setStep(1);
            return;
        }
        if (!formData.imageUrl) {
            setError('Please capture a photo of the issue.');
            setStep(1);
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const payload = {
                ...formData,
                categoryId: Number(formData.categoryId),
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude)
            };
            await api.post('/complaints', payload);
            toast?.success('Complaint submitted successfully!');
            navigate('/my-complaints');
        } catch (err) {
            console.error('Submission error:', err);
            const msg = err.response?.data?.message || err.message || 'Unknown error';
            setError(`Failed to submit: ${msg}. Please check all fields and try again.`);
            toast?.error('Failed to submit complaint');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCameraCapture = async (blob) => {
        if (!blob) return;
        setUploading(true);
        const data = new FormData();
        data.append('file', blob, 'camera-capture.jpg');
        try {
            const res = await api.post('/files/upload', data);
            setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
            toast?.success('Photo captured successfully');
            setShowCamera(false);
        } catch (_err) {
            toast?.error('Failed to upload captured photo');
        } finally {
            setUploading(false);
        }
    };

    const steps = [
        { num: 1, label: 'Details' },
        { num: 2, label: 'Location' },
    ];

    return (
        <div className="page-container pb-20">
            <div>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-medium text-sm mb-4 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Portal
                </button>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <div>
                        <h1 className="page-title">Report Issue</h1>
                        <p className="page-subtitle">Help improve your city's infrastructure</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {steps.map((s, i) => (
                            <div key={s.num} className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(s.num)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${step === s.num
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                        : step > s.num
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-slate-100 text-slate-500'
                                        }`}
                                >
                                    {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : <span>{s.num}</span>}
                                    {s.label}
                                </button>
                                {i < steps.length - 1 && <div className="w-8 h-px bg-slate-200"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-center gap-3 text-sm font-medium animate-scale-in mb-6">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {showCamera && (
                <CameraModal
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                    onToast={toast}
                />
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className={`lg:col-span-7 space-y-6 ${step === 2 ? 'hidden lg:block' : ''}`}>
                    <div className="card p-8 space-y-6">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Basic Information</p>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Issue Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="input-premium"
                                placeholder="e.g., Pothole on Market Street"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Category</label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="input-premium cursor-pointer text-slate-700 bg-white"
                                >
                                    <option value="" disabled>Select Category</option>
                                    {Array.isArray(categories) && categories.length === 0 ? (
                                        <option disabled>Loading categories...</option>
                                    ) : Array.isArray(categories) ? (
                                        categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))
                                    ) : (
                                        <option disabled>Error loading categories</option>
                                    )}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Photo</label>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setShowCamera(true)}
                                        className={`flex flex-col items-center justify-center gap-4 w-full py-10 rounded-2xl border-2 border-dashed transition-all text-sm font-semibold group
                                            ${formData.imageUrl ? 'border-emerald-300 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-primary-300 hover:text-primary-600'}`}
                                    >
                                        <div className={`p-4 rounded-full transition-colors ${formData.imageUrl ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-primary-50'}`}>
                                            <Camera className={`w-8 h-8 ${formData.imageUrl ? 'text-emerald-600' : 'text-slate-500 group-hover:text-primary-600'}`} />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold">Take Live Photo</p>
                                            <p className="text-xs font-normal opacity-70 mt-1">Live camera capture is required</p>
                                        </div>
                                    </button>
                                    {formData.imageUrl && (
                                        <p className="mt-3 text-xs text-emerald-600 font-medium flex items-center justify-center gap-1.5 anim-fade-in">
                                            <Check className="w-4 h-4" /> Photo captured successfully
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Description</label>
                            <textarea
                                required
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input-premium resize-none"
                                placeholder="Describe the severity, exact location details, or any hazards..."
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs px-1">
                        <Info className="w-4 h-4 shrink-0" />
                        <p>Your complaint will be reviewed by city officials within 24-48 hours.</p>
                    </div>
                    <button type="button" onClick={() => setStep(2)} className="btn-primary w-full lg:hidden">
                        Next: Set Location
                    </button>
                </div>

                <div className={`lg:col-span-5 space-y-5 ${step === 1 ? 'hidden lg:block' : ''}`}>
                    <div className="card overflow-hidden">
                        <div className="h-[350px] lg:h-[400px] w-full relative">
                            <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationMarker latitude={formData.latitude} longitude={formData.longitude} />
                                <RecenterMap lat={formData.latitude} lon={formData.longitude} />
                            </MapContainer>
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="absolute bottom-4 right-4 z-[1000] p-3 bg-white text-slate-900 rounded-xl shadow-xl hover:bg-primary-600 hover:text-white transition-all active:scale-90"
                                title="Use Current Location"
                            >
                                <Target className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="flex items-start gap-3">
                                <div className={`p-2.5 rounded-xl shrink-0 ${formData.latitude ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Live Location</p>
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                        {formData.address || 'Use the target button above to set your live location'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="btn-primary w-full py-4 text-base shadow-xl shadow-primary-200"
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <span>Submit Report</span>
                                <CheckCircle2 className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {formData.imageUrl && (
                        <div className="card p-5">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <ImageIcon className="w-3.5 h-3.5" />
                                Attached Photo
                            </p>
                            <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-100">
                                <img src={resolveImageUrl(formData.imageUrl)} className="w-full h-full object-cover" alt="Proof" />
                            </div>
                        </div>
                    )}

                    <button type="button" onClick={() => setStep(1)} className="btn-secondary w-full lg:hidden">
                        <ArrowLeft className="w-4 h-4" /> Back to Details
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateComplaint;
