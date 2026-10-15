import { Worker, Job, Employer, LocationInfo, DisputeRecord, InAppNotification, RatingRecord } from './types';

export const locations: LocationInfo[] = [
  // Mumbai (14 locations)
  { city: 'Mumbai', neighborhood: 'Andheri East', displayName: 'Andheri East, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Andheri West', displayName: 'Andheri West, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Powai', displayName: 'Powai, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Ghatkopar', displayName: 'Ghatkopar, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Kurla', displayName: 'Kurla West, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Bandra', displayName: 'Bandra West, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Borivali', displayName: 'Borivali West, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Kandivali', displayName: 'Kandivali East, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Malad', displayName: 'Malad West, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Goregaon', displayName: 'Goregaon East, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Dadar', displayName: 'Dadar Central, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Lower Parel', displayName: 'Lower Parel, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Chembur', displayName: 'Chembur East, Mumbai' },
  { city: 'Mumbai', neighborhood: 'Mulund', displayName: 'Mulund West, Mumbai' },

  // Navi Mumbai (10 locations)
  { city: 'Navi Mumbai', neighborhood: 'Vashi', displayName: 'Vashi Sector 17, Navi Mumbai' },
  { city: 'Navi Mumbai', neighborhood: 'Nerul', displayName: 'Nerul Sector 20, Navi Mumbai' },
  { city: 'Navi Mumbai', neighborhood: 'Belapur', displayName: 'CBD Belapur, Navi Mumbai' },
  { city: 'Navi Mumbai', neighborhood: 'Kharghar', displayName: 'Kharghar Sector 12, Navi Mumbai' },
  { city: 'Navi Mumbai', neighborhood: 'Airoli', displayName: 'Airoli Sector 5, Navi Mumbai' },
  { city: 'Navi Mumbai', neighborhood: 'Ghansoli', displayName: 'Ghansoli Sector 8, Navi Mumbai' },
  { city: 'Navi Mumbai', neighborhood: 'Kopar Khairane', displayName: 'Kopar Khairane Sector 14, Navi Mumbai' },
  { city: 'Navi Mumbai', neighborhood: 'Sanpada', displayName: 'Sanpada Sector 4, Navi Mumbai' },
  { city: 'Navi Mumbai', neighborhood: 'Panvel', displayName: 'New Panvel Sector 19, Navi Mumbai' },
  { city: 'Navi Mumbai', neighborhood: 'Seawoods', displayName: 'Seawoods Sector 40, Navi Mumbai' }
];

export const seedEmployers: Employer[] = [
  {
    id: 'emp-greenview',
    name: 'Meera Shah',
    company: 'Greenview Properties',
    type: 'contractor',
    area: 'Andheri East, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Andheri East',
    phone: '+91 98200 12345',
    verified: true,
    rating: 4.8,
    reviewCount: 38
  },
  {
    id: 'emp-buildwell',
    name: 'Vikram Malhotra',
    company: 'BuildWell Infrastructure',
    type: 'contractor',
    area: 'Powai, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Powai',
    phone: '+91 98200 88776',
    verified: true,
    rating: 4.7,
    reviewCount: 29
  },
  {
    id: 'emp-aarav',
    name: 'Aarav Mathur',
    company: 'Aarav Homes & Facility Care',
    type: 'business',
    area: 'Vashi, Navi Mumbai',
    city: 'Navi Mumbai',
    neighborhood: 'Vashi',
    phone: '+91 98200 54321',
    verified: true,
    rating: 4.9,
    reviewCount: 45
  },
  {
    id: 'emp-cornerstone',
    name: 'Sunita Agarwal',
    company: 'Cornerstone Retail Outlets',
    type: 'business',
    area: 'Ghatkopar, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Ghatkopar',
    phone: '+91 98200 99887',
    verified: true,
    rating: 4.6,
    reviewCount: 19
  },
  {
    id: 'emp-modern',
    name: 'Rajesh Singhania',
    company: 'Modern Living Interiors',
    type: 'business',
    area: 'Bandra, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Bandra',
    phone: '+91 98200 33445',
    verified: true,
    rating: 4.8,
    reviewCount: 22
  },
  {
    id: 'emp-palmgrove',
    name: 'Suresh Iyer (Secretary)',
    company: 'Palm Grove Co-op Housing Society',
    type: 'housing_society',
    area: 'Nerul, Navi Mumbai',
    city: 'Navi Mumbai',
    neighborhood: 'Nerul',
    phone: '+91 98200 66554',
    verified: true,
    rating: 4.9,
    reviewCount: 14
  },
  {
    id: 'emp-anita',
    name: 'Anita Desai',
    company: 'Independent Homeowner',
    type: 'homeowner',
    area: 'Andheri West, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Andheri West',
    phone: '+91 98200 44332',
    verified: true,
    rating: 5.0,
    reviewCount: 8
  },
  {
    id: 'emp-western',
    name: 'Karan Mehra',
    company: 'Western Logistics Hub',
    type: 'business',
    area: 'Kurla, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Kurla',
    phone: '+91 98200 77665',
    verified: false,
    rating: 4.5,
    reviewCount: 12
  }
];

// Helper to generate initials from name
function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Master worker list generation: 5 workers per location across 24 locations = 120 workers!
const sampleFirstNames = [
  'Ramesh', 'Sanjay', 'Manoj', 'Deepak', 'Rajesh', 'Sunita', 'Pooja', 'Anil', 'Ganesh', 'Kavita',
  'Santosh', 'Dinesh', 'Sachin', 'Pravin', 'Vijay', 'Rahul', 'Mukesh', 'Vinod', 'Suresh', 'Bablu',
  'Naresh', 'Arun', 'Pankaj', 'Ajay', 'Laxman', 'Ashok', 'Mahesh', 'Kishore', 'Nitin', 'Raju'
];

const sampleLastNames = [
  'Patil', 'Sharma', 'Kumar', 'Yadav', 'Shinde', 'Rathod', 'Jadhav', 'Chavan', 'Pawar', 'More',
  'Sawant', 'Mishra', 'Gupta', 'Verma', 'Gaikwad', 'Kamble', 'Kadam', 'Bhosale', 'Tiwari', 'Singh'
];

const tradesList = [
  { trade: 'Electrician', rate: 850, skills: ['Residential wiring', 'Switchboards', 'Inverter setup', 'MCB repair'] },
  { trade: 'Plumber', rate: 950, skills: ['Pipe fitting', 'Leak repair', 'CPVC piping', 'Bathroom fittings'] },
  { trade: 'Carpenter', rate: 1100, skills: ['Modular furniture', 'Door hinges', 'Laminate repair', 'Lock fixing'] },
  { trade: 'Painter', rate: 950, skills: ['Wall putty', 'Roller painting', 'Shutter enamel', 'Primer coating'] },
  { trade: 'Mason', rate: 900, skills: ['Brick laying', 'Plastering', 'Tile fixing', 'Concrete mixing'] },
  { trade: 'Construction worker', rate: 800, skills: ['Civil site support', 'Debris clearing', 'Scaffolding', 'Material handling'] },
  { trade: 'Welder', rate: 1150, skills: ['Arc welding', 'Grill repair', 'Angle-iron cutting', 'Gate fabrication'] },
  { trade: 'Cleaner', rate: 700, skills: ['Deep cleaning', 'Floor scrubbing', 'Sanitation', 'Water tank cleaning'] },
  { trade: 'Helper', rate: 650, skills: ['Loading/unloading', 'Site cleaning', 'Assistant to technician', 'Tool fetching'] }
];

export const trades = tradesList.map(item => item.trade);

export const seedWorker: Worker = {
  id: 'ramesh',
  name: 'Ramesh Patil',
  trade: 'Electrician',
  skills: ['Residential wiring', 'Switchboards', 'Inverter setup', 'MCB repair', 'Three-phase checking'],
  experience: '8 years',
  aboutMe: 'Electrician with 8 years of experience. I focus on safe, reliable work and arriving on time.',
  workExperience: 'Residential wiring, DB panel installations, and apartment rewiring across Andheri East and Powai. Equipped with multi-meter, insulated pliers, and test pen.',
  area: 'Andheri East, Mumbai',
  city: 'Mumbai',
  neighborhood: 'Andheri East',
  available: true,
  photo: 'RP',
  phone: '+91 98765 43210',
  dailyRate: 850,
  rating: 4.9,
  reviewCount: 42,
  completedJobs: 42,
  verified: true,
  sample: 'Residential wiring · Switchboard repair · Inverter setup',
  intro: 'Electrician with 8 years of experience. I focus on safe, reliable work and arriving on time.'
};

export const primaryWorkers: Worker[] = [
  seedWorker,
  {
    id: 'worker-suresh-sharma',
    name: 'Suresh Sharma',
    trade: 'Plumber',
    skills: ['Pipe fitting', 'Leak repair', 'CPVC piping', 'Bathroom fittings', 'Drainage unblocking'],
    experience: '7 years',
    aboutMe: 'Licensed plumber specializing in leak-proof bathroom fittings and emergency pipeline repairs. Always clean the site after pipe cuts.',
    workExperience: 'Commercial kitchen drainage, multi-story CPVC riser replacements, and GROHE/Jaguar fitting in Kurla West and Bandra.',
    area: 'Kurla West, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Kurla',
    available: true,
    photo: 'SS',
    phone: '+91 98201 11223',
    dailyRate: 950,
    rating: 4.8,
    reviewCount: 38,
    completedJobs: 38,
    verified: true,
    sample: 'Pipe fitting · Leak repair · CPVC piping · Bathroom fittings',
    intro: 'Licensed plumber with 7 years of commercial and residential experience in Kurla and Bandra.'
  },
  {
    id: 'worker-rajesh-vishwakarma',
    name: 'Rajesh Vishwakarma',
    trade: 'Carpenter',
    skills: ['Modular furniture', 'Door hinges', 'Laminate repair', 'Lock fixing', 'Teakwood molding'],
    experience: '10 years',
    aboutMe: 'Master carpenter with 10 years experience in modular kitchen assembly and fine interior woodwork.',
    workExperience: 'Showroom interior wood framing, hydraulic hinge alignment, and Godrej lock installations across Bandra West.',
    area: 'Bandra West, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Bandra',
    available: true,
    photo: 'RV',
    phone: '+91 98202 33445',
    dailyRate: 1100,
    rating: 4.9,
    reviewCount: 52,
    completedJobs: 52,
    verified: true,
    sample: 'Modular furniture · Door hinges · Laminate repair',
    intro: 'Master carpenter specializing in modular furniture and boutique showroom woodwork in Bandra.'
  },
  {
    id: 'worker-anil-chauhan',
    name: 'Anil Chauhan',
    trade: 'Painter',
    skills: ['Wall putty', 'Roller painting', 'Shutter enamel', 'Primer coating', 'Texture design'],
    experience: '6 years',
    aboutMe: 'Professional painter focused on sharp edge masking, smooth wall putty finish, and zero paint drips on floors.',
    workExperience: 'Complete interior flat repaints, Asian Paints Royale finish, and metal shutter primer work in Malad and Kandivali.',
    area: 'Malad West, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Malad',
    available: true,
    photo: 'AC',
    phone: '+91 98203 55667',
    dailyRate: 900,
    rating: 4.8,
    reviewCount: 31,
    completedJobs: 31,
    verified: true,
    sample: 'Wall putty · Roller painting · Shutter enamel',
    intro: 'Expert painter with 6 years experience in clean, drip-free residential painting in Malad.'
  },
  {
    id: 'worker-ganesh-yadav',
    name: 'Ganesh Yadav',
    trade: 'Civil Mason',
    skills: ['Brick laying', 'Plastering', 'Tile fixing', 'Concrete mixing', 'Structural boundary repairs'],
    experience: '9 years',
    aboutMe: 'Experienced mason proficient in plumb-line brick alignment, sand-face plastering, and coping stones.',
    workExperience: 'Residential compound wall construction, terrace waterproofing plaster, and granite door frame fixing in Powai.',
    area: 'Powai, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Powai',
    available: true,
    photo: 'GY',
    phone: '+91 98204 77889',
    dailyRate: 950,
    rating: 4.7,
    reviewCount: 29,
    completedJobs: 29,
    verified: true,
    sample: 'Brick laying · Plastering · Concrete mixing',
    intro: 'Civil mason with 9 years of civil construction and structural plastering experience in Powai.'
  },
  {
    id: 'worker-vikram-shinde',
    name: 'Vikram Shinde',
    trade: 'Welder',
    skills: ['Arc welding', 'Grill repair', 'Angle-iron cutting', 'Gate fabrication', 'Structural truss support'],
    experience: '8 years',
    aboutMe: 'Fabrication welder skilled in heavy arc welding, balcony grill reinforcing, and sliding gate repairs.',
    workExperience: 'Industrial warehouse sliding gates, safety grill fabrication, and iron staircase railing welding in Vashi.',
    area: 'Vashi, Navi Mumbai',
    city: 'Navi Mumbai',
    neighborhood: 'Vashi',
    available: true,
    photo: 'VS',
    phone: '+91 98205 99001',
    dailyRate: 1150,
    rating: 4.9,
    reviewCount: 44,
    completedJobs: 44,
    verified: true,
    sample: 'Arc welding · Grill repair · Gate fabrication',
    intro: 'Fabrication welder with 8 years of industrial gate and structural steel experience in Vashi.'
  },
  {
    id: 'worker-sunita-devi',
    name: 'Sunita Devi',
    trade: 'Cleaning & Sanitation',
    skills: ['Deep cleaning', 'Floor scrubbing', 'Sanitation', 'Water tank cleaning', 'Post-renovation cleaning'],
    experience: '5 years',
    aboutMe: 'Thorough sanitation professional dedicated to deep hygiene, mechanized single-disc scrubbing, and non-acid tile safety.',
    workExperience: 'Post-construction flat deep cleaning, commercial washroom sanitization, and overhead water tank scrubbing in Saki Naka.',
    area: 'Saki Naka, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Saki Naka',
    available: true,
    photo: 'SD',
    phone: '+91 98206 12344',
    dailyRate: 700,
    rating: 4.9,
    reviewCount: 65,
    completedJobs: 65,
    verified: true,
    sample: 'Deep cleaning · Floor scrubbing · Sanitation',
    intro: 'Sanitation professional with 5 years experience in deep apartment and commercial facility cleaning.'
  },
  {
    id: 'worker-manoj-kumar',
    name: 'Manoj Kumar',
    trade: 'General Construction Labourer',
    skills: ['Civil site support', 'Debris clearing', 'Scaffolding', 'Material handling', 'Cement mortar mixing'],
    experience: '4 years',
    aboutMe: 'Hardworking civil site laborer experienced with safety gear, heavy material handling, and assisting masonry teams.',
    workExperience: 'Assisted senior civil contractors on Dadar residential redevelopments, debris bag removal, and concrete batching.',
    area: 'Dadar, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Dadar',
    available: true,
    photo: 'MK',
    phone: '+91 98207 34567',
    dailyRate: 800,
    rating: 4.6,
    reviewCount: 22,
    completedJobs: 22,
    verified: true,
    sample: 'Civil site support · Debris clearing · Material handling',
    intro: 'Construction laborer with 4 years experience on civil construction sites in Dadar.'
  },
  {
    id: 'worker-deepak-gupta',
    name: 'Deepak Gupta',
    trade: 'Tile Layer',
    skills: ['Tile fixing', 'Vitrified tile laying', 'Grouting & leveling', 'Kitchen counter granite', 'Skirting alignment'],
    experience: '7 years',
    aboutMe: 'Specialist tile layer skilled in laser leveling, zero-lippage tile spacers, and epoxy joint grouting.',
    workExperience: 'Completed vitrified 4x2 flooring for 20+ flats and granite platform moulding in Nerul and Seawoods.',
    area: 'Nerul, Navi Mumbai',
    city: 'Navi Mumbai',
    neighborhood: 'Nerul',
    available: true,
    photo: 'DG',
    phone: '+91 98208 56789',
    dailyRate: 1000,
    rating: 4.9,
    reviewCount: 37,
    completedJobs: 37,
    verified: true,
    sample: 'Tile fixing · Vitrified tile laying · Grouting & leveling',
    intro: 'Tile layer and granite specialist with 7 years experience in Nerul and Seawoods.'
  }
];

function generateWorkers(): Worker[] {
  const result: Worker[] = [...primaryWorkers];
  let idCounter = 10;

  locations.forEach((loc, locIndex) => {
    // 5 workers per location
    const countForLoc = 4;
    for (let i = 0; i < countForLoc; i++) {
      const nameIndex = (locIndex * 5 + i) % sampleFirstNames.length;
      const lastIndex = (locIndex * 3 + i) % sampleLastNames.length;
      const firstName = sampleFirstNames[nameIndex];
      const lastName = sampleLastNames[lastIndex];
      const fullName = `${firstName} ${lastName}`;
      const tradeObj = tradesList[(locIndex + i) % tradesList.length];

      const expYears = 3 + ((locIndex + i) % 12);
      const isAvailable = (locIndex + i) % 4 !== 0; // ~75% available
      const id = `worker-${loc.neighborhood.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`;

      result.push({
        id,
        name: fullName,
        trade: tradeObj.trade,
        skills: [...tradeObj.skills],
        experience: `${expYears} years`,
        aboutMe: `${tradeObj.trade} with ${expYears} years of practical site experience. Punctual, honest, and dedicated to clean work.`,
        workExperience: `Experienced in ${tradeObj.skills.join(', ')} for flats, offices, and commercial sites in ${loc.neighborhood}. Owns standard trade tools.`,
        area: loc.displayName,
        city: loc.city,
        neighborhood: loc.neighborhood,
        available: isAvailable,
        photo: getInitials(fullName),
        phone: `+91 98${(10000000 + idCounter * 739).toString().slice(0, 8)}`,
        dailyRate: tradeObj.rate,
        rating: Number((4.4 + ((idCounter % 6) * 0.1)).toFixed(1)),
        reviewCount: 12 + (idCounter % 35),
        completedJobs: 15 + (idCounter % 40),
        verified: idCounter % 2 === 0,
        sample: tradeObj.skills.join(' · '),
        intro: `${tradeObj.trade} with ${expYears} years of experience in ${loc.neighborhood}.`
      });

      idCounter++;
    }
  });

  return result;
}

export const seedWorkers: Worker[] = generateWorkers();

export const seedJobs: Job[] = [
  // 1. Electrician - Daily - Andheri East (Matches Ramesh!)
  {
    id: 'job-1',
    title: 'Apartment rewiring & switchboard installation',
    trade: 'Electrician',
    compatibleTrades: ['Electrician'],
    requiredSkills: ['Residential wiring', 'Switchboards'],
    employerId: 'emp-greenview',
    employer: 'Meera Shah · Greenview Properties',
    employerPhone: '+91 98200 12345',
    verified: true,
    description: 'Assist with full wiring and switchboard fitting in a 2BHK renovation. Working alongside senior electrical supervisor. Power is isolated on site.',
    employmentType: 'daily',
    wage: 850,
    wageUnit: 'day',
    area: 'Andheri East, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Andheri East',
    siteAddress: 'Flat 402, Sai Kripa Heights, Azad Road, Andheri East, Mumbai 400069',
    distance: '1.4 km',
    hours: '9:00 AM – 5:30 PM',
    duration: '1 day',
    payment: 'Same day via UPI or Cash',
    paymentStatus: 'pending',
    tools: 'Bring insulated wire strippers and test pen; heavy wiring materials provided',
    safetyGear: 'Rubber soled shoes required',
    date: 'Today',
    status: 'open',
    interested: 4,
    createdAt: 'Today, 7:30 AM'
  },

  // 2. Plumber - Confirmed - Vashi (Assigned to Suresh Sharma!)
  {
    id: 'job-2',
    title: 'Commercial kitchen tap & drainage pipe overhaul',
    trade: 'Plumber',
    compatibleTrades: ['Plumber'],
    requiredSkills: ['Leak repair', 'CPVC piping'],
    employerId: 'emp-aarav',
    employer: 'Aarav Mathur · Aarav Homes',
    employerPhone: '+91 98200 54321',
    verified: true,
    description: 'Fix leaking basin mixers, clear high-grease kitchen trap, and install replacement CPVC bend under sink.',
    employmentType: 'daily',
    wage: 950,
    wageUnit: 'day',
    area: 'Vashi Sector 17, Navi Mumbai',
    city: 'Navi Mumbai',
    neighborhood: 'Vashi',
    siteAddress: 'Shop 12, Prime Plaza, Sector 17, Vashi',
    distance: '2.8 km',
    hours: '10:00 AM – 2:30 PM',
    duration: 'Half day',
    payment: 'Immediately at job completion (Cash/GPay)',
    paymentStatus: 'pending',
    tools: 'Basic plumbing wrench and pipe cutters',
    safetyGear: 'Standard rubber gloves provided',
    date: 'Today',
    status: 'confirmed',
    workerId: 'worker-suresh-sharma',
    interested: 2,
    createdAt: 'Today, 8:15 AM'
  },

  // 3. Painter - Confirmed Contract - Ghatkopar (Assigned to Anil Chauhan!)
  {
    id: 'job-3',
    title: 'Dual shopfront metal shutter painting & primer',
    trade: 'Painter',
    compatibleTrades: ['Painter'],
    requiredSkills: ['Shutter enamel', 'Roller painting'],
    employerId: 'emp-cornerstone',
    employer: 'Sunita Agarwal · Cornerstone Retail',
    employerPhone: '+91 98200 99887',
    verified: true,
    description: 'Wire-brush rust from 2 commercial rollup shutters, apply 1 coat red-oxide metal primer and 2 coats green enamel gloss.',
    employmentType: 'contract',
    wage: 4200,
    wageUnit: 'total',
    area: 'Ghatkopar, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Ghatkopar',
    siteAddress: 'Cornerstone Stores, Gate 3, LBS Road, Ghatkopar West',
    distance: '3.6 km',
    hours: '8:30 AM – 4:30 PM',
    duration: '2 days',
    payment: 'Daily at 5:00 PM in cash',
    paymentStatus: 'pending',
    tools: 'Rollers and paint trays provided; bring rough work clothing',
    safetyGear: 'Dust mask provided',
    date: 'Tomorrow',
    status: 'confirmed',
    workerId: 'worker-anil-chauhan',
    interested: 1,
    createdAt: 'Yesterday'
  },

  // 4. Electrician - Long-Term / Ongoing Work - Powai (Matches Ramesh!)
  {
    id: 'job-4',
    title: 'Residential Society Maintenance Electrician (Ongoing)',
    trade: 'Electrician',
    compatibleTrades: ['Electrician'],
    requiredSkills: ['Residential wiring', 'Switchboards', 'MCB repair'],
    employerId: 'emp-buildwell',
    employer: 'Vikram Malhotra · BuildWell Infrastructure',
    employerPhone: '+91 98200 88776',
    verified: true,
    description: 'Looking for a reliable maintenance electrician for a gated housing society with 4 towers. Handle common area lighting, generator check, and resident electrical calls.',
    employmentType: 'long_term',
    wage: 24000,
    wageUnit: 'month',
    area: 'Powai, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Powai',
    siteAddress: 'Hiranandani Gardens, Central Avenue, Powai',
    distance: '4.2 km',
    hours: '9:00 AM – 6:00 PM (Monday to Saturday)',
    duration: 'Ongoing / Long-Term',
    payment: 'Monthly bank transfer on 1st of every month',
    paymentStatus: 'pending',
    tools: 'All major tools and testing meters provided in society maintenance room',
    safetyGear: 'Safety gear and company uniform provided',
    date: 'This week',
    status: 'open',
    interested: 5,
    createdAt: '2 days ago'
  },

  // 5. Carpenter - Confirmed Weekly Work - Bandra (Assigned to Rajesh Vishwakarma!)
  {
    id: 'job-5',
    title: 'Boutique showroom custom woodwork & shelving',
    trade: 'Carpenter',
    compatibleTrades: ['Carpenter'],
    requiredSkills: ['Modular furniture', 'Laminate repair'],
    employerId: 'emp-modern',
    employer: 'Rajesh Singhania · Modern Living Interiors',
    employerPhone: '+91 98200 33445',
    verified: true,
    description: 'Assemble designer display shelves, fit teak wood mouldings, and align heavy glass cabinet hinges in upcoming store.',
    employmentType: 'weekly',
    wage: 7500,
    wageUnit: 'week',
    area: 'Bandra West, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Bandra',
    siteAddress: 'Bandra Linking Road, Near National College',
    distance: '6.0 km',
    hours: '10:00 AM – 6:00 PM',
    duration: '2 weeks',
    payment: 'Weekly settlement on Saturdays',
    paymentStatus: 'pending',
    tools: 'Bring personal router and hand tools; wood materials and fasteners provided',
    safetyGear: 'Eye goggles and dust masks supplied on site',
    date: 'Tomorrow',
    status: 'confirmed',
    workerId: 'worker-rajesh-vishwakarma',
    interested: 3,
    createdAt: 'Today, 9:00 AM'
  },

  // 6. Mason / Construction - Confirmed Contract - Nerul (Assigned to Ganesh Yadav!)
  {
    id: 'job-6',
    title: 'Compound Wall Reconstruction & Structural Plastering',
    trade: 'Civil Mason',
    compatibleTrades: ['General Construction Labourer', 'Civil Mason'],
    requiredSkills: ['Brick laying', 'Plastering'],
    employerId: 'emp-palmgrove',
    employer: 'Suresh Iyer · Palm Grove CHS',
    employerPhone: '+91 98200 66554',
    verified: true,
    description: 'Rebuild 80 feet of collapsed boundary wall, plaster smooth finish, and prepare coping stone bed for society perimeter.',
    employmentType: 'contract',
    wage: 14000,
    wageUnit: 'total',
    area: 'Nerul Sector 20, Navi Mumbai',
    city: 'Navi Mumbai',
    neighborhood: 'Nerul',
    siteAddress: 'Plot 44, Sector 20, Nerul West',
    distance: '8.5 km',
    hours: '8:30 AM – 5:30 PM',
    duration: '10 days',
    payment: '50% advance on milestone, balance on completion',
    paymentStatus: 'pending',
    tools: 'Trowels, spirit level, plumb line needed; sand, cement, bricks on site',
    safetyGear: 'Safety helmets and gumboots provided',
    date: 'This week',
    status: 'confirmed',
    workerId: 'worker-ganesh-yadav',
    interested: 2,
    createdAt: '3 days ago'
  },

  // 7. Electrician - Completed & Paid - Andheri East (Assigned to Ramesh Patil for rating test)
  {
    id: 'job-7-completed',
    title: 'Master Bedroom Inverter & MCB Distribution Rewiring',
    trade: 'Electrician',
    compatibleTrades: ['Electrician'],
    requiredSkills: ['Inverter setup', 'MCB repair'],
    employerId: 'emp-greenview',
    employer: 'Meera Shah · Greenview Properties',
    employerPhone: '+91 98200 12345',
    verified: true,
    description: 'Relocate battery inverter to utility balcony, connect dedicated MCB trip circuit, and test load stability across 3 rooms.',
    employmentType: 'daily',
    wage: 950,
    wageUnit: 'day',
    area: 'Andheri East, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Andheri East',
    siteAddress: 'A-201, Greenview Enclave, Chakala, Andheri East',
    distance: '1.1 km',
    hours: '9:30 AM – 4:00 PM',
    duration: '1 day',
    payment: 'Same day via UPI (GPay)',
    tools: 'Standard electrical insulated screwdriver set, multimeter, wire strippers',
    safetyGear: 'Rubber-soled safety shoes and insulated safety gloves',
    paymentStatus: 'paid', // Marked as PAID! Should NOT show Resolve Dispute
    paymentDisputed: false,
    workerId: 'ramesh',
    date: 'Yesterday',
    status: 'completed',
    interested: 3,
    createdAt: '2 days ago'
  },

  // 8. Electrician - Completed & Unpaid/Pending - Andheri East (Assigned to Ramesh Patil to test Dispute!)
  {
    id: 'job-8-dispute-eligible',
    title: 'Office Lighting Fixtures & Emergency Exit LED Installation',
    trade: 'Electrician',
    compatibleTrades: ['Electrician'],
    requiredSkills: ['Residential wiring', 'Switchboards'],
    employerId: 'emp-buildwell',
    employer: 'Vikram Malhotra · BuildWell Infrastructure',
    employerPhone: '+91 98200 88776',
    verified: true,
    description: 'Installed 18 recessed LED panels and backup exit sign battery modules. Work completed on schedule.',
    employmentType: 'daily',
    wage: 1000,
    wageUnit: 'day',
    area: 'Powai, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Powai',
    siteAddress: 'Floor 3, TechPark Tower B, Saki Vihar Road, Powai',
    distance: '3.5 km',
    hours: '9:00 AM – 5:30 PM',
    duration: '1 day',
    payment: 'Same day cash on site',
    tools: 'Step ladder provided on site; worker to bring standard wiring hand tools',
    safetyGear: 'Safety helmet and insulated shoes',
    paymentStatus: 'pending', // Unpaid! Eligible for filing dispute
    paymentDisputed: false,
    workerId: 'ramesh',
    date: '2 days ago',
    status: 'completed',
    interested: 2,
    createdAt: '3 days ago'
  },

  // 9. Welder - Confirmed Daily - Kurla (Assigned to Vikram Shinde!)
  {
    id: 'job-9',
    title: 'Warehouse perimeter fence gate welding repair',
    trade: 'Welder',
    compatibleTrades: ['Welder'],
    requiredSkills: ['Arc welding', 'Grill repair'],
    employerId: 'emp-western',
    employer: 'Karan Mehra · Western Logistics Hub',
    employerPhone: '+91 98200 77665',
    verified: false,
    description: 'Reinforce lower hinge plate and latch receiver on heavy sliding truck gate. Power supply and welding rods available.',
    employmentType: 'daily',
    wage: 1300,
    wageUnit: 'day',
    area: 'Kurla West, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Kurla',
    siteAddress: 'Shed 4, Western Cargo Complex, LBS Marg, Kurla West',
    distance: '5.1 km',
    hours: '9:00 AM – 5:00 PM',
    duration: '1 day',
    payment: 'Same day cash voucher',
    paymentStatus: 'pending',
    tools: 'Bring welding helmet and chipping hammer; arc machine on site',
    safetyGear: 'Heavy leather welding gloves provided',
    date: 'Today',
    status: 'confirmed',
    workerId: 'worker-vikram-shinde',
    interested: 1,
    createdAt: 'Today, 6:45 AM'
  },

  // 10. Cleaning & Sanitation - Confirmed Monthly - Belapur (Assigned to Sunita Devi!)
  {
    id: 'job-10',
    title: 'Office Complex Daily Housekeeping & Sanitization',
    trade: 'Cleaning & Sanitation',
    compatibleTrades: ['Cleaning & Sanitation', 'Helper'],
    requiredSkills: ['Deep cleaning', 'Floor scrubbing'],
    employerId: 'emp-aarav',
    employer: 'Aarav Mathur · Aarav Homes & Facility Care',
    employerPhone: '+91 98200 54321',
    verified: true,
    description: 'Daily morning floor scrubbing, restroom sanitization, and waste disposal for IT hub facility.',
    employmentType: 'monthly',
    wage: 18000,
    wageUnit: 'month',
    area: 'CBD Belapur, Navi Mumbai',
    city: 'Navi Mumbai',
    neighborhood: 'Belapur',
    siteAddress: 'Sector 11, CBD Belapur, Navi Mumbai',
    distance: '7.2 km',
    hours: '7:30 AM – 3:30 PM (6 days a week)',
    duration: 'Ongoing Monthly',
    payment: 'Direct bank transfer on 2nd of each month',
    paymentStatus: 'pending',
    tools: 'Industrial vacuum, mops, and cleaning chemicals provided',
    safetyGear: 'Gloves and safety masks supplied',
    date: 'This week',
    status: 'confirmed',
    workerId: 'worker-sunita-devi',
    interested: 3,
    createdAt: 'Yesterday'
  },

  // 11. Tile Layer - Open Contract - Nerul (Matches Deepak Gupta!)
  {
    id: 'job-11',
    title: 'Apartment Bathroom & Balcony Vitrified Tile Laying',
    trade: 'Tile Layer',
    compatibleTrades: ['Civil Mason', 'Tile Layer'],
    requiredSkills: ['Tile fixing', 'Vitrified tile laying', 'Grouting & leveling'],
    employerId: 'emp-greenview',
    employer: 'Meera Shah · Greenview Properties',
    employerPhone: '+91 98200 12345',
    verified: true,
    description: 'Install 2x2 vitrified anti-skid tiles in 2 bathrooms and balcony with proper slope towards drain trap. Laser level provided.',
    employmentType: 'contract',
    wage: 8500,
    wageUnit: 'total',
    area: 'Nerul Sector 20, Navi Mumbai',
    city: 'Navi Mumbai',
    neighborhood: 'Nerul',
    siteAddress: 'B-403, Sagar Heights, Sector 20, Nerul',
    distance: '3.1 km',
    hours: '9:00 AM – 6:00 PM',
    duration: '4 days',
    payment: 'Same day UPI upon inspection',
    paymentStatus: 'pending',
    tools: 'Bring tile cutter and rubber mallet; cement adhesive provided',
    safetyGear: 'Safety knee pads and gloves recommended',
    date: 'Tomorrow',
    status: 'open',
    interested: 2,
    createdAt: 'Today, 10:00 AM'
  },

  // 12. General Construction Labourer - Open Daily - Dadar (Matches Manoj Kumar!)
  {
    id: 'job-12',
    title: 'Commercial Renovation Debris Bagging & Site Stacking',
    trade: 'General Construction Labourer',
    compatibleTrades: ['General Construction Labourer', 'Helper'],
    requiredSkills: ['Civil site support', 'Debris clearing', 'Material handling'],
    employerId: 'emp-modern',
    employer: 'Rajesh Singhania · Modern Living Interiors',
    employerPhone: '+91 98200 33445',
    verified: true,
    description: 'Bagging plaster rubble, shifting cement sacks to 2nd floor lift, and keeping hallway pathways clear.',
    employmentType: 'daily',
    wage: 800,
    wageUnit: 'day',
    area: 'Dadar West, Mumbai',
    city: 'Mumbai',
    neighborhood: 'Dadar',
    siteAddress: 'Ground Floor, Kohinoor Square, Dadar West',
    distance: '2.0 km',
    hours: '9:00 AM – 5:30 PM',
    duration: '1 day',
    payment: 'Same day cash at 5:30 PM',
    paymentStatus: 'pending',
    tools: 'Shovels, rubble bags, and hand trolleys provided on site',
    safetyGear: 'Gumboots and hard hats provided',
    date: 'Today',
    status: 'open',
    interested: 4,
    createdAt: 'Today, 8:00 AM'
  }
];

export const seedDisputes: DisputeRecord[] = [];

export const seedNotifications: InAppNotification[] = [];

export const seedRatings: RatingRecord[] = [
  {
    id: 'rating-1',
    jobId: 'job-7-completed',
    jobTitle: 'Master Bedroom Inverter & MCB Distribution Rewiring',
    reviewerType: 'employer',
    reviewerId: 'emp-greenview',
    reviewerName: 'Meera Shah (Greenview Properties)',
    recipientType: 'worker',
    recipientId: 'ramesh',
    recipientName: 'Ramesh Patil',
    rating: 5,
    categories: ['Quality of work', 'Punctuality', 'Following agreed requirements', 'Would hire again'],
    comment: 'Ramesh did an outstanding job on our apartment rewiring. Neat conduit bends and cleaned up all wire clippings before leaving.',
    createdAt: 'Yesterday, 6:30 PM'
  }
];
