import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, Presentation, Sheet, X, AlertCircle } from 'lucide-react';

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

function fileIcon(type) {
  if (type.includes('image')) return Image;
  if (type.includes('presentation') || type.includes('powerpoint')) return Presentation;
  if (type.includes('sheet') || type.includes('excel')) return Sheet;
  return FileText;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function DropZone({ files, onChange }) {
  const onDrop = useCallback((accepted) => {
    const newFiles = accepted.map(f => ({
      file: f,
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      type: f.type,
      pages: null,
      instructions: '',
    }));
    onChange([...files, ...newFiles].slice(0, 10));
  }, [files, onChange]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 10,
    maxSize: 50 * 1024 * 1024,
  });

  const removeFile = (id) => onChange(files.filter(f => f.id !== id));
  const updateInstructions = (id, val) =>
    onChange(files.map(f => f.id === id ? { ...f, instructions: val } : f));

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-150
          ${isDragActive
            ? 'border-primary-500 bg-primary-50 scale-[1.01]'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <Upload size={26} className={`transition-transform ${isDragActive ? 'scale-110 text-primary-700' : 'text-primary-600'}`} />
        </div>
        <p className="font-semibold text-gray-800 mb-1">
          {isDragActive ? 'Drop your files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500 mb-4">or tap to browse your device</p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {['PDF', 'DOCX', 'PPTX', 'JPG', 'PNG'].map(t => (
            <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-medium">{t}</span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Max 50MB per file • Up to 10 files per order</p>
      </div>

      {/* Rejection error */}
      {fileRejections.length > 0 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">
            Some files were rejected — check the file type (PDF, DOCX, PPTX, JPG, PNG only) and size limit (50MB).
          </p>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
          {files.map(f => {
            const Icon = fileIcon(f.type);
            return (
              <div key={f.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{f.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatSize(f.size)} {f.pages ? `• ${f.pages} pages` : ''}
                    </p>
                    <input
                      type="text"
                      placeholder="Special instructions — optional (e.g. print pages 1–10 only)"
                      value={f.instructions}
                      onChange={e => updateInstructions(f.id, e.target.value)}
                      className="mt-2.5 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                  {/* Larger touch target for mobile */}
                  <button
                    onClick={() => removeFile(f.id)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    aria-label={`Remove ${f.name}`}
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
