import { useState, useRef, useEffect } from 'react';
import { Type, Upload, Download, Trash2, Copy, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Minus, Plus } from 'lucide-react';

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
  backgroundColor?: string;
  zIndex: number;
  rotation?: number;
}

interface EnhancedInteractiveCanvasProps {
  template: {
    id: string;
    name: string;
    thumbnail: string;
    width: number;
    height: number;
  };
  onExport?: () => void;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;

export function EnhancedInteractiveCanvas({ template, onExport }: EnhancedInteractiveCanvasProps) {
  const [elements, setElements] = useState<DesignElement[]>([
    {
      id: '1',
      type: 'text',
      content: 'Click to Edit',
      x: 100,
      y: 100,
      width: 400,
      height: 100,
      fontSize: 48,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'center',
      color: '#1e293b',
      backgroundColor: 'transparent',
      zIndex: 1,
    },
  ]);
  const [selectedElement, setSelectedElement] = useState<string | null>('1');
  const [dragState, setDragState] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [resizeState, setResizeState] = useState<{ id: string; handle: ResizeHandle; startX: number; startY: number; startWidth: number; startHeight: number; startElementX: number; startElementY: number } | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(template.thumbnail);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scale = 0.5;
  const minTextSize = 20;

  const handleAddText = () => {
    const newElement: DesignElement = {
      id: crypto.randomUUID(),
      type: 'text',
      content: 'Double-click to edit',
      x: 150,
      y: 150 + (elements.length * 20),
      width: 300,
      height: 80,
      fontSize: 32,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      color: '#000000',
      backgroundColor: 'transparent',
      zIndex: elements.length + 1,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (isEditing === elementId) return;

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

  const handleResizeMouseDown = (e: React.MouseEvent, elementId: string, handle: ResizeHandle) => {
    e.stopPropagation();
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    setResizeState({
      id: elementId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: element.width,
      startHeight: element.height,
      startElementX: element.x,
      startElementY: element.y,
    });
    setSelectedElement(elementId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    if (dragState) {
      const newX = (e.clientX - canvasRect.left - dragState.offsetX) / scale;
      const newY = (e.clientY - canvasRect.top - dragState.offsetY) / scale;

      setElements(elements.map(el =>
        el.id === dragState.id
          ? {
              ...el,
              x: Math.max(0, Math.min(template.width - el.width, newX)),
              y: Math.max(0, Math.min(template.height - el.height, newY))
            }
          : el
      ));
    }

    if (resizeState) {
      const deltaX = (e.clientX - resizeState.startX) / scale;
      const deltaY = (e.clientY - resizeState.startY) / scale;
      const element = elements.find(el => el.id === resizeState.id);
      if (!element) return;

      let newWidth = resizeState.startWidth;
      let newHeight = resizeState.startHeight;
      let newX = resizeState.startElementX;
      let newY = resizeState.startElementY;

      switch (resizeState.handle) {
        case 'se':
          newWidth = Math.max(minTextSize, resizeState.startWidth + deltaX);
          newHeight = Math.max(minTextSize, resizeState.startHeight + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(minTextSize, resizeState.startWidth - deltaX);
          newHeight = Math.max(minTextSize, resizeState.startHeight + deltaY);
          newX = resizeState.startElementX + (resizeState.startWidth - newWidth);
          break;
        case 'ne':
          newWidth = Math.max(minTextSize, resizeState.startWidth + deltaX);
          newHeight = Math.max(minTextSize, resizeState.startHeight - deltaY);
          newY = resizeState.startElementY + (resizeState.startHeight - newHeight);
          break;
        case 'nw':
          newWidth = Math.max(minTextSize, resizeState.startWidth - deltaX);
          newHeight = Math.max(minTextSize, resizeState.startHeight - deltaY);
          newX = resizeState.startElementX + (resizeState.startWidth - newWidth);
          newY = resizeState.startElementY + (resizeState.startHeight - newHeight);
          break;
        case 'e':
          newWidth = Math.max(minTextSize, resizeState.startWidth + deltaX);
          break;
        case 'w':
          newWidth = Math.max(minTextSize, resizeState.startWidth - deltaX);
          newX = resizeState.startElementX + (resizeState.startWidth - newWidth);
          break;
        case 'n':
          newHeight = Math.max(minTextSize, resizeState.startHeight - deltaY);
          newY = resizeState.startElementY + (resizeState.startHeight - newHeight);
          break;
        case 's':
          newHeight = Math.max(minTextSize, resizeState.startHeight + deltaY);
          break;
      }

      const scaleFactor = Math.min(newWidth / resizeState.startWidth, newHeight / resizeState.startHeight);
      const newFontSize = Math.max(12, Math.min(120, (element.fontSize || 16) * scaleFactor));

      setElements(elements.map(el =>
        el.id === resizeState.id
          ? { ...el, width: newWidth, height: newHeight, x: newX, y: newY, fontSize: newFontSize }
          : el
      ));
    }
  };

  const handleMouseUp = () => {
    setDragState(null);
    setResizeState(null);
  };

  const handleDoubleClick = (elementId: string) => {
    setIsEditing(elementId);
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

  const resizeHandles: Array<{ handle: ResizeHandle; className: string; cursor: string }> = [
    { handle: 'nw', className: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2', cursor: 'nwse-resize' },
    { handle: 'ne', className: 'top-0 right-0 translate-x-1/2 -translate-y-1/2', cursor: 'nesw-resize' },
    { handle: 'sw', className: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2', cursor: 'nesw-resize' },
    { handle: 'se', className: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2', cursor: 'nwse-resize' },
    { handle: 'n', className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2', cursor: 'ns-resize' },
    { handle: 's', className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', cursor: 'ns-resize' },
    { handle: 'e', className: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize' },
    { handle: 'w', className: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize' },
  ];

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
        onClick={() => {
          setSelectedElement(null);
          setIsEditing(null);
        }}
      >
        <div
          className="bg-white shadow-2xl relative overflow-hidden select-none"
          style={{
            width: template.width * scale,
            height: template.height * scale,
          }}
        >
          <img
            src={backgroundImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
          />

          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute group ${isEditing !== element.id ? 'cursor-move' : ''} ${
                selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                left: element.x * scale,
                top: element.y * scale,
                width: element.width * scale,
                height: element.height * scale,
                zIndex: element.zIndex,
                backgroundColor: element.backgroundColor,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
              onDoubleClick={() => handleDoubleClick(element.id)}
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing !== element.id) {
                  setSelectedElement(element.id);
                }
              }}
            >
              {element.type === 'text' && (
                isEditing === element.id ? (
                  <textarea
                    value={element.content}
                    onChange={(e) => handleContentChange(element.id, e.target.value)}
                    onBlur={() => setIsEditing(null)}
                    onMouseDown={(e) => e.stopPropagation()}
                    autoFocus
                    className="w-full h-full bg-transparent border-none outline-none resize-none p-2"
                    style={{
                      fontSize: (element.fontSize || 16) * scale,
                      fontWeight: element.fontWeight,
                      fontStyle: element.fontStyle,
                      textAlign: element.textAlign as any,
                      color: element.color,
                      lineHeight: '1.2',
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center p-2 pointer-events-none"
                    style={{
                      fontSize: (element.fontSize || 16) * scale,
                      fontWeight: element.fontWeight,
                      fontStyle: element.fontStyle,
                      textAlign: element.textAlign as any,
                      color: element.color,
                      lineHeight: '1.2',
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                    }}
                  >
                    {element.content}
                  </div>
                )
              )}

              {selectedElement === element.id && isEditing !== element.id && (
                <>
                  {resizeHandles.map(({ handle, className, cursor }) => (
                    <div
                      key={handle}
                      className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full ${className}`}
                      style={{ cursor }}
                      onMouseDown={(e) => handleResizeMouseDown(e, element.id, handle)}
                    />
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-80 bg-white rounded-xl border border-slate-200 p-6 overflow-y-auto">
        {selectedEl ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-900">Properties</h3>
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
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Double-click text on canvas to edit</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">Font Size</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStyleChange(selectedEl.id, 'fontSize', Math.max(12, (selectedEl.fontSize || 16) - 2))}
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-mono w-10 text-center">{selectedEl.fontSize}px</span>
                      <button
                        onClick={() => handleStyleChange(selectedEl.id, 'fontSize', Math.min(120, (selectedEl.fontSize || 16) + 2))}
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={selectedEl.fontSize || 16}
                    onChange={(e) => handleStyleChange(selectedEl.id, 'fontSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Text Color</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Background</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedEl.backgroundColor === 'transparent' ? '#ffffff' : selectedEl.backgroundColor || '#ffffff'}
                      onChange={(e) => handleStyleChange(selectedEl.id, 'backgroundColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-slate-300 cursor-pointer"
                    />
                    <button
                      onClick={() => handleStyleChange(selectedEl.id, 'backgroundColor', 'transparent')}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm"
                    >
                      Transparent
                    </button>
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

                <div className="pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-600 mb-2">Tips:</p>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• Drag to move</li>
                    <li>• Double-click to edit</li>
                    <li>• Drag corners/edges to resize</li>
                    <li>• Text auto-scales with box</li>
                  </ul>
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
            <p className="text-sm text-slate-600 mb-4">Click on a text box to edit</p>
            <button
              onClick={handleAddText}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              Add Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
