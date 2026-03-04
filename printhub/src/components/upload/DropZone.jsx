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
      pages: null, // detected server-side; mock here
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
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <Upload size={26} className="text-primary-600" />
        </div>
        <p className="font-semibold text-gray-800 mb-1">
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500 mb-3">or click to browse</p>
        <p className="text-xs text-gray-400">PDF, DOCX, PPTX, JPG, PNG • Max 50MB • Up to 10 files</p>
      </div>

      {fileRejections.length > 0 && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">Some files were rejected. Check file type and size limits.</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map(f => {
            const Icon = fileIcon(f.type);
            return (
              <div key={f.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{f.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatSize(f.size)} • {f.pages ? `${f.pages} pages` : 'Pages will be detected'}</p>
                    <input
                      type="text"
                      placeholder="Special instructions (e.g. print pages 1–10 only)"
                      value={f.instructions}
                      onChange={e => updateInstructions(f.id, e.target.value)}
                      className="mt-2 w-full text-xs border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-400"
                    />
                  </div>
                  <button
                    onClick={() => removeFile(f.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
                    aria-label="Remove file"
                  >
                    <X size={16} />
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
