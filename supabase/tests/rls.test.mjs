/*
  Security regression test for RLS and storage policies.
  Runs against the LOCAL Supabase stack only and mutates its data:
    npm run test:rls   (resets the local database first)
*/
import { createClient } from '@supabase/supabase-js'

const { API_URL: URL, PUBLISHABLE_KEY: ANON, SECRET_KEY: SECRET } = process.env
if (!URL?.startsWith('http://127.0.0.1')) {
  console.error('Refusing to run: API_URL must point at the local Supabase stack.')
  process.exit(1)
}
const opts = { auth: { persistSession: false, autoRefreshToken: false } }
const service = createClient(URL, SECRET, opts)
const anon = createClient(URL, ANON, opts)
let pass = 0, fail = 0
const check = (name, ok, extra='') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} ${ok ? '' : extra}`) }

// users: one admin, one ordinary logged-in user
async function user(email) {
  const { data: list } = await service.auth.admin.listUsers()
  let u = list.users.find(x => x.email === email)
  if (!u) u = (await service.auth.admin.createUser({ email, password: 'password123', email_confirm: true })).data.user
  const c = createClient(URL, ANON, opts); await c.auth.signInWithPassword({ email, password: 'password123' }); return [u, c]
}
const [adminUser, admin] = await user('admin@example.com')
const [, stranger] = await user('stranger@example.com')
await service.from('admins').upsert({ user_id: adminUser.id, email: adminUser.email })

// public reads
check('anon reads published services', (await anon.from('services').select('id')).data?.length === 6)
await service.from('faqs').insert({ question: 'Draft?', answer: 'Hidden', published: false })
const faqs = (await anon.from('faqs').select('question')).data
check('anon cannot see unpublished FAQ', faqs.every(f => f.question !== 'Draft?'))
check('admin sees unpublished FAQ', (await admin.from('faqs').select('question')).data.some(f => f.question === 'Draft?'))
check('anon reads site settings', (await anon.from('site_settings').select('gym_name').single()).data?.gym_name === 'Three Star Gym')

// public writes blocked
let r = await anon.from('services').update({ title: 'hacked' }).eq('slug', 'cardio').select()
check('anon cannot update services', (r.data ?? []).length === 0)
r = await stranger.from('services').update({ title: 'hacked' }).eq('slug', 'cardio').select()
check('logged-in non-admin cannot update services', (r.data ?? []).length === 0)
r = await anon.from('membership_plans').insert({ name: 'x', price_npr: 1, published: true })
check('anon cannot insert plans', !!r.error)
r = await stranger.from('site_settings').update({ gym_name: 'hacked' }).eq('id', true).select()
check('non-admin cannot update settings', (r.data ?? []).length === 0)

// enquiries
r = await anon.rpc('submit_enquiry', { p_name: 'Ram', p_phone: '+977 9811111111', p_source: 'free_trial', p_message: 'Hi' })
check('anon can submit enquiry', !r.error, JSON.stringify(r.error))
r = await anon.rpc('submit_enquiry', { p_name: 'Bot', p_phone: '9800000001', p_website: 'spam.com' })
check('honeypot returns success', !r.error)
check('honeypot enquiry not stored', (await service.from('enquiries').select('id').eq('name', 'Bot')).data.length === 0)
r = await anon.rpc('submit_enquiry', { p_name: 'Bad', p_phone: 'not-a-phone' })
check('invalid phone rejected', !!r.error)
r = await anon.rpc('submit_enquiry', { p_name: '', p_phone: '9800000002' })
check('empty name rejected', !!r.error)
for (let i = 0; i < 2; i++) await anon.rpc('submit_enquiry', { p_name: 'Ram', p_phone: '+977 9811111111' })
r = await anon.rpc('submit_enquiry', { p_name: 'Ram', p_phone: '+977 9811111111' })
check('4th enquiry from same phone rate-limited', r.error?.message === 'rate_limited', JSON.stringify(r.error))
r = await anon.from('enquiries').select('*')
check('anon cannot read enquiries', !!r.error || r.data.length === 0)
r = await anon.from('enquiries').insert({ name: 'x', phone: '9800000003' })
check('anon cannot insert enquiries directly', !!r.error)
check('non-admin cannot read enquiries', ((await stranger.from('enquiries').select('*')).data ?? []).length === 0)
const enq = (await admin.from('enquiries').select('*')).data
check('admin reads enquiries', enq?.length === 3)
r = await admin.from('enquiries').update({ status: 'contacted' }).eq('id', enq[0].id).select()
check('admin updates enquiry status', r.data?.[0]?.status === 'contacted')
r = await admin.from('enquiry_notes').insert({ enquiry_id: enq[0].id, body: 'Called, coming Sunday' }).select()
check('admin adds note (author defaults to self)', r.data?.[0]?.author_id === adminUser.id, JSON.stringify(r.error))
r = await stranger.from('enquiry_notes').insert({ enquiry_id: enq[0].id, body: 'x' })
check('non-admin cannot add note', !!r.error)
check('anon cannot read admins', ((await anon.from('admins').select('*')).data ?? []).length === 0)
check('is_admin() true for admin', (await admin.rpc('is_admin')).data === true)
check('is_admin() false for stranger', (await stranger.rpc('is_admin')).data === false)

// constraints
r = await admin.from('transformations').insert({ person_name: 'X', before_image: { src: 'a', alt: '', width: 1, height: 1, widths: [640] }, after_image: { src: 'b', alt: '', width: 1, height: 1, widths: [640] }, published: true })
check('transformation cannot publish without consent', !!r.error)
r = await admin.from('blog_posts').insert({ slug: 'future', title: 'Future', status: 'published', published_at: new Date(Date.now() + 86400000).toISOString() })
check('admin can schedule post', !r.error, JSON.stringify(r.error))
check('scheduled post hidden from public', ((await anon.from('blog_posts').select('id').eq('slug', 'future')).data ?? []).length === 0)
check('published posts visible to public', ((await anon.from('blog_posts').select('id').neq('slug', 'future')).data ?? []).length > 0)

// storage
const png = new Blob([new Uint8Array([0x52,0x49,0x46,0x46])], { type: 'image/webp' })
r = await anon.storage.from('media').upload('test/anon.webp', png)
check('anon cannot upload', !!r.error)
r = await stranger.storage.from('media').upload('test/stranger.webp', png)
check('non-admin cannot upload', !!r.error)
r = await admin.storage.from('media').upload('test/admin.webp', png, { upsert: true })
check('admin can upload', !r.error, JSON.stringify(r.error))
r = await admin.storage.from('media').upload('test/admin.webp', png, { upsert: true })
check('admin can replace (upsert)', !r.error, JSON.stringify(r.error))
const pub = await fetch(anon.storage.from('media').getPublicUrl('test/admin.webp').data.publicUrl)
check('public URL readable', pub.status === 200, pub.status)
r = await anon.storage.from('media').list('test')
check('anon cannot list bucket', (r.data ?? []).length === 0)
r = await stranger.storage.from('media').remove(['test/admin.webp'])
check('non-admin cannot delete', (await fetch(anon.storage.from('media').getPublicUrl('test/admin.webp').data.publicUrl)).status === 200)
r = await admin.storage.from('media').upload('test/evil.svg', new Blob(['<svg/>'], { type: 'image/svg+xml' }))
check('svg rejected', !!r.error)
await admin.storage.from('media').remove(['test/admin.webp'])

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
