/*
  PLACEHOLDER homepage content — edit freely.
  Photos are temporary Unsplash images in /public/placeholder; replace them with
  real gym photography. Stats, trainers, prices and FAQ answers are examples
  only and must be replaced with the gym's real details before launch.
*/
import type {
  AboutContent,
  Faq,
  HeroContent,
  Image,
  MembershipPlan,
  Service,
  Stat,
  Testimonial,
  Trainer,
  Transformation,
  TrialCtaContent,
  WhyUsContent,
} from '../types/content'

const SMALL = [640, 1280]
const FULL = [640, 1280, 2048]

function photo(name: string, alt: string, width: number, height: number, widths = SMALL): Image {
  return { src: `/placeholder/${name}`, alt, width, height, widths }
}

const landscape = (name: string, alt: string, widths?: number[]) => photo(name, alt, 1280, 853, widths)
const portrait = (name: string, alt: string) => photo(name, alt, 1280, 1920)

export const hero: HeroContent = {
  heading: 'Build your\nstrongest\nself.',
  subheading: 'Train with purpose. Build strength. Build confidence.',
  primaryCta: { label: 'Start your journey', to: '/free-trial' },
  secondaryCta: { label: 'Explore memberships', to: '/membership' },
  image: landscape('hero', 'Athlete setting up a heavy deadlift in a dark training hall', FULL),
}

// Replace with real numbers, or set to [] to hide the strip.
export const stats: Stat[] = [
  { value: '10+', label: 'Years in Baneshwor' },
  { value: '500+', label: 'Active members' },
  { value: '8', label: 'Certified coaches' },
  { value: '4.9', label: 'Google rating' },
]

export const about: AboutContent = {
  heading: 'More than\na gym.',
  body: 'A training floor built for people who show up — in their first week or their fifth year. Coaches who know your name, equipment that’s ready when you are, and a room full of people working just as hard as you.',
  images: [
    landscape('squat-bw', 'Member holding a barbell across her shoulders before a squat'),
    landscape('gym-floor', 'Rows of dumbbells along the main training floor'),
  ],
}

export const services: Service[] = [
  {
    slug: 'strength-training',
    title: 'Strength training',
    shortDescription: 'Barbells, racks and platforms for lifting heavy, safely.',
    image: landscape('deadlift', 'Loaded barbell on the lifting platform'),
  },
  {
    slug: 'personal-training',
    title: 'Personal training',
    shortDescription: 'One-to-one coaching built around your goal and schedule.',
    image: landscape('dumbbell-row', 'Coach-guided dumbbell row'),
  },
  {
    slug: 'cardio',
    title: 'Cardio',
    shortDescription: 'Treadmills, bikes and rowers for conditioning and fat loss.',
    image: landscape('gym-hall', 'Cardio area with treadmills and bikes'),
  },
  {
    slug: 'group-classes',
    title: 'Group classes',
    shortDescription: 'Coached sessions that keep you moving and accountable.',
    image: landscape('group-class', 'Members in a group mat class'),
  },
  {
    slug: 'functional-training',
    title: 'Functional training',
    shortDescription: 'Ropes, sleds and kettlebells for strength you can use.',
    image: landscape('battle-ropes', 'Member training with battle ropes'),
  },
  {
    slug: 'nutrition',
    title: 'Nutrition',
    shortDescription: 'Simple, realistic eating plans that support your training.',
    image: landscape('mobility', 'Member stretching on a mat'),
  },
]

export const whyUs: WhyUsContent = {
  heading: 'Why people\nstay.',
  items: [
    { title: 'Coaches who coach', description: 'Our trainers walk the floor, correct your form and check in on your progress.' },
    { title: 'Equipment that works', description: 'Racks, platforms and free weights kept in order, so you’re never waiting on broken kit.' },
    { title: 'A clean floor', description: 'Cleaned throughout the day. Weights go back where they belong.' },
    { title: 'Built around results', description: 'Every programme starts with your goal and gets reviewed as you progress.' },
    { title: 'People who show up', description: 'Train alongside members who’ll notice when you skip a week.' },
  ],
}

// Placeholder coaches — replace with the real team. No certifications are listed until real ones are provided.
export const trainers: Trainer[] = [
  {
    slug: 'sagar-thapa',
    name: 'Sagar Thapa',
    position: 'Head coach',
    yearsExperience: 9,
    specializations: ['Strength', 'Powerlifting'],
    photo: portrait('trainer-1', 'Portrait of coach Sagar Thapa'),
  },
  {
    slug: 'anisha-gurung',
    name: 'Anisha Gurung',
    position: 'Personal trainer',
    yearsExperience: 6,
    specializations: ['Fat loss', 'Beginners'],
    photo: portrait('trainer-2', 'Portrait of trainer Anisha Gurung'),
  },
  {
    slug: 'bikash-rai',
    name: 'Bikash Rai',
    position: 'Strength coach',
    yearsExperience: 7,
    specializations: ['Hypertrophy', 'Conditioning'],
    photo: landscape('trainer-3', 'Portrait of coach Bikash Rai'),
  },
  {
    slug: 'prerana-shrestha',
    name: 'Prerana Shrestha',
    position: 'Group class coach',
    yearsExperience: 5,
    specializations: ['Functional', 'Mobility'],
    photo: portrait('trainer-4', 'Portrait of coach Prerana Shrestha'),
  },
]

// Example prices — replace with the gym's real plans.
export const plans: MembershipPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    priceNpr: 3500,
    durationLabel: '1 month',
    features: ['Full gym access', 'Locker and showers', 'Fitness assessment'],
    isPopular: false,
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    priceNpr: 9500,
    durationLabel: '3 months',
    features: ['Full gym access', 'Locker and showers', 'Fitness assessment', 'Starter programme'],
    isPopular: false,
  },
  {
    id: 'half-year',
    name: 'Half year',
    priceNpr: 17000,
    durationLabel: '6 months',
    features: ['Full gym access', 'Locker and showers', 'Monthly progress check', 'Group classes included'],
    isPopular: true,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    priceNpr: 30000,
    durationLabel: '12 months',
    features: ['Full gym access', 'Locker and showers', 'Monthly progress check', 'Group classes included', '2 personal training sessions'],
    isPopular: false,
  },
]

export const trialCta: TrialCtaContent = {
  heading: 'Your first workout\nstarts here.',
  body: 'Come in, train a full session with a coach, and see if we’re the right fit. No commitment.',
  cta: { label: 'Book a free trial', to: '/free-trial' },
  image: landscape('deadlift-close', 'Lifter gripping a loaded barbell', FULL),
}

// Example answers — confirm every one with the gym owner.
export const faqs: Faq[] = [
  {
    id: 'beginners',
    question: 'I’ve never trained before. Is that okay?',
    answer: 'Yes. Every new member gets a walkthrough of the floor and a starter programme, and coaches are on the floor to help with form.',
  },
  {
    id: 'trial',
    question: 'Can I try the gym before joining?',
    answer: 'Yes. Book a free trial session online or on WhatsApp and train with a coach before you decide.',
  },
  {
    id: 'personal-training',
    question: 'Do you offer personal training?',
    answer: 'Yes, as single sessions or monthly packages. Ask at the front desk or send us a message for current rates.',
  },
  {
    id: 'students',
    question: 'Do you have student discounts?',
    answer: 'Students with a valid ID get a discount on quarterly and longer memberships.',
  },
  {
    id: 'parking',
    question: 'Is there parking?',
    answer: 'There is free bike parking in front of the building. Car parking is limited.',
  },
]

// Real reviews only — leave empty until the gym provides them. The section hides when empty.
export const testimonials: Testimonial[] = []

// Real member results only, with consent — the section hides when empty.
export const transformations: Transformation[] = []
