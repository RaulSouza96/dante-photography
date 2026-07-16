'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Upload, Trash2, Image, Star, X, CheckCircle, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Photo {
  id: string; filename: string; path: string; featured: boolean; createdAt: string
}

interface GalleryInfo {
  id: string; name: string; description: string | null;
  client: { name: string } | null; category: { name: string; emoji: string } | null
  photos: Photo[]
}

export default function AdminGaleriaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [gallery, setGallery] = useState<GalleryInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<{ file: File; preview: string; progress: number; done: boolean; error: boolean }[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/galerias/${id}`)
    const data = await res.json()
    setGallery(data.gallery || null)
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const arr = Array.from(fileList).filter(f => f.type.startsWith('image/')).map(file => ({
      file, preview: URL.createObjectURL(file), progress: 0, done: false, error: false
    }))
    setUploadFiles(prev => [...prev, ...arr])
  }

  const uploadAll = async () => {
    if (uploadFiles.length === 0) return
    setUploading(true)
    for (let i = 0; i < uploadFiles.length; i++) {
      if (uploadFiles[i].done) continue
      setUploadFiles(prev => prev.map((f, j) => j === i ? { ...f, progress: 50 } : f))
      const formData = new FormData()
      formData.append('file', uploadFiles[i].file)
      formData.append('galleryId', id)
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        setUploadFiles(prev => prev.map((f, j) => j === i ? { ...f, progress: 100, done: res.ok, error: !res.ok } : f))
      } catch {
        setUploadFiles(prev => prev.map((f, j) => j === i ? { ...f, progress: 100, error: true } : f))
      }
    }
    setUploading(false)
    setUploadFiles([])
    load()
  }

  const deletePhoto = async (photoId: string) => {
    if (!confirm('Excluir esta foto?')) return
    await fetch(`/api/admin/upload?photoId=${photoId}`, { method: 'DELETE' })
    load()
  }

  const toggleFeatured = async (photoId: string, featured: boolean) => {
    await fetch(`/api/admin/upload`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId, featured: !featured }),
    })
    load()
  }

  const setCover = async (photoPath: string) => {
    await fetch(`/api/admin/galerias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coverImage: photoPath }),
    })
    load()
  }

  if (loading) return <div className="max-w-6xl mx-auto"><div className="h-8 w-48 bg-white/5 rounded animate-pulse" /></div>
  if (!gallery) return <div className="max-w-6xl mx-auto text-center py-16"><p className="text-white/40">Galeria não encontrada</p></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Link href="/admin/galerias" className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gradient-gold">{gallery.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            {gallery.category && <span className="text-xs text-[#D4AF37]/60">{gallery.category.emoji} {gallery.category.name}</span>}
            {gallery.client && <span className="text-xs text-white/30">👤 {gallery.client.name}</span>}
            <span className="text-xs text-white/30">{gallery.photos.length} foto{gallery.photos.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </motion.div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragging ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 hover:border-white/20'}`}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 ${dragging ? 'text-[#D4AF37]' : 'text-white/20'}`} />
        <p className="text-sm text-white/60">Arraste imagens ou clique para selecionar</p>
        <p className="text-xs text-white/30 mt-1">PNG, JPG, WebP — Múltiplos arquivos</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
      </div>

      {/* Pending uploads */}
      {uploadFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/60">{uploadFiles.length} arquivo{uploadFiles.length !== 1 ? 's' : ''}</p>
            <div className="flex gap-2">
              <button onClick={() => setUploadFiles([])} className="btn-glass rounded-lg px-4 py-2 text-sm">Limpar</button>
              <button onClick={uploadAll} disabled={uploading} className="btn-gold rounded-lg px-6 py-2 text-sm disabled:opacity-50">
                {uploading ? 'Enviando...' : 'Enviar Todos'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {uploadFiles.map((f, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden">
                <img src={f.preview} alt="" className="w-full h-20 object-cover" />
                {f.progress > 0 && f.progress < 100 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-2/3 h-1 bg-white/10 rounded-full"><div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${f.progress}%` }} /></div>
                  </div>
                )}
                {f.done && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-400" /></div>}
                {f.error && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center"><X className="w-6 h-6 text-red-400" /></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing photos */}
      <div>
        <h2 className="text-sm font-semibold text-white/60 mb-3">Fotos da Galeria</h2>
        {gallery.photos.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <Image className="w-12 h-12 mx-auto text-white/10 mb-3" />
            <p className="text-sm text-white/30">Nenhuma foto nesta galeria</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {gallery.photos.map((photo, i) => (
              <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
                className="relative group rounded-xl overflow-hidden glass">
                <img src={photo.path} alt={photo.filename} className="w-full h-36 object-cover" loading="lazy" />
                {photo.featured && (
                  <div className="absolute top-1.5 left-1.5">
                    <Star className="w-4 h-4 text-[#D4AF37] fill-current" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => toggleFeatured(photo.id, photo.featured)} title="Destaque"
                    className="p-2 rounded-lg bg-black/40 text-white/60 hover:text-[#D4AF37] transition-all">
                    <Star className={`w-4 h-4 ${photo.featured ? 'fill-current text-[#D4AF37]' : ''}`} />
                  </button>
                  <button onClick={() => setCover(photo.path)} title="Definir como capa"
                    className="p-2 rounded-lg bg-black/40 text-white/60 hover:text-[#00D4FF] transition-all">
                    <Image className="w-4 h-4" />
                  </button>
                  <button onClick={() => deletePhoto(photo.id)} title="Excluir"
                    className="p-2 rounded-lg bg-black/40 text-white/60 hover:text-red-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-[10px] text-white/30 truncate">{photo.filename}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
