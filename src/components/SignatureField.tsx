'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useThemeClasses } from '@/contexts/ThemeContext';

interface SignatureFieldProps {
  label: string;
  name: string;
  value?: string;
  onChange: (signature: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export const SignatureField: React.FC<SignatureFieldProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureType, setSignatureType] = useState<'draw' | 'upload'>('draw');
  const themeClasses = useThemeClasses();

  useEffect(() => {
    if (value) {
      setHasSignature(true);
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = value;
        }
      }
    }
  }, [value]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    canvas.style.touchAction = 'none';

    return { canvas, scaleX, scaleY };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return;

    const setup = setupCanvas();
    if (!setup) return;

    const { canvas, scaleX, scaleY } = setup;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;

    const setup = setupCanvas();
    if (!setup) return;

    const { canvas, scaleX, scaleY } = setup;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasSignature(true);
    saveSignature();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    onChange(dataURL);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);


        const aspectRatio = img.width / img.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;

        if (aspectRatio > canvas.width / canvas.height) {
          drawHeight = canvas.width / aspectRatio;
        } else {
          drawWidth = canvas.height * aspectRatio;
        }

        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        setHasSignature(true);
        saveSignature();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-bold ${themeClasses.textPrimary}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>


      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`${name}_type`}
            value="draw"
            checked={signatureType === 'draw'}
            onChange={() => setSignatureType('draw')}
            disabled={disabled}
            className="text-blue-600"
          />
          <span className={`text-sm ${themeClasses.textSecondary}`}>Desenhar</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`${name}_type`}
            value="upload"
            checked={signatureType === 'upload'}
            onChange={() => setSignatureType('upload')}
            disabled={disabled}
            className="text-blue-600"
          />
          <span className={`text-sm ${themeClasses.textSecondary}`}>Upload</span>
        </label>
      </div>


      <div className={`border-2 border-dashed rounded-lg p-4 ${themeClasses.border} ${disabled ? 'opacity-50' : ''}`}>
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className={`w-full h-32 border rounded cursor-crosshair ${themeClasses.input}`}
          onMouseDown={signatureType === 'draw' ? startDrawing : undefined}
          onMouseMove={signatureType === 'draw' ? draw : undefined}
          onMouseUp={signatureType === 'draw' ? stopDrawing : undefined}
          onMouseLeave={signatureType === 'draw' ? stopDrawing : undefined}
          onTouchStart={signatureType === 'draw' ? startDrawing : undefined}
          onTouchMove={signatureType === 'draw' ? draw : undefined}
          onTouchEnd={signatureType === 'draw' ? stopDrawing : undefined}
          style={{ touchAction: 'none' }}
        />

        {!hasSignature && (
          <p className={`text-center text-sm ${themeClasses.textSecondary} mt-2`}>
            {signatureType === 'draw'
              ? 'Clique e arraste para desenhar sua assinatura'
              : 'Use o botão abaixo para fazer upload de uma imagem'
            }
          </p>
        )}
      </div>


      <div className="flex gap-2 flex-wrap">
        {signatureType === 'upload' && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                         ${themeClasses.btnSecondary}`}
            >
              📁 Selecionar Imagem
            </button>
          </>
        )}

        <button
          type="button"
          onClick={clearSignature}
          disabled={disabled || !hasSignature}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                     bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          🗑️ Limpar
        </button>
      </div>
    </div>
  );
};
