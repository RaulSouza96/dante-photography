'use client'
import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Image, CheckCircle } from 'lucide-react'

interface UploadFile { file: File; preview: string; progress: number; done: boolean; error: boolean }

export default function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [galleryId, setGalleryId] = useState('')
  const [galleries, setGalleries] = useState<{ id: string; name: string }[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadGalleries = useCallback(async () => {
    const r = await fetch('/api/admin/galerias'); const d = await r.json()
    setGalleries(d.galleries || [])
  }, [])

  useState(() => { loadGalleries() })

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    const arr = Array.from(newFiles).filter(f => f.type.startsWith('image/')).map(file => ({
      file, preview: URL.createObjectURL(file), progress: 0, done: false, error: false
    }))
    setFiles(prev => [...prev, ...arr])
  }

  const handleUpload = async () => {
    if (!galleryId || files.length === 0) return
    for (let i = 0; i < files.length; i++) {
      setFiles(prev => prev.map((f, j) => j === i ? { ...f, progress: 30 } : f))
      const formData = new FormData()
      formData.append('file', files[i].file)
      formData.append('galleryId', galleryId)
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        setFiles(prev => prev.map((f, j) => j === i ? { ...f, progress: 100, done: res.ok, error: !res.ok } : f))
      } catch {
        setFiles(prev => prev.map((f, j) => j === i ? { ...f, progress: 100, error: true } : f))
      }
    }
  }

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Upload de Fotos</h1>
        <p className="text-sm text-white/40 mt-1">Arraste ou selecione imagens para enviar</p>
      </motion.div>

      <div>
        <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Galeria de destino</label>
        <select value={galleryId} onChange={e => setGalleryId(e.target.value)}
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all">
          <option value="" className="bg-[#1A1A2E]">Selecione uma galeria</option>
          {galleries.map(g => <option key={g.id} value={g.id} className="bg-[#1A1A2E]">{g.name}</option>)}
        </select>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragging ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 hover:border-white/20'}`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${dragging ? 'text-[#D4AF37]' : 'text-white/20'}`} />
        <p className="text-sm text-white/60">Arraste imagens aqui ou clique para selecionar</p>
        <p className="text-xs text-white/30 mt-1">PNG, JPG, WebP — Múltiplos arquivos</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
      </div>

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/60">{files.length} arquivo{files.length !== 1 ? 's' : ''} selecionado{files.length !== 1 ? 's' : ''}</p>
            <button onClick={handleUpload} disabled={!galleryId} className="btn-gold rounded-lg px-6 py-2.5 text-sm disabled:opacity-30">
              Enviar Todos
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {files.map((f, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden relative group">
                <img src={f.preview} alt="" className="w-full h-32 object-cover" />
                {f.progress > 0 && f.progress < 100 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-3/4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${f.progress}%` }} />
                    </div>
                  </div>
                )}
                {f.done && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-green-400" /></div>}
                {f.error && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center"><X className="w-8 h-8 text-red-400" /></div>}
                {!f.done && (
                  <button onClick={() => removeFile(i)} className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="p-2"><p className="text-[10px] text-white/40 truncate">{f.file.name}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-8 text-white/20"><Image className="w-16 h-16 mx-auto mb-2" /><p className="text-xs">Nenhum arquivo selecionado</p></div>
      )}
    </div>
  )
}
