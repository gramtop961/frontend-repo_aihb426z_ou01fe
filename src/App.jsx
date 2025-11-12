import { useEffect, useMemo, useRef, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

function Navbar({ cartCount }) {
  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-white/60 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gradient-to-br from-[#1B3A52] to-[#5C4033] flex items-center justify-center text-white font-black">
            A
          </div>
          <span className="font-semibold tracking-tight text-gray-900">AeroCraft Studio</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a className="hover:text-gray-900" href="#shop">Shop</a>
          <a className="hover:text-gray-900" href="#about">About</a>
          <a className="hover:text-gray-900" href="#contact">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[#1B3A52] text-white text-sm font-medium hover:opacity-90 transition">
            <span>Cart</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#1B3A52] text-xs font-bold">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function Icon({ name, className = '' }) {
  const paths = {
    rotate: 'M13.828 14.828a4 4 0 1 1-5.656-5.656M15 2v6h-6',
    plus: 'M12 6v12M6 12h12',
    minus: 'M6 12h12',
    reset: 'M4.5 12a7.5 7.5 0 1 0 2.121-5.303L4.5 9M3 3v6h6',
    pause: 'M10 6h2v12h-2zM14 6h2v12h-2z',
    play: 'M8 6l10 6-10 6V6z',
    expand: 'M4 14v6h6M20 10V4h-6M4 10V4h6M20 14v6h-6',
    ar: 'M4 7l8-4 8 4v10l-8 4-8-4V7zm8 8V7',
    info: 'M12 9h.01M11 12h2v6h-2z',
    star: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${className}`}>
      <path d={paths[name]} />
    </svg>
  )
}

function HeroViewer({ model, onAddToCart, autoplay, setAutoplay }) {
  const viewerRef = useRef(null)
  const containerRef = useRef(null)

  // Zoom helpers using model-viewer API (fieldOfView)
  const adjustFOV = (delta) => {
    const el = viewerRef.current
    if (!el) return
    const current = parseFloat((el.getAttribute('field-of-view') || el.fieldOfView || '45deg').toString())
    let next = Math.max(15, Math.min(70, current + delta))
    el.setAttribute('field-of-view', `${next}deg`)
  }

  const resetView = () => {
    const el = viewerRef.current
    if (!el) return
    el.resetTurntableRotation()
    el.setAttribute('camera-orbit', 'auto auto auto')
    el.setAttribute('field-of-view', '45deg')
  }

  const toggleFullscreen = () => {
    const node = containerRef.current
    if (!node) return
    if (!document.fullscreenElement) node.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  useEffect(() => {
    const el = viewerRef.current
    if (!el) return
    el.addEventListener('load', () => {
      // ensure shadows and exposure for cinematic look
      el.setAttribute('shadow-intensity', '1')
      el.setAttribute('exposure', '1.0')
    })
    return () => {}
  }, [model?.src])

  useEffect(() => {
    const el = viewerRef.current
    if (!el) return
    el.setAttribute('auto-rotate', autoplay ? '' : null)
  }, [autoplay])

  return (
    <div ref={containerRef} className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-gradient-to-b from-slate-50 to-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(27,58,82,0.08),_transparent_60%)]" />
      <model-viewer
        ref={viewerRef}
        src={model.src}
        ios-src={model.usdz || ''}
        ar
        ar-modes="scene-viewer quick-look webxr"
        camera-controls
        interaction-prompt="when-focused"
        autoplay
        auto-rotate
        environment-image="https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.hdr"
        poster=""
        shadow-intensity="1"
        camera-orbit="0deg 75deg auto"
        field-of-view="45deg"
        style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(180deg,#eef5fb,white)' }}
      >
        {/* Hotspots (example positions) */}
        <button slot="hotspot-1" data-position="0.1m 0.2m 0.05m" data-normal="0m 1m 0m" class="hotspot" data-visible>Propeller</button>
        <button slot="hotspot-2" data-position="-0.2m 0.1m 0.1m" data-normal="0m 1m 0m" class="hotspot" data-visible>Cockpit</button>
        <div slot="progress-bar" class="absolute inset-x-0 bottom-0 h-1 bg-black/5">
          <div class="loading-bar h-full bg-[#C9A961]" />
        </div>
      </model-viewer>

      {/* Controls overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 text-white">
        <div className="px-2.5 py-1.5 text-xs rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center gap-2">
          <Icon name="rotate" />
          <span>Drag to rotate 360°</span>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button onClick={() => setAutoplay((v) => !v)} className="icon-btn" aria-label="Toggle auto-rotate">
          <Icon name={autoplay ? 'pause' : 'play'} />
        </button>
        <button onClick={toggleFullscreen} className="icon-btn" aria-label="Fullscreen">
          <Icon name="expand" />
        </button>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button onClick={() => adjustFOV(-5)} className="icon-btn" aria-label="Zoom in">
          <Icon name="plus" />
        </button>
        <button onClick={() => adjustFOV(5)} className="icon-btn" aria-label="Zoom out">
          <Icon name="minus" />
        </button>
        <button onClick={resetView} className="icon-btn" aria-label="Reset view">
          <Icon name="reset" />
        </button>
        <a href={model.arLink || '#'} className="icon-btn" aria-label="View in AR">
          <Icon name="ar" />
        </a>
      </div>
    </div>
  )
}

function Hero({ featured, selectedIndex, setSelectedIndex, onAddToCart }) {
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      if (!autoplay) return
      setSelectedIndex((i) => (i + 1) % featured.length)
    }, 9000)
    return () => clearInterval(id)
  }, [autoplay, featured.length, setSelectedIndex])

  const selected = featured[selectedIndex]

  return (
    <section className="pt-24 sm:pt-28 pb-10 bg-gradient-to-b from-[#F3F7FA] to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <p className="text-xs tracking-widest font-semibold text-[#1B3A52]">HANDCRAFTED AVIATION ART</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Explore in Premium 3D
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Rotate, zoom, and view at home in AR. Museum-grade aircraft models finished in premium walnut and antique gold details.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#shop" className="inline-flex items-center justify-center rounded-md bg-[#1B3A52] px-5 py-3 text-white font-medium hover:opacity-90">Shop Models</a>
            <a href="#about" className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-3 text-gray-800 font-medium hover:bg-gray-50">Learn More</a>
          </div>
          <div className="mt-6 text-sm text-gray-500">Made to order • Certificate of authenticity • Global shipping</div>
          <div className="mt-6 rounded-xl border p-4 bg-white/70 backdrop-blur">
            <div className="flex items-center gap-2 text-[#C9A961]">
              <Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" />
              <span className="text-gray-700 text-sm">(47 reviews)</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">“The most realistic wood aircraft models I’ve ever seen.”</div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <HeroViewer model={selected} onAddToCart={() => onAddToCart(selected)} autoplay={autoplay} setAutoplay={setAutoplay} />
          {/* Info bar */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selected.title}</h3>
              <p className="text-sm text-gray-600">{selected.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold text-gray-900">${selected.price.toLocaleString()}</span>
              <button onClick={() => onAddToCart(selected)} className="inline-flex items-center justify-center rounded-md bg-[#1B3A52] px-4 py-2 text-white text-sm font-medium hover:opacity-90">Add to Cart</button>
              <button className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">Customize</button>
            </div>
          </div>
          {/* Thumbnails */}
          <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
            {featured.map((m, idx) => (
              <button key={m.id} onClick={() => setSelectedIndex(idx)} className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border ${idx === selectedIndex ? 'border-[#C9A961] ring-2 ring-[#C9A961]/40' : 'border-gray-200'}`}>
                <img src={m.thumb} alt={m.title} className="w-full h-full object-cover" />
                {idx === selectedIndex && <span className="absolute inset-0 ring inset-shadow" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, onAdd }) {
  const price = useMemo(() => `$${product.price.toLocaleString()}` , [product.price])
  return (
    <div className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="aspect-square bg-gray-50">
        {product.modelUrl ? (
          <model-viewer
            src={product.modelUrl}
            ar
            camera-controls
            auto-rotate
            style={{ width: '100%', height: '100%' }}
          ></model-viewer>
        ) : (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{product.title}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <div className="font-semibold text-gray-900">{price}</div>
        </div>
        <button onClick={() => onAdd(product)} className="mt-4 w-full inline-flex items-center justify-center rounded-md bg-[#1B3A52] px-4 py-2 text-white text-sm font-medium hover:opacity-90">Add to cart</button>
      </div>
    </div>
  )
}

export default function App() {
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Featured models for hero carousel (demo assets)
  const [featured, setFeatured] = useState([
    {
      id: 'm1',
      title: 'P-51 Mustang – Premium Walnut',
      subtitle: '28 hours of meticulous handcrafting',
      price: 850,
      src: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      usdz: '',
      thumb: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'm2',
      title: 'Spitfire Mk IX – Limited Edition',
      subtitle: 'Hand-carved, museum-grade finish',
      price: 960,
      src: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      usdz: '',
      thumb: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'm3',
      title: 'Bell 47 Helicopter – Heritage Oak',
      subtitle: 'Expertly crafted rotor assembly',
      price: 920,
      src: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      usdz: '',
      thumb: 'https://images.unsplash.com/photo-1519408469771-2586093c3f14?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'm4',
      title: 'DC-3 – Vintage Finish',
      subtitle: 'Authentic details, brass accents',
      price: 1100,
      src: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      usdz: '',
      thumb: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600&auto=format&fit=crop',
    }
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function loadProducts() {
      try {
        const url = BACKEND_URL ? `${BACKEND_URL}/products` : '/api/products'
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        if (!cancelled) {
          setProducts(data)
        }
      } catch (e) {
        if (!cancelled) {
          setProducts([
            {
              id: 'demo-1',
              title: 'P-51 Mustang (1:32)',
              category: 'Airplane',
              price: 850,
              image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
              modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
            },
            {
              id: 'demo-2',
              title: 'Bell 47 Helicopter (1:24)',
              category: 'Helicopter',
              price: 920,
              image: 'https://images.unsplash.com/photo-1519408469771-2586093c3f14?q=80&w=1200&auto=format&fit=crop',
              modelUrl: ''
            },
            {
              id: 'demo-3',
              title: 'Spitfire Mk IX (1:48)',
              category: 'Airplane',
              price: 640,
              image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1200&auto=format&fit=crop',
              modelUrl: ''
            }
          ])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadProducts()
    return () => { cancelled = true }
  }, [])

  const addToCart = (p) => setCart((c) => [...c, p])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar cartCount={cart.length} />
      <main>
        <Hero featured={featured} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} onAddToCart={addToCart} />

        <section id="shop" className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Featured Models</h2>
                <p className="text-gray-600 text-sm mt-1">Rotate in 3D and view at home in AR on compatible devices.</p>
              </div>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">View all</a>
            </div>
            {loading ? (
              <div className="text-gray-600">Loading products…</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id || p._id} product={p} onAdd={addToCart} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="about" className="py-16 bg-gray-50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
            <img className="rounded-xl shadow-md" src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1600&auto=format&fit=crop" alt="Craftsmanship" />
            <div>
              <h3 className="text-2xl font-bold">Crafted by hand, finished to perfection</h3>
              <p className="mt-3 text-gray-600">Every model is made to order with meticulous attention to detail. Expect subtle variations that make each piece truly unique. Typical lead time: 3–6 weeks.</p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li>• Premium materials and museum-grade finishes</li>
                <li>• Certificate of authenticity included</li>
                <li>• Safe worldwide shipping and custom crates</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-semibold">Have a custom request?</h3>
            <p className="text-gray-600 mt-1">Tell us which aircraft, scale, and finish you want. We’ll reply within 1–2 business days.</p>
            <form className="mt-6 grid sm:grid-cols-2 gap-4">
              <input className="border rounded-md px-3 py-2" placeholder="Name" />
              <input className="border rounded-md px-3 py-2" placeholder="Email" />
              <input className="border rounded-md px-3 py-2 sm:col-span-2" placeholder="Subject" />
              <textarea className="border rounded-md px-3 py-2 sm:col-span-2" rows={4} placeholder="Describe your project"></textarea>
              <button type="button" className="sm:col-span-2 inline-flex items-center justify-center rounded-md bg-[#1B3A52] px-5 py-3 text-white font-medium hover:opacity-90">Send</button>
            </form>
          </div>
        </section>
      </main>
      <footer className="py-8 border-t text-center text-sm text-gray-500">© {new Date().getFullYear()} AeroCraft Studio. All rights reserved.</footer>

      {/* Local styles for controls */}
      <style>{`
        .icon-btn { @apply inline-flex items-center justify-center w-9 h-9 rounded-md bg-black/40 text-white backdrop-blur border border-white/10 hover:bg-black/50 transition; }
        model-viewer::part(default-progress-bar) { display: none; }
        .loading-bar { width: 50%; animation: load 2s infinite; }
        @keyframes load { 0% { width: 0% } 50% { width: 80% } 100% { width: 0% } }
        .hotspot { @apply px-2 py-1 text-xs rounded bg-[#1B3A52] text-white shadow; }
      `}</style>
    </div>
  )
}
