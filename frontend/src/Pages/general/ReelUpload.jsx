import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Toast from '../../components/Toast';

const ReelUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    video: null,
  });

  const fileInputRef = useRef(null);

  // Clean up ObjectURL preview on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('video/')) {
      setToast({ message: 'Please select a valid video file (MP4, WebM, MOV)', type: 'error' });
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFormData((prev) => ({ ...prev, video: file }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'video' && files && files[0]) {
      handleFileSelect(files[0]);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setToast({ message: 'Please provide a meal title', type: 'error' });
      return;
    }

    if (!formData.video) {
      setToast({ message: 'Please select a video to upload', type: 'error' });
      return;
    }

    const uploadId = Date.now();
    const tempReel = {
      id: uploadId,
      name: formData.name,
      previewUrl: previewUrl,
      status: 'uploading',
      progress: 0,
    };

    // Optimistic UI update
    setRecentUploads((prev) => [tempReel, ...prev]);
    setLoading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('video', formData.video);

      await axios.post(`${API_BASE_URL}/api/food`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
            setRecentUploads((prev) =>
              prev.map((item) =>
                item.id === uploadId ? { ...item, progress: percentCompleted } : item
              )
            );
          }
        },
      });

      // Success Optimistic UI Swap
      setRecentUploads((prev) =>
        prev.map((item) =>
          item.id === uploadId ? { ...item, status: 'published', progress: 100 } : item
        )
      );

      setToast({ message: 'Food reel uploaded successfully!', type: 'success' });

      // Reset form
      setFormData({ name: '', video: null });
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => {
        navigate('/food-partner/home');
      }, 1200);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Upload failed. Please try again.';
      setToast({ message: errorMsg, type: 'error' });

      // Failure Optimistic UI Swap
      setRecentUploads((prev) =>
        prev.map((item) =>
          item.id === uploadId ? { ...item, status: 'failed' } : item
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Create Food Reel 🍳
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Share your culinary masterpiece with thousands of food lovers.
            </p>
          </div>

          <button
            onClick={() => navigate('/food-partner/home')}
            className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold text-xs active-tactile transition-all"
            aria-label="Back to Profile"
          >
            Cancel
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Side */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meal Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Food / Dish Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Special Woodfired Pizza"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:bg-white"
              />
            </div>

            {/* Drag & Drop Upload Zone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Video Reel <span className="text-red-500">*</span>
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-200 ${
                  dragActive
                    ? 'border-red-500 bg-red-50/60 scale-[1.01]'
                    : formData.video
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100/80 hover:border-gray-400'
                }`}
              >
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                />

                <div className="p-3 rounded-full bg-white shadow-md text-red-500 mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>

                <p className="text-sm font-semibold text-gray-800 text-center">
                  {formData.video ? (
                    <span className="text-emerald-700">{formData.video.name}</span>
                  ) : (
                    <span>Drag & drop your video here, or <span className="text-red-600 underline">browse</span></span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">MP4, WebM or MOV up to 100MB</p>
              </div>
            </div>

            {/* Upload Progress Bar */}
            {loading && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span>Uploading video...</span>
                  <span className="text-red-600 font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.video}
              className={`w-full py-3.5 px-4 rounded-2xl font-semibold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                !loading && formData.name && formData.video
                  ? 'bg-red-600 hover:bg-red-700 text-white active-tactile hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Publishing ({uploadProgress}%)...</span>
                </>
              ) : (
                <span>Publish Food Reel</span>
              )}
            </button>
          </form>

          {/* Video Preview & Optimistic Upload List */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-gray-700">Live Video Preview</h3>

            {previewUrl ? (
              <div className="relative aspect-[9/16] max-h-[360px] w-full mx-auto bg-black rounded-3xl overflow-hidden shadow-lg border border-gray-200 flex items-center justify-center">
                <video
                  src={previewUrl}
                  controls
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
                  Preview
                </div>
              </div>
            ) : (
              <div className="aspect-[9/16] max-h-[360px] w-full mx-auto bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Select a video to see live thumbnail preview</p>
              </div>
            )}

            {/* Optimistic Recent Uploads Feed */}
            {recentUploads.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Upload Status
                </h4>
                <div className="space-y-2.5">
                  {recentUploads.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="font-semibold text-gray-800 truncate">{item.name}</span>
                      </div>

                      <div>
                        {item.status === 'uploading' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                            <svg className="animate-spin h-3 w-3 text-amber-800" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Uploading {item.progress}%
                          </span>
                        )}
                        {item.status === 'published' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                            ✓ Published
                          </span>
                        )}
                        {item.status === 'failed' && (
                          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold">
                            ✕ Failed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelUpload;