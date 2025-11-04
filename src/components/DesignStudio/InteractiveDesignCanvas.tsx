import { useState, useRef, useEffect } from 'react';
import { Type, Image as ImageIcon, Upload, Download, Trash2, Copy, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';

interface DesignElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  color?: string;
  zIndex: number;
}

interface InteractiveDesignCanvasProps {
  template: {
    id: string;
    name: string;
    thumbnail: string;
    width: number;
    height: number;
  };
  onExport?: () => void;
}

export function InteractiveDesignCanvas({ template, onExport }: InteractiveDesignCanvasProps) {
  const [elements, setElements] = useState<DesignElement[]>([
    {
      id: '1',
      type: 'text',
      content: 'Your Headline Here',
      x: 50,
      y: 100,
      width: 400,
      height: 80,
      fontSize: 48,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#1e293b',
      zIndex: 1,
    },
  ]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(template.thumbnail);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scale = 0.5;

  const handleAddText = () => {
    const newElement: DesignElement = {
      id: crypto.randomUUID(),
      type: 'text',
      content: 'New Text',
      x: 100,
      y: 100,
      width: 300,
      height: 60,
      fontSize: 32,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#000000',
      zIndex: elements.length + 1,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragState({
      id: elementId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
    setSelectedElement(elementId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = (e.clientX - canvasRect.left - dragState.offsetX) / scale;
    const newY = (e.clientY - canvasRect.top - dragState.offsetY) / scale;

    setElements(elements.map(el =>
      el.id === dragState.id
        ? { ...el, x: Math.max(0, Math.min(template.width - el.width, newX)), y: Math.max(0, Math.min(template.height - el.height, newY)) }
        : el
    ));
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  const handleContentChange = (id: string, content: string) => {
    setElements(elements.map(el => el.id === id ? { ...el, content } : el));
  };

  const handleStyleChange = (id: string, property: string, value: any) => {
    setElements(elements.map(el => el.id === id ? { ...el, [property]: value } : el));
  };

  const handleDelete = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const handleDuplicate = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const newElement = {
      ...element,
      id: crypto.randomUUID(),
      x: element.x + 20,
      y: element.y + 20,
      zIndex: elements.length + 1,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBackgroundImage(url);
    }
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <div className="flex gap-6 h-full">
      <div className="w-20 bg-white rounded-xl border border-slate-200 p-3 flex flex-col items-center gap-4">
        <button
          onClick={handleAddText}
          className="p-3 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors group"
          title="Add Text"
        >
          <Type className="w-6 h-6" />
        </button>
        <label className="p-3 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer group" title="Change Background">
          <Upload className="w-6 h-6" />
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
            className="hidden"
          />
        </label>
        <div className="flex-1" />
        <button
          onClick={onExport}
          className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all"
          title="Export Design"
        >
          <Download className="w-6 h-6" />
        </button>
      </div>

      <div
        ref={canvasRef}
        className="flex-1 bg-slate-100 rounded-xl border border-slate-200 p-8 flex items-center justify-center overflow-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => setSelectedElement(null)}
      >
        <div
          className="bg-white shadow-2xl relative overflow-hidden"
          style={{
            width: template.width * scale,
            height: template.height * scale,
          }}
        >
          <img
            src={backgroundImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-move ${
                selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                left: element.x * scale,
                top: element.y * scale,
                width: element.width * scale,
                height: element.height * scale,
                zIndex: element.zIndex,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedElement(element.id);
              }}
            >
              {element.type === 'text' && (
                <input
                  type="text"
                  value={element.content}
                  onChange={(e) => handleContentChange(element.id, e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-full h-full bg-transparent border-none outline-none resize-none"
                  style={{
                    fontSize: (element.fontSize || 16) * scale,
                    fontWeight: element.fontWeight,
                    fontStyle: element.fontStyle,
                    textAlign: element.textAlign as any,
                    color: element.color,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-80 bg-white rounded-xl border border-slate-200 p-6 overflow-y-auto">
        {selectedEl ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-900">Element Properties</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDuplicate(selectedEl.id)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => handleDelete(selectedEl.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {selectedEl.type === 'text' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Text Content</label>
                  <textarea
                    value={selectedEl.content}
                    onChange={(e) => handleContentChange(selectedEl.id, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={selectedEl.fontSize || 16}
                    onChange={(e) => handleStyleChange(selectedEl.id, 'fontSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-right text-sm text-slate-600 mt-1">{selectedEl.fontSize}px</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedEl.color || '#000000'}
                      onChange={(e) => handleStyleChange(selectedEl.id, 'color', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedEl.color || '#000000'}
                      onChange={(e) => handleStyleChange(selectedEl.id, 'color', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Style</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStyleChange(selectedEl.id, 'fontWeight', selectedEl.fontWeight === 'bold' ? 'normal' : 'bold')}
                      className={`flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-bold transition-colors ${
                        selectedEl.fontWeight === 'bold' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''
                      }`}
                    >
                      <Bold className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleStyleChange(selectedEl.id, 'fontStyle', selectedEl.fontStyle === 'italic' ? 'normal' : 'italic')}
                      className={`flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 italic transition-colors ${
                        selectedEl.fontStyle === 'italic' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''
                      }`}
                    >
                      <Italic className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Alignment</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStyleChange(selectedEl.id, 'textAlign', 'left')}
                      className={`flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors ${
                        selectedEl.textAlign === 'left' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''
                      }`}
                    >
                      <AlignLeft className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleStyleChange(selectedEl.id, 'textAlign', 'center')}
                      className={`flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors ${
                        selectedEl.textAlign === 'center' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''
                      }`}
                    >
                      <AlignCenter className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleStyleChange(selectedEl.id, 'textAlign', 'right')}
                      className={`flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors ${
                        selectedEl.textAlign === 'right' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''
                      }`}
                    >
                      <AlignRight className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600">X</label>
                      <input
                        type="number"
                        value={Math.round(selectedEl.x)}
                        onChange={(e) => handleStyleChange(selectedEl.id, 'x', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600">Y</label>
                      <input
                        type="number"
                        value={Math.round(selectedEl.y)}
                        onChange={(e) => handleStyleChange(selectedEl.id, 'y', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600">Width</label>
                      <input
                        type="number"
                        value={Math.round(selectedEl.width)}
                        onChange={(e) => handleStyleChange(selectedEl.id, 'width', parseInt(e.target.value) || 100)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600">Height</label>
                      <input
                        type="number"
                        value={Math.round(selectedEl.height)}
                        onChange={(e) => handleStyleChange(selectedEl.id, 'height', parseInt(e.target.value) || 50)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Type className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Element Selected</h3>
            <p className="text-sm text-slate-600">Click on an element to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
}
