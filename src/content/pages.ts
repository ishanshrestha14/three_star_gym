/*
  Fixed copy for the inner pages: titles and short intros. Everything the gym
  changes often (services, trainers, prices, FAQs…) comes from the database.
  "\n" in a title is a deliberate line break.
*/
export const pages = {
  services: {
    title: 'What we\ndo.',
    intro: 'One training floor, six ways to use it. Pick what fits your goal, or ask a coach to help you choose.',
    seoDescription: 'Strength training, personal training, cardio, group classes, functional training and nutrition coaching.',
  },
  membership: {
    title: 'Membership.',
    intro: 'Every plan includes full gym access. Longer plans cost less per month. Not sure which one fits? Try a free session first.',
    seoDescription: 'Gym membership plans and prices in Nepali rupees. Monthly, quarterly, half-year and yearly options.',
  },
  trainers: {
    title: 'The\ncoaches.',
    intro: 'Coaches who walk the floor, learn your name and check your form. Meet the people who’ll train you.',
    seoDescription: 'Meet our personal trainers and coaches: strength, fat loss, group classes and mobility.',
  },
  faq: {
    title: 'Questions,\nanswered.',
    intro: 'Everything people usually ask before they join. Can’t find yours? Message us and a coach will reply.',
    seoDescription: 'Answers about membership, prices, free trials, personal training, opening hours and facilities.',
  },
  contact: {
    title: 'Visit the\ngym.',
    intro: 'Drop in during opening hours, call, or send a message. We reply to every enquiry within one working day.',
    seoDescription: 'Address, opening hours, phone, WhatsApp and directions to the gym.',
  },
}
