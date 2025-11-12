import { useEffect, useMemo, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

function Navbar({ cartCount }) {
  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-white/70 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black">
            A
          </div>
          <span className="font-semibold tracking-tight text-gray-900">AeroCraft Studio</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a className="hover:text-gray-900" href="#shop">Shop</a>
          <a className="hover:text-gray-900" href="#about">About</a>
          <a className="hover:text-gray-900" href="#contact">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition">
            <span>Cart</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-gray-900 text-xs font-bold">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="pt-24 sm:pt-28 pb-12 bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Handcrafted Aircraft Models in Premium 3D
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Explore museum-grade airplane and helicopter models. Rotate in 3D, zoom for detail, and view at home in AR.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#shop" className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-3 text-white font-medium hover:bg-gray-800">Shop Models</a>
            <a href="#about" className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-3 text-gray-700 font-medium hover:bg-gray-50">Learn More</a>
          </div>
          <div className="mt-6 text-sm text-gray-500">Made to order • Certificate of authenticity • Global shipping</div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-xl border border-gray-200 shadow-sm bg-white p-2">
            {/* 3D Preview using <model-viewer>. Replace src with your GLB when ready. */}
            <model-viewer
              src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
              ar
              ar-modes="scene-viewer quick-look webxr"
              camera-controls
              auto-rotate
              poster=""
              shadow-intensity="0.8"
              style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
            ></model-viewer>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white/90 rounded-lg shadow px-4 py-2 border text-xs text-gray-600">3D + AR demo. Swap with your aircraft GLB/USDZ.</div>
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
            disable-zoom={false}
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
        <button onClick={() => onAdd(product)} className="mt-4 w-full inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-white text-sm font-medium hover:bg-gray-800">Add to cart</button>
      </div>
    </div>
  )
}

export default function App() {
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadProducts() {
      try {
        const url = BACKEND_URL ? `${BACKEND_URL}/products` : '/api/products' // fallback path (proxy not set, used only if configured)
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        if (!cancelled) {
          setProducts(data)
        }
      } catch (e) {
        // Fallback demo products if backend not ready yet
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
        <Hero />

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
              <button type="button" className="sm:col-span-2 inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-3 text-white font-medium hover:bg-gray-800">Send</button>
            </form>
          </div>
        </section>
      </main>
      <footer className="py-8 border-t text-center text-sm text-gray-500">© {new Date().getFullYear()} AeroCraft Studio. All rights reserved.</footer>
    </div>
  )
}
