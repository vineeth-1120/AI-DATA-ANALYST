'use client';
import { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { api } from '@/lib/api';

export function FileUpload({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleUpload(file);
    }
  }, []);

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      alert('Only CSV or XLSX files are allowed.');
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await api.post('/datasets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadSuccess();
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50/10' : 'border-zinc-700 hover:border-zinc-500'}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input 
        id="file-upload" 
        type="file" 
        className="hidden" 
        accept=".csv,.xlsx" 
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])} 
      />
      <UploadCloud className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
      <h3 className="text-lg font-medium text-white mb-1">Click to upload or drag and drop</h3>
      <p className="text-sm text-zinc-400">CSV or Excel (max. 100MB)</p>
      {isUploading && <p className="mt-4 text-blue-400">Uploading...</p>}
    </div>
  );
}
