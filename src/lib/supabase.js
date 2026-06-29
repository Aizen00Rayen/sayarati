// ─── Mock database (localStorage) — no backend required ───────────────────────

const AG1 = 'ag-001', AG2 = 'ag-002'
const U_ADMIN = 'u-admin-1', U_AG1 = 'u-ag1-1', U_AG2 = 'u-ag2-1', U_CLIENT = 'u-client-1'

const DEMO_CREDS = [
  { id: U_ADMIN,  email: 'admin@sayarati.dz',   password: 'Admin@123',  role: 'admin',    full_name: 'مشرف سيارتي / Admin',  phone: '' },
  { id: U_AG1,   email: 'agency@sayarati.dz',   password: 'Agency@123', role: 'agency',   full_name: 'Karim Boudiaf',         phone: '+213 555 11 22 33' },
  { id: U_AG2,   email: 'agency2@sayarati.dz',  password: 'Agency@123', role: 'agency',   full_name: 'Sonia Meziane',         phone: '+213 555 44 55 66' },
  { id: U_CLIENT,email: 'client@sayarati.dz',   password: 'Client@123', role: 'customer', full_name: 'Ahmed Benali',          phone: '+213 555 77 88 99' },
]

const SEED = {
  profiles: DEMO_CREDS.map(({ id, email, full_name, role, phone }) => ({ id, email, full_name, role, phone, created_at: '2024-01-01T00:00:00Z' })),
  agencies: [
    { id: AG1, owner_id: U_AG1, name: 'وكالة الجزائر لكراء السيارات', name_fr: 'Alger Auto Location', description: 'وكالة رائدة في كراء السيارات بأسعار تنافسية وخدمة ممتازة.', description_fr: 'Agence leader de location de voitures à prix compétitifs et service premium.', city: 'Alger', phone: '+213 21 800 800', logo_url: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=200&q=70', status: 'approved', created_at: '2024-01-01T00:00:00Z', profiles: { full_name: 'Karim Boudiaf' } },
    { id: AG2, owner_id: U_AG2, name: 'الصحراء لكراء السيارات',       name_fr: 'Sahara Cars',          description: 'سيارات حديثة ودفع رباعي لاستكشاف الجنوب الجزائري.',       description_fr: 'Voitures récentes et 4x4 pour explorer le sud algérien.',                       city: 'Ouargla', phone: '+213 29 600 600', logo_url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=200&q=70', status: 'approved', created_at: '2024-01-02T00:00:00Z', profiles: { full_name: 'Sonia Meziane' } },
  ],
  cars: [
    { id:'car-1', agency_id:AG1, brand:'Volkswagen',  model:'Golf 8',       year:2023, category:'compact', transmission:'automatic', fuel:'diesel',   seats:5, price_per_day:120, city:'Alger',   available:true, description:'سيارة مدمجة عملية واقتصادية.',          image_url:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=70', created_at:'2024-01-01T00:00:00Z', agencies:{id:AG1,name:'Alger Auto Location',logo_url:'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=200&q=70',city:'Alger',phone:'+213 21 800 800',status:'approved'} },
    { id:'car-2', agency_id:AG1, brand:'Renault',      model:'Clio 5',       year:2022, category:'economy', transmission:'manual',    fuel:'gasoline', seats:5, price_per_day:85,  city:'Alger',   available:true, description:'الخيار الاقتصادي الأمثل للمدينة.',         image_url:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=70', created_at:'2024-01-01T00:00:00Z', agencies:{id:AG1,name:'Alger Auto Location',logo_url:'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=200&q=70',city:'Alger',phone:'+213 21 800 800',status:'approved'} },
    { id:'car-3', agency_id:AG1, brand:'Mercedes-Benz',model:'C-Class',      year:2023, category:'luxury',  transmission:'automatic', fuel:'diesel',   seats:5, price_per_day:320, city:'Alger',   available:true, description:'فخامة وأداء لرحلات الأعمال.',            image_url:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=70', created_at:'2024-01-01T00:00:00Z', agencies:{id:AG1,name:'Alger Auto Location',logo_url:'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=200&q=70',city:'Alger',phone:'+213 21 800 800',status:'approved'} },
    { id:'car-4', agency_id:AG1, brand:'Peugeot',      model:'3008',         year:2022, category:'suv',     transmission:'automatic', fuel:'diesel',   seats:5, price_per_day:210, city:'Alger',   available:true, description:'دفع رباعي مريح للعائلة.',               image_url:'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=70', created_at:'2024-01-01T00:00:00Z', agencies:{id:AG1,name:'Alger Auto Location',logo_url:'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=200&q=70',city:'Alger',phone:'+213 21 800 800',status:'approved'} },
    { id:'car-5', agency_id:AG2, brand:'Toyota',       model:'Land Cruiser', year:2021, category:'suv',     transmission:'automatic', fuel:'diesel',   seats:7, price_per_day:450, city:'Ouargla', available:true, description:'الأقوى لمغامرات الصحراء.',              image_url:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=70', created_at:'2024-01-02T00:00:00Z', agencies:{id:AG2,name:'Sahara Cars',logo_url:'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=200&q=70',city:'Ouargla',phone:'+213 29 600 600',status:'approved'} },
    { id:'car-6', agency_id:AG2, brand:'Dacia',        model:'Duster',       year:2022, category:'suv',     transmission:'manual',    fuel:'diesel',   seats:5, price_per_day:150, city:'Ouargla', available:true, description:'دفع رباعي اقتصادي وموثوق.',              image_url:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=70', created_at:'2024-01-02T00:00:00Z', agencies:{id:AG2,name:'Sahara Cars',logo_url:'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=200&q=70',city:'Ouargla',phone:'+213 29 600 600',status:'approved'} },
    { id:'car-7', agency_id:AG2, brand:'Hyundai',      model:'i10',          year:2023, category:'economy', transmission:'manual',    fuel:'gasoline', seats:4, price_per_day:70,  city:'Ouargla', available:true, description:'صغيرة ومثالية للتنقل اليومي.',           image_url:'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?auto=format&fit=crop&w=900&q=70', created_at:'2024-01-02T00:00:00Z', agencies:{id:AG2,name:'Sahara Cars',logo_url:'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=200&q=70',city:'Ouargla',phone:'+213 29 600 600',status:'approved'} },
    { id:'car-8', agency_id:AG2, brand:'Tesla',        model:'Model 3',      year:2023, category:'luxury',  transmission:'automatic', fuel:'electric', seats:5, price_per_day:380, city:'Ouargla', available:true, description:'سيارة كهربائية فاخرة وصديقة للبيئة.', image_url:'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=70', created_at:'2024-01-02T00:00:00Z', agencies:{id:AG2,name:'Sahara Cars',logo_url:'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=200&q=70',city:'Ouargla',phone:'+213 29 600 600',status:'approved'} },
  ],
  reviews: [
    { id:'rev-1', agency_id:AG1, customer_id:U_CLIENT, rating:5, comment:'خدمة ممتازة وسيارة نظيفة، أنصح بها بشدة!',       created_at:'2024-01-10T00:00:00Z', profiles:{ full_name:'Ahmed Benali' } },
    { id:'rev-2', agency_id:AG2, customer_id:U_CLIENT, rating:4, comment:'تجربة جيدة جداً، السيارة كانت في حالة ممتازة.', created_at:'2024-01-15T00:00:00Z', profiles:{ full_name:'Ahmed Benali' } },
  ],
  bookings: [
    { id:'book-1', car_id:'car-1', customer_id:U_CLIENT, agency_id:AG1, start_date:'2024-02-01', end_date:'2024-02-04', total_price:360, status:'confirmed', created_at:'2024-01-20T00:00:00Z', cars:{ brand:'Volkswagen', model:'Golf 8', image_url:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=70' }, profiles:{ full_name:'Ahmed Benali', phone:'+213 555 77 88 99' }, agencies:{ name:'Alger Auto Location' } },
  ],
}

// ── Persistence helpers ────────────────────────────────────────────────────────
const LS_DB  = 'say_db'
const LS_SES = 'say_ses'
const LS_USR = 'say_usr'

function getDB() {
  try { const s = localStorage.getItem(LS_DB); return s ? JSON.parse(s) : structuredClone(SEED) }
  catch { return structuredClone(SEED) }
}
function saveDB(db) { localStorage.setItem(LS_DB, JSON.stringify(db)) }

function getStoredUsers() {
  try { const s = localStorage.getItem(LS_USR); return s ? JSON.parse(s) : [...DEMO_CREDS] }
  catch { return [...DEMO_CREDS] }
}
function saveUsers(u) { localStorage.setItem(LS_USR, JSON.stringify(u)) }

function getSession() {
  try { const s = localStorage.getItem(LS_SES); return s ? JSON.parse(s) : null }
  catch { return null }
}
function setSession(s) { s ? localStorage.setItem(LS_SES, JSON.stringify(s)) : localStorage.removeItem(LS_SES) }

// ── Auth state listeners ───────────────────────────────────────────────────────
const _listeners = new Set()
function notify(event, session) { _listeners.forEach(fn => fn(event, session)) }

// ── Query builder ──────────────────────────────────────────────────────────────
function makeQuery(table) {
  const q = { _table: table, _op: 'select', _data: null, _filters: [], _order: null, _limit: null }

  const enrich = (rows) => {
    // Re-attach relationship objects for inserted/updated rows using current DB
    const db = getDB()
    return rows.map(row => {
      if (q._table === 'cars' && row.agency_id && !row.agencies) {
        const ag = db.agencies.find(a => a.id === row.agency_id)
        if (ag) row = { ...row, agencies: { id:ag.id, name:ag.name, logo_url:ag.logo_url, city:ag.city, phone:ag.phone, status:ag.status } }
      }
      if (q._table === 'bookings' && !row.cars) {
        const car = db.cars.find(c => c.id === row.car_id)
        const prof = db.profiles.find(p => p.id === row.customer_id)
        const ag = db.agencies.find(a => a.id === row.agency_id)
        if (car)  row = { ...row, cars:     { brand:car.brand, model:car.model, image_url:car.image_url } }
        if (prof) row = { ...row, profiles:  { full_name:prof.full_name, phone:prof.phone } }
        if (ag)   row = { ...row, agencies:  { name:ag.name } }
      }
      if (q._table === 'agencies' && row.owner_id && !row.profiles) {
        const prof = db.profiles.find(p => p.id === row.owner_id)
        if (prof) row = { ...row, profiles: { full_name: prof.full_name } }
      }
      if (q._table === 'reviews' && row.customer_id && !row.profiles) {
        const prof = db.profiles.find(p => p.id === row.customer_id)
        if (prof) row = { ...row, profiles: { full_name: prof.full_name } }
      }
      return row
    })
  }

  const run = () => {
    const db = getDB()
    const table = db[q._table] || []

    if (q._op === 'select') {
      let rows = enrich([...table])
      for (const f of q._filters) rows = rows.filter(f)
      if (q._order) {
        const { col, asc } = q._order
        rows.sort((a, b) => { const av = a[col] ?? '', bv = b[col] ?? ''; return asc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1) })
      }
      if (q._limit) rows = rows.slice(0, q._limit)
      return { data: rows, error: null }
    }

    if (q._op === 'insert') {
      const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...q._data }
      db[q._table] = [...table, row]
      saveDB(db)
      return { data: enrich([row])[0], error: null }
    }

    if (q._op === 'update') {
      let updated = null
      db[q._table] = table.map(r => {
        if (!q._filters.every(f => f(r))) return r
        updated = { ...r, ...q._data }
        return updated
      })
      saveDB(db)
      return { data: updated ? enrich([updated])[0] : null, error: null }
    }

    if (q._op === 'delete') {
      db[q._table] = table.filter(r => !q._filters.every(f => f(r)))
      saveDB(db)
      return { data: null, error: null }
    }

    return { data: null, error: null }
  }

  const builder = {
    select(_cols = '*')      { return builder },
    eq(col, val)             { q._filters.push(r => r[col] === val); return builder },
    neq(col, val)            { q._filters.push(r => r[col] !== val); return builder },
    gte(col, val)            { q._filters.push(r => r[col] >= val); return builder },
    lte(col, val)            { q._filters.push(r => r[col] <= val); return builder },
    order(col, { ascending = true } = {}) { q._order = { col, asc: ascending }; return builder },
    limit(n)                 { q._limit = n; return builder },
    insert(data)             { q._op = 'insert'; q._data = data; return builder },
    update(data)             { q._op = 'update'; q._data = data; return builder },
    delete()                 { q._op = 'delete'; return builder },
    async maybeSingle()      { const r = run(); return { data: Array.isArray(r.data) ? (r.data[0] || null) : r.data, error: null } },
    async single()           { return builder.maybeSingle() },
    then(resolve)            { resolve(run()) },
  }
  return builder
}

// ── Public Supabase-compatible client ─────────────────────────────────────────
export const supabase = {
  from: (table) => makeQuery(table),

  auth: {
    async signInWithPassword({ email, password }) {
      const users = getStoredUsers()
      const u = users.find(x => x.email === email && x.password === password)
      if (!u) return { data: null, error: { message: 'Invalid login credentials' } }
      const session = { user: { id: u.id, email: u.email }, access_token: 'mock-' + u.id }
      setSession(session)
      notify('SIGNED_IN', session)
      return { data: { session, user: session.user }, error: null }
    },

    async signUp({ email, password, options = {} }) {
      const users = getStoredUsers()
      if (users.find(x => x.email === email)) return { data: null, error: { message: 'User already registered' } }
      const meta = options.data || {}
      const id = crypto.randomUUID()
      const newUser = { id, email, password, role: meta.role || 'customer', full_name: meta.full_name || '', phone: meta.phone || '' }
      users.push(newUser)
      saveUsers(users)
      const db = getDB()
      db.profiles.push({ id, email, full_name: newUser.full_name, role: newUser.role, phone: newUser.phone, created_at: new Date().toISOString() })
      saveDB(db)
      const session = { user: { id, email }, access_token: 'mock-' + id }
      setSession(session)
      notify('SIGNED_IN', session)
      return { data: { session, user: session.user }, error: null }
    },

    async signOut() {
      setSession(null)
      notify('SIGNED_OUT', null)
      return { error: null }
    },

    async getSession() { return { data: { session: getSession() }, error: null } },
    async getUser()    { const s = getSession(); return { data: { user: s?.user || null }, error: null } },

    onAuthStateChange(cb) {
      _listeners.add(cb)
      return { data: { subscription: { unsubscribe: () => _listeners.delete(cb) } } }
    },
  },
}
