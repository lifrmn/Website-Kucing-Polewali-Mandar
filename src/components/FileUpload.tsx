'use client';

import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface FileUploadProps {
  currentImageUrl?: string;
  onUploadSuccess: (imageUrl: string) => void;
  onRemove?: () => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export default function FileUpload({
  currentImageUrl,
  onUploadSuccess,
  onRemove,
  label = 'Upload Gambar',
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  maxSizeMB = 5,
  className = '',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP');
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Upload berhasil!');
        onUploadSuccess(result.data.url);
      } else {
        toast.error(result.message || 'Upload gagal');
        setPreview(currentImageUrl || null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload gagal. Silakan coba lagi');
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        {preview ? (
          // Preview Mode
          <div className="relative p-4">
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>

            {/* Remove Button */}
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-6 right-6 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Hapus gambar"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Uploading Overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Upload Mode
          <div
            onClick={handleClick}
            className="p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Klik untuk upload atau drag & drop
            </p>
            <p className="text-xs text-slate-400">
              JPG, PNG, WebP (Maks {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>

      {/* Upload Progress/Status */}
      {uploading && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
