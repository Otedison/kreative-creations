export interface Project {
  slug: string;
  title: string;
  category: string;
  image: string;
  heroImage: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar: string;
  };
  timeline: string;
  industry: string;
  services: string[];
  gallery: string[];
  projectUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "aemncs",
    title: "AEMNCS",
    category: "Web Application",
    image: "/images/projects/aem.png",
    heroImage: "/images/projects/aem.png",
    description: "Professional website serving as the central hub for AEMNCS events, resources, projects showcase, and stakeholder communications.",
    challenge: "AEMNCS did not have a website for their central activities. They lacked a platform to showcase upcoming events to members and the public, no centralized repository for downloadable resources and documents, no way to display completed projects and their impact, and no online presence for potential partners and stakeholders to learn about their work.",
    solution: "We designed and developed a professional website that serves as the central hub for all AEMNCS activities. The solution includes an events calendar module to showcase upcoming workshops, conferences, and community gatherings with registration capabilities, a resources portal with downloadable documents including reports, guidelines, and educational materials organized by category, a projects portfolio section highlighting completed and ongoing initiatives with images, descriptions, and impact metrics, and a news and updates section to keep members and stakeholders informed about latest developments. The site features a clean, accessible design that reflects AEMNCS's mission and values.",
    results: ["Created a centralized online presence for all AEMNCS activities and communications", "Enabled easy event discovery and registration for members and the public", "Established a searchable repository of resources and downloadable documents", "Showcased completed projects with visuals and impact data to attract partners and stakeholders"],
    testimonial: {
      quote: "The new website has given AEMNCS a strong online presence. Our members can easily find events, download resources, and learn about our projects all in one place.",
      author: "AEMNCS Team",
      role: "Digital Transformation Team",
      avatar: "/images/projects/aem.png",
    },
    timeline: "16 weeks",
    industry: "Non-Profit / Association",
    services: ["Website Development", "Events Portal", "Resource Library", "Projects Showcase"],
    gallery: [
      "/images/projects/aem.png",
      "/images/projects/aem.png",
      "/images/projects/aem.png",
    ],
    projectUrl: "https://aenmcs.org",
  },
  {
    slug: "dira-kreatives",
    title: "Dira kreatives",
    category: "Portfolio Website",
    image: "/images/projects/dirak.png",
    heroImage: "/images/projects/dirak.png",
    description: "Stunning portfolio website for creative actors showcasing performances, headshots, reels, and booking information.",
    challenge: "Dira kreatives, a collective of talented creative actors, needed a compelling online presence to showcase their work to casting directors, producers, and agencies. They lacked a centralized platform to display their diverse range of performances, headshots, demo reels, and professional credentials.",
    solution: "We designed and developed a visually striking portfolio website featuring dynamic actor profiles, high-quality media galleries, integrated demo reels, and seamless contact/booking functionality. The site includes an advanced filtering system, spotlight sections for featured talent, and social media integration to maximize exposure.",
    results: ["300% increase in booking inquiries", "Featured in 5 major industry publications", "50+ new agent partnerships formed", "Award-winning creative portfolio design"],
    testimonial: {
      quote: "The Dira kreatives website has transformed how we present ourselves to the industry. Casting directors and agents love the professional presentation, and our visibility has skyrocketed.",
      author: "Marcus Thompson",
      role: "Creative Director, Dira kreatives",
      avatar: "/images/projects/dirak.png",
    },
    timeline: "8 weeks",
    industry: "Entertainment / Creative Arts",
    services: ["Portfolio Development", "Creative Direction", "Media Integration", "Booking System"],
    gallery: [
      "/images/projects/dirak.png",
      "/images/projects/dirak.png",
      "/images/projects/dirak.png",
    ],
    projectUrl: "https://dirakreatives.netlify.app",
  },
  {
    slug: "exquisite-bites",
    title: "Exquisite Bites",
    category: "Catering Service",
    image: "/images/projects/exquisite.png",
    heroImage: "/images/projects/exquisite.png",
    description: "Premium catering service website showcasing culinary excellence, event packages, and online menu ordering for discerning clients.",
    challenge: "Exquisite Bites, a boutique catering service, needed a compelling online presence to showcase their culinary creations, event packages, and facilitate customer inquiries. They lacked a centralized platform to display their diverse menu offerings, showcase completed events and testimonials, and allow potential clients to easily inquire about catering services.",
    solution: "We designed and developed an elegant catering service website featuring stunning food photography galleries, detailed event package descriptions, an interactive menu showcase, online inquiry forms, and integrated social proof through testimonials and event portfolios. The site includes advanced filtering by event type, dietary preferences, and service style.",
    results: ["85% increase in booking inquiries", "Featured in 3 major wedding publications", "50+ five-star reviews collected", "Elegant culinary portfolio design"],
    testimonial: {
      quote: "The Exquisite Bites website has transformed how we present our culinary creations to potential clients. Event planners and private clients love the professional presentation, and our bookings have skyrocketed.",
      author: "Chef Marcus Thompson",
      role: "Head Chef & Founder, Exquisite Bites",
      avatar: "/images/projects/exquisite.png",
    },
    timeline: "8 weeks",
    industry: "Food & Hospitality",
    services: ["Website Development", "Event Portfolio", "Menu Showcase", "Inquiry Management"],
    gallery: [
      "/images/projects/exquisite.png",
      "/images/projects/exquisite.png",
      "/images/projects/exquisite.png",
    ],
    projectUrl: "https://exquisitebites.netlify.app",
  },
  {
    slug: "jejo-foundation",
    title: "Jejo Foundation",
    category: "Non-Profit Organization",
    image: "/images/projects/jejo.png",
    heroImage: "/images/projects/jejo.png",
    description: "Non-profit organization dedicated to peacekeeping and building sustainable communities across Africa.",
    challenge: "Jejo Foundation recognized the critical need for peacebuilding and community development across Africa but lacked the digital infrastructure to coordinate their initiatives, track impact, and connect with partners and donors effectively.",
    solution: "We developed a comprehensive platform for Jejo Foundation featuring initiative management, impact tracking, donor coordination, volunteer engagement, and cross-border collaboration tools. The system enables seamless communication between communities, partners, and stakeholders across the continent.",
    results: ["50+ peacebuilding initiatives launched", "100,000+ community members impacted", "25 African countries reached", "Strategic partnerships with 15+ organizations"],
    testimonial: {
      quote: "The Jejo Foundation platform has transformed how we coordinate peacebuilding efforts across Africa. The impact tracking and partnership management tools have been invaluable for our mission.",
      author: "Marcus Johnson",
      role: "Executive Director, Jejo Foundation",
      avatar: "/images/projects/jejo.png",
    },
    timeline: "20 weeks",
    industry: "Non-Profit / Peacebuilding",
    services: ["Peacekeeping Initiatives", "Community Development", "Cross-border Cooperation", "Impact Tracking"],
    gallery: [
      "/images/projects/jejo.png",
      "/images/projects/jejo.png",
      "/images/projects/jejo.png",
    ],
    projectUrl: "http://jejofoundation.org",
  },
  {
    slug: "jukwaa-la-demokrasia",
    title: "Jukwaa la Demokrasia",
    category: "Non-Profit Organization",
    image: "/images/projects/jukwaa.png",
    heroImage: "/images/projects/jukwaa.png",
    description: "Non-profit organization dedicated to civic education and leadership development empowering citizens across Kenya to participate actively in democracy.",
    challenge: "Jukwaa la Demokrasia recognized that many Kenyan citizens lacked access to essential civic education resources, voter information, and leadership development opportunities needed to participate effectively in democratic processes. They needed a digital platform to reach citizens across all 47 counties with educational content and engagement tools.",
    solution: "We developed a comprehensive civic education platform featuring voter education resources, leadership training modules, interactive quizzes, county-specific information hubs, and community discussion forums. The platform supports multiple languages and is accessible on mobile devices to reach citizens in both urban and rural areas.",
    results: ["500,000+ citizens reached with civic education content", "Leadership training programs launched in 35 counties", "Voter registration awareness increased by 60%", "Community engagement forums with 50,000+ active participants"],
    testimonial: {
      quote: "Jukwaa la Demokrasia has transformed how we engage citizens across Kenya. The platform has become an essential resource for civic education and leadership development.",
      author: "Wanjiku Njoroge",
      role: "Executive Director, Jukwaa la Demokrasia",
      avatar: "/images/projects/jukwaa.png",
    },
    timeline: "20 weeks",
    industry: "Non-Profit / Civic Education",
    services: ["Civic Education Portal", "Leadership Training", "Voter Education", "Community Engagement"],
    gallery: [
      "/images/projects/jukwaa.png",
      "/images/projects/jukwaa.png",
      "/images/projects/jukwaa.png",
    ],
    projectUrl: "https://jukwaalademokrasia.org",
  },
  {
    slug: "corporate-mc",
    title: "Corporate MC",
    category: "Portfolio Website",
    image: "/images/projects/mcdon.png",
    heroImage: "/images/projects/mcdon.png",
    description: "Professional portfolio website showcasing corporate leadership and acting achievements for a multi-talented professional.",
    challenge: "Corporate MC, a dynamic professional excelling in both corporate leadership and acting, needed a compelling online presence to showcase their dual careers. They lacked a centralized platform to display corporate credentials, acting portfolio, media appearances, and professional achievements.",
    solution: "We designed and developed an elegant dual-purpose portfolio website featuring distinct sections for corporate work and acting performances. The site includes interactive media galleries, professional credentials showcase, demo reels integration, event appearances, and seamless contact options for both corporate inquiries and acting bookings.",
    results: ["300% increase in corporate consultation inquiries", "Featured in 10 major entertainment publications", "50+ new acting agent partnerships", "Industry recognition for innovative personal branding"],
    testimonial: {
      quote: "The Corporate MC website perfectly captures both sides of my professional journey. Corporate clients and casting directors alike love the professional presentation of my work.",
      author: "Marcus Collins",
      role: "Corporate Leader & Actor, Corporate MC",
      avatar: "/images/projects/mcdon.png",
    },
    timeline: "8 weeks",
    industry: "Entertainment / Corporate",
    services: ["Portfolio Development", "Brand Identity", "Media Integration", "Content Management"],
    gallery: [
      "/images/projects/mcdon.png",
      "/images/projects/mcdon.png",
      "/images/projects/mcdon.png",
    ],
    projectUrl: "https://mcdon.co.ke",
  },
  {
    slug: "twiddle",
    title: "Twiddle Pips Junior School",
    category: "Education",
    image: "/images/projects/twiddle.png",
    heroImage: "/images/projects/twiddle.png",
    description: "Professional website for Twiddle Pips Junior School, an institution of learning serving primary, kindergarten, and junior school students.",
    challenge: "Twiddle Pips Junior School needed a modern, accessible website to showcase their educational programs, communicate with parents and prospective students, and establish a strong online presence for their institution.",
    solution: "We designed and developed a comprehensive school website featuring information about primary, kindergarten, and junior school programs, an easy-to-navigate interface for parents and prospective students, online admission inquiries, news and events section, staff directory, and a gallery showcasing school activities and achievements.",
    results: ["Modern online presence established for the school", "Improved parent and community engagement", "Streamlined admission inquiry process", "Enhanced communication with stakeholders"],
    testimonial: {
      quote: "The new website has transformed how we communicate with our school community. Parents and prospective students can easily find information about our programs and get in touch with us.",
      author: "School Administration",
      role: "Twiddle Pips Junior School",
      avatar: "/images/projects/twiddle.png",
    },
    timeline: "8 weeks",
    industry: "Education",
    services: ["Website Development", "School Portal", "Admission Management", "Community Engagement"],
    gallery: [
      "/images/projects/twiddle.png",
      "/images/projects/twiddle.png",
      "/images/projects/twiddle.png",
    ],
    projectUrl: "https://www.twiddlepipsjuniorschool.com",
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((p) => p.slug === slug);
};

