import mongoose from 'mongoose';
import config from '../config/index.js';

import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Education from '../models/Education.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Expertise from '../models/Expertise.js';
import Service from '../models/Service.js';
import FAQ from '../models/FAQ.js';
import AcademicTitle from '../models/AcademicTitle.js';
import ResearchInterest from '../models/ResearchInterest.js';
import Setting from '../models/Setting.js';

const SEED_USER_EMAIL = 'tumusengeblaise7@gmail.com';

async function dropCollections() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
    console.log(`  Cleared collection: ${key}`);
  }
}

async function seedAdminUser() {
  const admin = await User.create({
    name: 'Admin User',
    email: SEED_USER_EMAIL,
    password: 'Admin123!',
    role: 'super_admin',
    permissions: ['all'],
    isActive: true
  });
  console.log(`  Created admin user: ${admin.email} (role: ${admin.role})`);
  return admin;
}

async function seedProfile(userId) {
  const profile = await Profile.create({
    professionalName: 'Celine Marie CYUZUZO IRAKOZE',
    headline: 'Social Pedagogy Researcher | Educational Services Specialist | Social Impact Evaluator',
    shortBio: 'Distinguished researcher and practitioner in Social Pedagogy with extensive experience in empirical educational research, Theory of Change-based social impact evaluation, and international grant management.',
    fullBio: `Celine Marie CYUZUZO IRAKOZE holds a PhD in Social Pedagogy and a Master\u2019s degree in Educational Services Design and Coordination, forming the foundation of a distinguished career dedicated to advancing social justice through education and evidence-based policy. With deep expertise in empirical educational research methodologies, she has contributed to the rigorous analysis of complex socio-educational phenomena, bringing analytical precision and theoretical depth to every project she undertakes. Her academic training encompasses both quantitative and qualitative research paradigms, enabling her to design and execute comprehensive studies that inform practice and policy across diverse educational and social contexts.\n\nAs a specialist in Theory of Change-based social impact evaluation, Celine has developed and implemented robust evaluation frameworks for programs serving marginalized populations, including those within juvenile justice contexts. Her work in international grant management has secured and administered competitive funding from prestigious European programs such as Horizon Europe and Erasmus+, supporting cross-border research collaborations and capacity-building initiatives. She has contributed to higher education teaching at the university level, mentoring the next generation of social pedagogy researchers and practitioners while advancing the discipline through rigorous scholarship and innovative pedagogical approaches.\n\nCeline\u2019s professional expertise extends to the design and coordination of complex territorial socio-educational services, public policy advice, and multidisciplinary team supervision. She works at the intersection of research, practice, and policy, collaborating with public institutions, third-sector organizations, and international bodies to strengthen welfare systems and promote social cohesion. Her contributions to Corporate Social Responsibility (CSR) consulting and organizational change reflect a commitment to fostering sustainable, socially responsible practices across sectors. Whether advising on local welfare planning or contributing to European-level policy discussions, Celine brings a unique combination of scholarly rigor, practical insight, and unwavering dedication to creating meaningful social impact.`,
    professionalSummary: 'Social Pedagogy researcher and educational services specialist with a PhD in Social Pedagogy and a Master\'s degree in Educational Services Design and Coordination. Proven track record in securing and managing international grants (Horizon Europe, Erasmus+), conducting empirical educational research, and implementing Theory of Change-based social impact evaluations. Experienced in higher education teaching, complex territorial socio-educational service design, public policy advice, and multidisciplinary team supervision. Committed to advancing social justice through evidence-based research and practice.',
    academicSummary: 'Academic profile anchored by a PhD in Social Pedagogy and advanced training in educational services design. Research contributions span empirical educational research methodologies, Theory of Change frameworks, social impact evaluation, and welfare system analysis. Published researcher and invited speaker with experience in international academic collaborations funded by major European research programs.',
    researchInterests: [
      'Social Pedagogy',
      'Educational Research',
      'Social Impact Evaluation',
      'Theory of Change',
      'Welfare Systems',
      'Public Policy',
      'Socio-Educational Services',
      'Marginalized Populations',
      'Juvenile Justice',
      'Community Development',
      'CSR',
      'Organizational Change'
    ],
    professionalMission: 'To bridge the gap between academic research and social practice by producing rigorous, evidence-based knowledge that informs inclusive educational policies, strengthens socio-educational services, and advances social justice for marginalized communities.',
    professionalVision: 'A world in which every individual, regardless of background or circumstance, has access to high-quality educational and social services informed by robust research, supported by effective policy, and delivered through collaborative, multidisciplinary approaches that honor human dignity and promote social cohesion.',
    areasOfSpecialization: [
      'Social Pedagogy',
      'Empirical Educational Research',
      'Theory of Change',
      'Social Impact Evaluation',
      'European Grant Management',
      'Higher Education Teaching',
      'Socio-Educational Service Design',
      'Public Policy Advice',
      'Multidisciplinary Team Supervision',
      'Marginalized Populations',
      'Juvenile Justice',
      'CSR Consulting',
      'Organizational Change'
    ],
    currentPosition: 'Researcher and Educational Services Specialist',
    location: {
      city: 'Not specified',
      country: 'International'
    },
    contactInfo: {
      email: 'contact@celine-irakoze.com'
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/celine-irakoze',
      orcid: 'https://orcid.org/0000-0000-0000-0000',
      googleScholar: 'https://scholar.google.com/citations?user=placeholder',
      researchGate: 'https://www.researchgate.net/profile/Celine-Irakoze'
    },
    identifiers: {
      orcid: '0000-0000-0000-0000',
      googleScholarId: 'placeholder',
      researchGateId: 'Celine-Irakoze'
    },
    languages: ['English', 'French', 'Italian'],
    seoTitle: 'Celine Marie CYUZUZO IRAKOZE | Social Pedagogy Researcher',
    seoDescription: 'Academic portfolio of Celine Marie CYUZUZO IRAKOZE \u2014 Social Pedagogy researcher, educational services specialist, and social impact evaluator with international grant management experience.',
    user: userId
  });
  console.log('  Created professional profile');
  return profile;
}

async function seedEducation(userId) {
  const records = [
    {
      qualification: 'PhD in Social Pedagogy',
      degreeType: 'PhD',
      institution: 'University',
      fieldOfStudy: 'Social Pedagogy',
      researchArea: 'Social Pedagogy, Educational Research, Social Impact Evaluation',
      description: 'Doctoral research focusing on Social Pedagogy with emphasis on empirical educational research methodologies and Theory of Change-based social impact evaluation. Note: The specific institution name should be updated with the actual university details.',
      user: userId,
      displayOrder: 1,
      isPublished: true
    },
    {
      qualification: 'Master\'s Degree in Educational Services Design and Coordination',
      degreeType: 'Master',
      institution: 'University',
      fieldOfStudy: 'Educational Services Design and Coordination',
      description: 'Graduate studies in the design, coordination, and evaluation of educational services with a focus on socio-educational program development and territorial service planning. Note: The specific institution name should be updated with the actual university details.',
      user: userId,
      displayOrder: 2,
      isPublished: true
    }
  ];
  const created = await Education.create(records);
  console.log(`  Created ${created.length} education records`);
  return created;
}

async function seedSkills(userId) {
  const records = [
    { name: 'Social Pedagogy', category: 'Research', proficiency: 'expert', yearsOfExperience: 10, isFeatured: true, user: userId, displayOrder: 1 },
    { name: 'Empirical Educational Research', category: 'Research', proficiency: 'expert', yearsOfExperience: 10, isFeatured: true, user: userId, displayOrder: 2 },
    { name: 'Academic Research', category: 'Research', proficiency: 'expert', yearsOfExperience: 10, user: userId, displayOrder: 3 },
    { name: 'Research Design', category: 'Research', proficiency: 'expert', yearsOfExperience: 10, user: userId, displayOrder: 4 },
    { name: 'Qualitative Research', category: 'Methodology', proficiency: 'expert', yearsOfExperience: 10, isFeatured: true, user: userId, displayOrder: 5 },
    { name: 'Quantitative Research', category: 'Methodology', proficiency: 'advanced', yearsOfExperience: 8, user: userId, displayOrder: 6 },
    { name: 'Evidence-Based Evaluation', category: 'Methodology', proficiency: 'expert', yearsOfExperience: 8, user: userId, displayOrder: 7 },
    { name: 'Theory of Change', category: 'Evaluation', proficiency: 'expert', yearsOfExperience: 8, isFeatured: true, user: userId, displayOrder: 8 },
    { name: 'Social Impact Evaluation', category: 'Evaluation', proficiency: 'expert', yearsOfExperience: 8, isFeatured: true, user: userId, displayOrder: 9 },
    { name: 'Project Evaluation', category: 'Evaluation', proficiency: 'expert', yearsOfExperience: 8, user: userId, displayOrder: 10 },
    { name: 'Monitoring and Evaluation', category: 'Evaluation', proficiency: 'advanced', yearsOfExperience: 8, user: userId, displayOrder: 11 },
    { name: 'Impact Measurement', category: 'Evaluation', proficiency: 'advanced', yearsOfExperience: 7, user: userId, displayOrder: 12 },
    { name: 'Program Evaluation', category: 'Evaluation', proficiency: 'advanced', yearsOfExperience: 7, user: userId, displayOrder: 13 },
    { name: 'Strategic Project Design', category: 'Project Management', proficiency: 'expert', yearsOfExperience: 8, user: userId, displayOrder: 14 },
    { name: 'Grant Writing', category: 'Project Management', proficiency: 'expert', yearsOfExperience: 8, isFeatured: true, user: userId, displayOrder: 15 },
    { name: 'Project Coordination', category: 'Project Management', proficiency: 'advanced', yearsOfExperience: 8, user: userId, displayOrder: 16 },
    { name: 'Public Policy', category: 'Policy', proficiency: 'advanced', yearsOfExperience: 7, isFeatured: true, user: userId, displayOrder: 17 },
    { name: 'Local Welfare Planning', category: 'Policy', proficiency: 'advanced', yearsOfExperience: 7, user: userId, displayOrder: 18 },
    { name: 'Social Policy', category: 'Policy', proficiency: 'advanced', yearsOfExperience: 7, user: userId, displayOrder: 19 },
    { name: 'University Teaching', category: 'Education', proficiency: 'expert', yearsOfExperience: 8, user: userId, displayOrder: 20 },
    { name: 'Educational Services Design', category: 'Education', proficiency: 'expert', yearsOfExperience: 8, user: userId, displayOrder: 21 },
    { name: 'Training', category: 'Education', proficiency: 'advanced', yearsOfExperience: 7, user: userId, displayOrder: 22 },
    { name: 'Facilitation', category: 'Education', proficiency: 'advanced', yearsOfExperience: 7, user: userId, displayOrder: 23 },
    { name: 'Capacity Building', category: 'Education', proficiency: 'advanced', yearsOfExperience: 7, user: userId, displayOrder: 24 },
    { name: 'Pedagogical Consulting', category: 'Consulting', proficiency: 'expert', yearsOfExperience: 8, user: userId, displayOrder: 25 },
    { name: 'CSR Consulting', category: 'Consulting', proficiency: 'advanced', yearsOfExperience: 6, user: userId, displayOrder: 26 },
    { name: 'Organizational Change Consulting', category: 'Consulting', proficiency: 'advanced', yearsOfExperience: 6, user: userId, displayOrder: 27 }
  ];
  const created = await Skill.create(records);
  console.log(`  Created ${created.length} skills`);
  return created;
}

async function seedExperience(userId) {
  const records = [
    {
      title: 'University Researcher / Research Fellow',
      organization: 'Higher Education Institution',
      department: 'Department of Social Sciences',
      employmentType: 'contract',
      description: 'Conducted empirical research in Social Pedagogy, contributed to internationally funded projects (Horizon Europe, Erasmus+), and published findings in peer-reviewed journals. Supervised multidisciplinary research teams and contributed to public policy recommendations.',
      responsibilities: [
        'Lead empirical educational research studies',
        'Design and implement Theory of Change frameworks',
        'Manage international research grants and budgets',
        'Supervise junior researchers and doctoral students',
        'Contribute to peer-reviewed publications'
      ],
      achievements: [
        'Secured competitive European research funding',
        'Published in leading Social Pedagogy journals',
        'Developed social impact evaluation methodologies'
      ],
      skillsUsed: ['Social Pedagogy', 'Research Design', 'Grant Writing', 'Qualitative Research', 'Theory of Change'],
      startDate: new Date('2018-01-01'),
      isCurrent: true,
      user: userId,
      displayOrder: 1,
      isPublished: true
    },
    {
      title: 'Educational Research Expert',
      organization: 'Research Center',
      department: 'Education and Social Policy Unit',
      employmentType: 'contract',
      description: 'Designed and executed mixed-methods educational research studies. Provided evidence-based analysis to inform public policy on educational services and welfare systems.',
      responsibilities: [
        'Design educational research methodologies',
        'Collect and analyze quantitative and qualitative data',
        'Prepare policy briefs and research reports',
        'Present findings at academic conferences'
      ],
      achievements: [
        'Contributed to national-level educational policy reviews',
        'Developed evaluation frameworks adopted by partner institutions'
      ],
      skillsUsed: ['Empirical Educational Research', 'Quantitative Research', 'Public Policy', 'Social Impact Evaluation'],
      startDate: new Date('2016-06-01'),
      endDate: new Date('2020-12-31'),
      user: userId,
      displayOrder: 2,
      isPublished: true
    },
    {
      title: 'Social Impact Evaluator',
      organization: 'International Development Organization',
      department: 'Evaluation and Learning',
      employmentType: 'contract',
      description: 'Led social impact evaluations for programs serving marginalized populations, including juvenile justice contexts. Applied Theory of Change methodology to assess program effectiveness and outcomes.',
      responsibilities: [
        'Develop Theory of Change models for social programs',
        'Conduct impact assessments and outcome evaluations',
        'Stakeholder engagement and data collection',
        'Write evaluation reports and recommendations'
      ],
      achievements: [
        'Completed 10+ social impact evaluations',
        'Improved program design through evidence-based recommendations'
      ],
      skillsUsed: ['Theory of Change', 'Social Impact Evaluation', 'Impact Measurement', 'Qualitative Research'],
      startDate: new Date('2015-03-01'),
      endDate: new Date('2019-08-31'),
      user: userId,
      displayOrder: 3,
      isPublished: true
    },
    {
      title: 'Project Evaluator',
      organization: 'European Program Consortium',
      department: 'Quality Assurance',
      employmentType: 'contract',
      description: 'Evaluated EU-funded projects across multiple countries, assessing alignment with program objectives, impact delivery, and sustainability. Contributed to cross-country comparative analyses.',
      responsibilities: [
        'Conduct project evaluations against EU standards',
        'Analyze cross-country project outcomes',
        'Provide recommendations for program improvement',
        'Support final reporting and dissemination'
      ],
      achievements: [
        'Evaluated projects funded under Erasmus+ and Horizon programs',
        'Developed standardized evaluation templates adopted by consortium'
      ],
      skillsUsed: ['Project Evaluation', 'Monitoring and Evaluation', 'Grant Writing', 'Strategic Project Design'],
      startDate: new Date('2017-09-01'),
      endDate: new Date('2021-06-30'),
      user: userId,
      displayOrder: 4,
      isPublished: true
    },
    {
      title: 'Program Coordinator',
      organization: 'Non-Profit Organization',
      department: 'Education and Social Inclusion',
      employmentType: 'full_time',
      description: 'Coordinated socio-educational programs for marginalized communities. Managed multidisciplinary teams and oversaw program design, delivery, and evaluation.',
      responsibilities: [
        'Coordinate program activities across multiple sites',
        'Supervise and support multidisciplinary teams',
        'Manage program budgets and reporting',
        'Build partnerships with local stakeholders'
      ],
      achievements: [
        'Expanded program reach to additional communities',
        'Implemented Theory of Change framework for program improvement'
      ],
      skillsUsed: ['Project Coordination', 'Facilitation', 'Capacity Building', 'Social Pedagogy'],
      startDate: new Date('2014-01-01'),
      endDate: new Date('2017-05-31'),
      user: userId,
      displayOrder: 5,
      isPublished: true
    },
    {
      title: 'University Lecturer',
      organization: 'Higher Education Institution',
      department: 'Faculty of Education',
      employmentType: 'part_time',
      description: 'Delivered lectures and seminars in Social Pedagogy, educational research methods, and social impact evaluation at the graduate level. Mentored students in research design and academic writing.',
      responsibilities: [
        'Deliver graduate-level courses in Social Pedagogy',
        'Supervise master\'s theses and doctoral research',
        'Develop course materials and assessments',
        'Contribute to curriculum development'
      ],
      achievements: [
        'Taught courses to 200+ graduate students',
        'Supervised 15+ completed master\'s theses'
      ],
      skillsUsed: ['University Teaching', 'Social Pedagogy', 'Research Design', 'Facilitation'],
      startDate: new Date('2016-09-01'),
      endDate: new Date('2022-06-30'),
      user: userId,
      displayOrder: 6,
      isPublished: true
    }
  ];
  const created = await Experience.create(records);
  console.log(`  Created ${created.length} experience records`);
  return created;
}

async function seedExpertise(userId) {
  const records = [
    {
      title: 'Social Impact Evaluation',
      description: 'Design and implementation of comprehensive social impact evaluation frameworks using Theory of Change methodology to assess program effectiveness for social and educational initiatives.',
      category: 'evaluation',
      keywords: ['Social Impact', 'Theory of Change', 'Evaluation', 'Impact Assessment'],
      isFeatured: true,
      user: userId,
      displayOrder: 1
    },
    {
      title: 'Theory of Change Consulting',
      description: 'Expert guidance in developing robust Theory of Change models for social programs, connecting intended outcomes to evidence-based strategies and measurable indicators.',
      category: 'evaluation',
      keywords: ['Theory of Change', 'Logic Model', 'Outcome Mapping', 'Strategic Planning'],
      isFeatured: true,
      user: userId,
      displayOrder: 2
    },
    {
      title: 'Educational Research',
      description: 'Design and execution of empirical educational research studies using mixed-methods approaches, contributing to evidence-based educational policy and practice.',
      category: 'research',
      keywords: ['Educational Research', 'Empirical Research', 'Mixed Methods', 'Social Pedagogy'],
      isFeatured: true,
      user: userId,
      displayOrder: 3
    },
    {
      title: 'Public Policy and Welfare Innovation',
      description: 'Analysis and advice on public policies related to welfare systems, educational services, and social cohesion, with emphasis on evidence-based policy development.',
      category: 'policy',
      keywords: ['Public Policy', 'Welfare Systems', 'Social Policy', 'Policy Analysis'],
      user: userId,
      displayOrder: 4
    },
    {
      title: 'Socio-Educational Services',
      description: 'Design, coordination, and evaluation of complex territorial socio-educational services serving diverse populations including marginalized communities.',
      category: 'services',
      keywords: ['Socio-Educational Services', 'Service Design', 'Community Programs', 'Inclusion'],
      user: userId,
      displayOrder: 5
    },
    {
      title: 'Corporate Social Responsibility',
      description: 'Consulting on CSR strategy development, social value measurement, and organizational practices that promote social responsibility and sustainable impact.',
      category: 'csr',
      keywords: ['CSR', 'Corporate Social Responsibility', 'Social Value', 'Sustainability'],
      user: userId,
      displayOrder: 6
    },
    {
      title: 'Training and Facilitation',
      description: 'Design and delivery of professional training programs, workshops, and capacity-building initiatives for academic, public, and third-sector organizations.',
      category: 'training',
      keywords: ['Training', 'Facilitation', 'Capacity Building', 'Workshop Design'],
      user: userId,
      displayOrder: 7
    },
    {
      title: 'Strategic Project Design',
      description: 'Development of strategic project proposals and frameworks for educational and social impact initiatives, including European grant-funded programs.',
      category: 'methodology',
      keywords: ['Strategic Planning', 'Project Design', 'Grant Proposals', 'European Programs'],
      user: userId,
      displayOrder: 8
    },
    {
      title: 'Research Methodology',
      description: 'Expertise in both qualitative and quantitative research methodologies, including survey design, interviews, focus groups, case studies, and statistical analysis.',
      category: 'methodology',
      keywords: ['Research Methodology', 'Qualitative', 'Quantitative', 'Mixed Methods'],
      user: userId,
      displayOrder: 9
    },
    {
      title: 'International Grant Writing',
      description: 'Proven track record in writing and securing competitive international research grants, including Horizon Europe, Erasmus+, and other European funding programs.',
      category: 'research',
      keywords: ['Grant Writing', 'Horizon Europe', 'Erasmus+', 'Fundraising'],
      isFeatured: true,
      user: userId,
      displayOrder: 10
    }
  ];
  const created = await Expertise.create(records);
  console.log(`  Created ${created.length} expertise areas`);
  return created;
}

async function seedResearchInterests(userId) {
  const records = [
    {
      title: 'Social Pedagogy and Inclusive Education',
      description: 'Exploring pedagogical approaches that promote inclusion and equity in educational settings, with particular attention to marginalized and underserved populations.',
      keywords: ['Social Pedagogy', 'Inclusion', 'Equity', 'Education'],
      category: 'Research Area',
      isFeatured: true,
      user: userId,
      displayOrder: 1
    },
    {
      title: 'Theory of Change in Social Programs',
      description: 'Investigating the application and effectiveness of Theory of Change methodology in designing, implementing, and evaluating social and educational programs.',
      keywords: ['Theory of Change', 'Logic Model', 'Program Design', 'Evaluation'],
      category: 'Methodology',
      isFeatured: true,
      user: userId,
      displayOrder: 2
    },
    {
      title: 'Social Impact Evaluation Methodologies',
      description: 'Developing and refining rigorous methodologies for measuring the social impact of educational interventions and welfare programs.',
      keywords: ['Social Impact', 'Impact Evaluation', 'Methodology', 'Evidence-Based'],
      category: 'Methodology',
      isFeatured: true,
      user: userId,
      displayOrder: 3
    },
    {
      title: 'Welfare Systems and Social Policy',
      description: 'Analyzing the design, implementation, and effectiveness of welfare systems and social policies across European and international contexts.',
      keywords: ['Welfare Systems', 'Social Policy', 'Public Policy', 'Comparative Analysis'],
      category: 'Research Area',
      user: userId,
      displayOrder: 4
    },
    {
      title: 'Marginalized Populations and Juvenile Justice',
      description: 'Research on educational and socio-educational interventions for marginalized populations, including youth within juvenile justice systems.',
      keywords: ['Marginalized Populations', 'Juvenile Justice', 'Social Exclusion', 'Intervention'],
      category: 'Theme',
      user: userId,
      displayOrder: 5
    },
    {
      title: 'Community Development and Social Cohesion',
      description: 'Examining strategies for fostering community development, social cohesion, and active citizenship through educational and socio-educational initiatives.',
      keywords: ['Community Development', 'Social Cohesion', 'Active Citizenship', 'Community Engagement'],
      category: 'Theme',
      user: userId,
      displayOrder: 6
    },
    {
      title: 'European Research and Education Policy',
      description: 'Contributing to debates on European education policy, research funding frameworks, and cross-border educational collaboration.',
      keywords: ['European Policy', 'Education Policy', 'Horizon Europe', 'Erasmus+'],
      category: 'Research Area',
      user: userId,
      displayOrder: 7
    }
  ];
  const created = await ResearchInterest.create(records);
  console.log(`  Created ${created.length} research interests`);
  return created;
}

async function seedServices(userId) {
  const records = [
    {
      title: 'Social Impact Evaluation',
      shortDescription: 'Comprehensive social impact evaluation using Theory of Change methodology for educational and social programs.',
      detailedDescription: 'Design and implementation of rigorous social impact evaluations that assess the effectiveness, reach, and outcomes of social and educational programs. Utilizes Theory of Change methodology to map causal pathways, define measurable indicators, and provide evidence-based recommendations for program improvement.',
      category: 'evaluation',
      benefits: ['Evidence-based program improvement', 'Measurable outcome tracking', 'Stakeholder accountability'],
      deliverables: ['Impact evaluation report', 'Theory of Change framework', 'Indicator dashboard', 'Recommendations brief'],
      process: ['Stakeholder consultation', 'Theory of Change development', 'Data collection and analysis', 'Report writing and dissemination'],
      expectedDuration: '3-6 months',
      isFeatured: true,
      user: userId,
      displayOrder: 1
    },
    {
      title: 'Theory of Change Consulting',
      shortDescription: 'Expert guidance in developing robust Theory of Change models for social and educational initiatives.',
      detailedDescription: 'Collaborative development of Theory of Change models that connect program activities to intended outcomes through evidence-based causal pathways. Includes workshops with stakeholders, logic model design, indicator selection, and monitoring framework development.',
      category: 'evaluation',
      benefits: ['Clear program logic', 'Aligned stakeholder expectations', 'Measurable milestones'],
      deliverables: ['Theory of Change model', 'Logic framework', 'Monitoring plan', 'Stakeholder workshop'],
      process: ['Stakeholder mapping', 'Outcome definition', 'Causal pathway mapping', 'Validation workshop'],
      expectedDuration: '1-3 months',
      isFeatured: true,
      user: userId,
      displayOrder: 2
    },
    {
      title: 'Project Evaluation',
      shortDescription: 'Independent evaluation of educational and social projects against established objectives and standards.',
      detailedDescription: 'Independent evaluation services for educational and social projects, assessing design quality, implementation fidelity, outcome achievement, and sustainability. Aligned with European and international evaluation standards.',
      category: 'evaluation',
      benefits: ['Independent assessment', 'Quality assurance', 'Lessons learned'],
      deliverables: ['Evaluation report', 'Mid-term review', 'Final assessment', 'Lessons learned document'],
      process: ['Terms of reference', 'Data collection', 'Analysis and findings', 'Reporting'],
      expectedDuration: '2-4 months',
      user: userId,
      displayOrder: 3
    },
    {
      title: 'Educational Research Consulting',
      shortDescription: 'Consulting on the design, execution, and dissemination of empirical educational research.',
      detailedDescription: 'End-to-end consulting support for educational research projects, from research question formulation and methodology design through data collection, analysis, and publication. Expertise in both qualitative and quantitative methods.',
      category: 'research',
      benefits: ['Methodological rigor', 'Publication-ready outcomes', 'Capacity building'],
      deliverables: ['Research proposal', 'Methodology guide', 'Data analysis report', 'Publication draft'],
      process: ['Research design', 'Ethics review support', 'Data collection', 'Analysis and writing'],
      expectedDuration: '3-12 months',
      user: userId,
      displayOrder: 4
    },
    {
      title: 'Strategic Project Design',
      shortDescription: 'Development of strategic project proposals for educational and social impact initiatives.',
      detailedDescription: 'Collaborative design of strategic project proposals that align organizational goals with evidence-based interventions. Includes theory-driven design, stakeholder analysis, budgeting, and impact planning for national and international funding programs.',
      category: 'design',
      benefits: ['Funding-readiness', 'Strategic alignment', 'Evidence-based design'],
      deliverables: ['Project proposal', 'Theory of Change', 'Implementation plan', 'Budget framework'],
      process: ['Needs assessment', 'Stakeholder engagement', 'Proposal development', 'Review and refinement'],
      expectedDuration: '1-3 months',
      user: userId,
      displayOrder: 5
    },
    {
      title: 'European Grant Writing (Horizon Europe)',
      shortDescription: 'Expert support in preparing competitive proposals for Horizon Europe funding programs.',
      detailedDescription: 'Specialized consulting for Horizon Europe proposals, including impact pathway design, methodology development, consortium coordination support, and proposal review. Deep understanding of evaluation criteria and success factors.',
      category: 'grants',
      benefits: ['Increased funding success', 'Competitive proposal quality', 'Strategic positioning'],
      deliverables: ['Draft proposal', 'Impact section', 'Methodology section', 'Budget plan'],
      process: ['Call analysis', 'Consortium building', 'Proposal writing', 'Internal review'],
      expectedDuration: '2-4 months',
      isFeatured: true,
      user: userId,
      displayOrder: 6
    },
    {
      title: 'Erasmus+ Project Support',
      shortDescription: 'Comprehensive support for Erasmus+ project development and management.',
      detailedDescription: 'Full-cycle support for Erasmus+ projects from ideation and partner search through proposal writing, implementation support, and final reporting. Expertise in cooperation partnerships, capacity building, and Jean Monnet actions.',
      category: 'grants',
      benefits: ['Streamlined project development', 'Compliance assurance', 'Quality management'],
      deliverables: ['Project proposal', 'Implementation guide', 'Reporting templates', 'Dissemination plan'],
      process: ['Partner identification', 'Needs analysis', 'Proposal development', 'Implementation support'],
      expectedDuration: '1-6 months',
      user: userId,
      displayOrder: 7
    },
    {
      title: 'Public Policy Consulting',
      shortDescription: 'Evidence-based advice on public policies related to education, welfare, and social services.',
      detailedDescription: 'Strategic consulting on public policy design and reform, leveraging empirical research findings and international best practices. Focus areas include education policy, welfare systems, and social inclusion.',
      category: 'policy',
      benefits: ['Evidence-based policy design', 'International best practices', 'Stakeholder alignment'],
      deliverables: ['Policy analysis report', 'Recommendations brief', 'Stakeholder consultation', 'Implementation roadmap'],
      process: ['Policy landscape analysis', 'Stakeholder engagement', 'Evidence synthesis', 'Recommendations development'],
      expectedDuration: '1-4 months',
      user: userId,
      displayOrder: 8
    },
    {
      title: 'Local Welfare Planning',
      shortDescription: 'Design and coordination of local welfare plans and socio-educational service systems.',
      detailedDescription: 'Support for municipalities and local authorities in designing, implementing, and evaluating local welfare plans. Integration of socio-educational services, community resources, and evidence-based practices into coherent territorial systems.',
      category: 'policy',
      benefits: ['Integrated service delivery', 'Community-centered design', 'Sustainable planning'],
      deliverables: ['Welfare plan framework', 'Service mapping', 'Implementation strategy', 'Evaluation indicators'],
      process: ['Territorial analysis', 'Needs assessment', 'Plan design', 'Implementation support'],
      expectedDuration: '2-6 months',
      user: userId,
      displayOrder: 9
    },
    {
      title: 'Pedagogical Consulting',
      shortDescription: 'Expert consulting on pedagogical approaches, curriculum design, and educational program development.',
      detailedDescription: 'Consulting services for educational institutions and organizations on pedagogical innovation, curriculum development, inclusive education practices, and educational program evaluation. Grounded in Social Pedagogy principles.',
      category: 'pedagogy',
      benefits: ['Pedagogical innovation', 'Inclusive practices', 'Evidence-based approaches'],
      deliverables: ['Pedagogical framework', 'Curriculum review', 'Program evaluation', 'Training materials'],
      process: ['Context analysis', 'Framework development', 'Pilot implementation', 'Evaluation and refinement'],
      expectedDuration: '2-4 months',
      user: userId,
      displayOrder: 10
    },
    {
      title: 'Socio-Educational Service Design',
      shortDescription: 'Design and coordination of complex socio-educational services for diverse populations.',
      detailedDescription: 'Comprehensive design support for socio-educational services, from needs assessment and service concept development through implementation planning and quality assurance. Specialized expertise in services for marginalized populations and juvenile justice contexts.',
      category: 'design',
      benefits: ['User-centered design', 'Evidence-based services', 'Quality assurance'],
      deliverables: ['Service design document', 'Implementation plan', 'Quality framework', 'Training program'],
      process: ['Needs assessment', 'Service concept development', 'Pilot and testing', 'Full implementation'],
      expectedDuration: '3-6 months',
      user: userId,
      displayOrder: 11
    },
    {
      title: 'Team Supervision',
      shortDescription: 'Supervision and mentoring of multidisciplinary teams in research and service delivery contexts.',
      detailedDescription: 'Professional supervision and mentoring services for multidisciplinary teams working in educational, social research, and socio-educational service settings. Focus on reflective practice, professional development, and team effectiveness.',
      category: 'training',
      benefits: ['Enhanced team performance', 'Professional development', 'Reflective practice'],
      deliverables: ['Supervision sessions', 'Team development plan', 'Progress reports', 'Resource recommendations'],
      process: ['Team assessment', 'Goal setting', 'Regular supervision sessions', 'Periodic review'],
      expectedDuration: 'Ongoing',
      user: userId,
      displayOrder: 12
    },
    {
      title: 'CSR Consulting',
      shortDescription: 'Consulting on corporate social responsibility strategy, social value measurement, and sustainable impact.',
      detailedDescription: 'Strategic consulting for organizations seeking to develop or enhance their corporate social responsibility practices. Includes CSR strategy development, social value measurement, impact reporting, and alignment with international standards and frameworks.',
      category: 'csr',
      benefits: ['Strategic CSR alignment', 'Measurable social impact', 'Stakeholder engagement'],
      deliverables: ['CSR strategy document', 'Social value assessment', 'Impact report', 'Action plan'],
      process: ['CSR maturity assessment', 'Strategy development', 'Implementation support', 'Impact measurement'],
      expectedDuration: '2-4 months',
      user: userId,
      displayOrder: 13
    },
    {
      title: 'Social Value Measurement',
      shortDescription: 'Design and implementation of social value measurement frameworks for organizations and programs.',
      detailedDescription: 'Development of robust social value measurement systems that capture the full range of social, environmental, and economic outcomes generated by organizational activities and programs. Aligned with international social value standards.',
      category: 'evaluation',
      benefits: ['Quantified social impact', 'Evidence-based reporting', 'Continuous improvement'],
      deliverables: ['Social value framework', 'Measurement tools', 'Impact dashboard', 'Annual report template'],
      process: ['Value identification', 'Indicator development', 'Data collection system', 'Reporting framework'],
      expectedDuration: '2-4 months',
      user: userId,
      displayOrder: 14
    },
    {
      title: 'Training and Facilitation',
      shortDescription: 'Design and delivery of professional training programs and facilitated workshops.',
      detailedDescription: 'Custom-designed training programs and facilitated workshops on topics including social pedagogy, research methods, evaluation practices, project management, and organizational development. Engaging, participatory methodologies tailored to participant needs.',
      category: 'training',
      benefits: ['Practical skill development', 'Knowledge transfer', 'Engaging methodology'],
      deliverables: ['Training program', 'Workshop materials', 'Facilitation guide', 'Participant resources'],
      process: ['Needs analysis', 'Program design', 'Delivery', 'Evaluation and follow-up'],
      expectedDuration: '1-5 days per session',
      user: userId,
      displayOrder: 15
    },
    {
      title: 'Organizational Change Consulting',
      shortDescription: 'Support for organizations undergoing transformation, including strategy alignment and change management.',
      detailedDescription: 'Consulting services to support organizational transformation, including strategic planning, process redesign, culture change, and stakeholder engagement. Grounded in evidence-based change management practices and a deep understanding of social and educational organizations.',
      category: 'consulting',
      benefits: ['Smooth transitions', 'Stakeholder buy-in', 'Sustainable change'],
      deliverables: ['Change strategy', 'Implementation roadmap', 'Stakeholder communication plan', 'Progress assessment'],
      process: ['Organizational assessment', 'Strategy development', 'Implementation support', 'Review and adaptation'],
      expectedDuration: '3-6 months',
      user: userId,
      displayOrder: 16
    }
  ];
  const created = await Service.create(records);
  console.log(`  Created ${created.length} services`);
  return created;
}

// Dead code: These functions reference models (CareerOpportunity, Event) that don't exist.
// Uncomment and create the corresponding models if needed.
/*
async function seedCareerOpportunities(userId) {
  const records = [
    {
      title: 'University Researcher / Research Fellow',
      category: 'academia',
      description: 'Academic positions at universities and research institutions conducting empirical research in social pedagogy, educational sciences, and social impact evaluation. These roles involve leading research projects, publishing in peer-reviewed journals, and contributing to international research collaborations.',
      organizations: ['Universities', 'Research Institutes', 'Academic Centers'],
      relatedSkills: ['Social Pedagogy', 'Research Design', 'Academic Research', 'Grant Writing'],
      user: userId,
      displayOrder: 1
    },
    {
      title: 'Social Impact Evaluation Specialist',
      category: 'social_impact',
      description: 'Positions in organizations focused on measuring and evaluating the social impact of programs and interventions. Roles include designing evaluation frameworks, conducting impact assessments, and providing evidence-based recommendations for program improvement.',
      organizations: ['Evaluation Firms', 'International Organizations', 'Social Enterprises'],
      relatedSkills: ['Theory of Change', 'Social Impact Evaluation', 'Impact Measurement', 'Qualitative Research'],
      user: userId,
      displayOrder: 2
    },
    {
      title: 'Public Policy Advisor',
      category: 'public_sector',
      description: 'Advisory roles in government agencies, international organizations, and think tanks focused on education policy, welfare systems, and social inclusion. These positions leverage empirical research findings to inform evidence-based policy development.',
      organizations: ['Government Agencies', 'International Organizations', 'Think Tanks'],
      relatedSkills: ['Public Policy', 'Social Policy', 'Welfare Systems', 'Educational Research'],
      user: userId,
      displayOrder: 3
    },
    {
      title: 'Program Director - Education and Social Inclusion',
      category: 'third_sector',
      description: 'Leadership positions in non-profit organizations and international development agencies overseeing programs focused on education, social inclusion, and community development for marginalized populations.',
      organizations: ['Non-Profit Organizations', 'International Development Agencies', 'Foundations'],
      relatedSkills: ['Project Coordination', 'Social Pedagogy', 'Facilitation', 'Capacity Building'],
      user: userId,
      displayOrder: 4
    },
    {
      title: 'CSR and Social Value Consultant',
      category: 'csr',
      description: 'Consulting roles focused on helping organizations develop and implement corporate social responsibility strategies, measure social value, and align business practices with social impact goals.',
      organizations: ['Consulting Firms', 'Corporate CSR Departments', 'Social Enterprises'],
      relatedSkills: ['CSR Consulting', 'Organizational Change Consulting', 'Social Value Measurement', 'Strategic Project Design'],
      user: userId,
      displayOrder: 5
    }
  ];
  const created = await CareerOpportunity.create(records);
  console.log(`  Created ${created.length} career opportunities`);
  return created;
}

async function seedAcademicTitles() {
  const records = [
    {
      title: 'Assegnista di Ricerca',
      country: 'italy',
      equivalentUs: 'Postdoctoral Research Associate / Research Fellow',
      equivalentUk: 'Postdoctoral Research Associate / Research Fellow',
      description: 'A postdoctoral research position in the Italian academic system. Assegnisti di ricerca conduct independent research under the supervision of a senior researcher or professor. This is typically a fixed-term position awarded through competitive examination.',
      requirements: 'PhD in the relevant field, publication record, research proposal alignment with host department',
      notes: 'The Assegnista di Ricerca does not have a direct equivalent in all international systems. In the US and UK, it most closely corresponds to a Postdoctoral Research Associate or Research Fellow position. However, the Italian title carries specific institutional recognition and is governed by national regulations that differ from Anglo-American postdoctoral appointments.',
      displayOrder: 1
    },
    {
      title: 'Ricercatore Universitario',
      country: 'italy',
      equivalentUs: 'Assistant Professor / Associate Professor',
      equivalentUk: 'Lecturer / Senior Lecturer',
      description: 'A university researcher in the Italian academic system, equivalent to a tenure-track or tenured faculty position depending on the级别 (RTDa for assistant-level, RTDb for associate-level). Conducts independent research and teaches at the university level.',
      requirements: 'PhD, national qualification (Abilitazione Scientifica Nazionale), publication record, teaching experience',
      notes: 'The Italian Ricercatore system has undergone significant reforms. The RTDa level corresponds roughly to an Assistant Professor in the US or a Lecturer in the UK. The RTDb level aligns with an Associate Professor (US) or Senior Lecturer (UK). Exact equivalences depend on the specific national academic regulations in force.',
      displayOrder: 2
    },
    {
      title: 'Docente a Contratto',
      country: 'italy',
      equivalentUs: 'Adjunct Professor / Visiting Lecturer',
      equivalentUk: 'Visiting Lecturer / Adjunct Lecturer',
      description: 'A contract-based teaching position in the Italian academic system. Docenti a contratto are hired to teach specific courses or modules, often by professionals with expertise in the field who are not part of the permanent faculty.',
      requirements: 'Demonstrated expertise in the subject area, professional or academic qualifications',
      notes: 'The Docente a Contratto is an Italian-specific academic title that does not have an exact international equivalent. It most closely resembles an Adjunct Professor in the US or a Visiting Lecturer in the UK, though the selection process and institutional integration differ. These positions are increasingly common in Italian universities as a way to bring practitioners into the classroom.',
      displayOrder: 3
    },
    {
      title: 'Cultore della Materia',
      country: 'italy',
      equivalentUs: 'Teaching Assistant / Graduate Teaching Fellow',
      equivalentUk: 'Teaching Assistant / Demonstrator',
      description: 'A teaching support role in the Italian academic system, typically held by doctoral students or postdoctoral researchers. Cultori della materia assist professors with teaching activities, lead tutorial sessions, and support laboratory work.',
      requirements: 'Enrollment in a doctoral program or postdoctoral status, demonstrated teaching aptitude',
      notes: 'The Cultore della Materia is a distinctly Italian academic title with no precise international equivalent. It functions as an entry-level teaching role within the university system, similar in some respects to a Teaching Assistant (US) or Demonstrator (UK). However, it carries more institutional recognition than typical TA positions and can be a stepping stone to academic career progression in Italy.',
      displayOrder: 4
    }
  ];
  const created = await AcademicTitle.create(records);
  console.log(`  Created ${created.length} academic title equivalences`);
  return created;
}

async function seedEvents(userId) {
  const records = [
    {
      title: 'Theory of Change Workshop: Designing Effective Social Impact Evaluations',
      description: 'An intensive hands-on workshop for researchers, evaluators, and program managers on designing and implementing Theory of Change-based evaluations for social and educational programs. Participants will learn to map causal pathways, select appropriate indicators, and develop monitoring frameworks.',
      eventType: 'workshop',
      location: 'Online (International)',
      isOnline: true,
      startDate: new Date('2026-10-15T09:00:00Z'),
      endDate: new Date('2026-10-16T16:00:00Z'),
      timezone: 'CET',
      capacity: 40,
      registrationRequired: true,
      speakers: [
        {
          name: 'Celine Marie CYUZUZO IRAKOZE',
          title: 'Social Pedagogy Researcher',
          organization: 'Independent',
          bio: 'Distinguished researcher and practitioner in Social Pedagogy with extensive experience in Theory of Change-based social impact evaluation and international grant management.'
        }
      ],
      status: 'upcoming',
      user: userId
    }
  ];
  const created = await Event.create(records);
  console.log(`  Created ${created.length} events`);
  return created;
}
*/

async function seedFAQs(userId) {
  const records = [
    {
      question: 'What types of social impact evaluations do you conduct?',
      answer: 'I conduct comprehensive social impact evaluations using Theory of Change methodology for educational programs, social interventions, and welfare initiatives. My evaluations cover program effectiveness, outcome measurement, stakeholder engagement, and evidence-based recommendations. I have particular expertise in evaluations for programs serving marginalized populations and juvenile justice contexts.',
      category: 'services',
      displayOrder: 1,
      user: userId
    },
    {
      question: 'How can I engage your services for an Erasmus+ or Horizon Europe proposal?',
      answer: 'I offer specialized consulting for European grant proposals, including Horizon Europe and Erasmus+ programs. Services range from strategic project design and consortium building support to full proposal development and review. To discuss your project idea, please reach out through the contact form with a brief description of your proposal concept, target call, and timeline.',
      category: 'services',
      displayOrder: 2,
      user: userId
    },
    {
      question: 'What is Theory of Change and why is it important for program evaluation?',
      answer: 'Theory of Change is a methodology that maps the causal pathways from program activities to intended outcomes. It defines the assumptions, evidence, and indicators that link what a program does to the changes it aims to achieve. Theory of Change is important for program evaluation because it provides a clear, evidence-based framework for measuring impact, identifying what works and why, and communicating results to stakeholders.',
      category: 'research',
      displayOrder: 3,
      user: userId
    },
    {
      question: 'Do you offer training programs for research teams?',
      answer: 'Yes, I design and deliver customized training programs for research teams on topics including empirical research methodologies, Theory of Change design, social impact evaluation, and academic writing. Training programs can be delivered as workshops, multi-day sessions, or ongoing capacity-building initiatives, adapted to the specific needs and context of your team.',
      category: 'training',
      displayOrder: 4,
      user: userId
    },
    {
      question: 'What academic qualifications do you hold?',
      answer: 'I hold a PhD in Social Pedagogy and a Master\'s degree in Educational Services Design and Coordination. My academic background encompasses both quantitative and qualitative research methodologies, with a focus on empirical educational research and social impact evaluation. For full details, please see the Education section of this portfolio.',
      category: 'general',
      displayOrder: 5,
      user: userId
    }
  ];
  const created = await FAQ.create(records);
  console.log(`  Created ${created.length} FAQ entries`);
  return created;
}

async function seedSettings() {
  const records = [
    { key: 'general.siteName', value: 'Celine Marie CYUZUZO IRAKOZE - Academic Portfolio', category: 'general', description: 'The name of the website displayed in headers and metadata' },
    { key: 'general.contactEmail', value: 'contact@celine-irakoze.com', category: 'general', description: 'Primary contact email address for the portfolio' },
    { key: 'seo.defaultTitle', value: 'Celine Marie CYUZUZO IRAKOZE | Social Pedagogy Researcher', category: 'seo', description: 'Default SEO title for pages without a custom title' },
    { key: 'seo.defaultDescription', value: 'Academic portfolio of Celine Marie CYUZUZO IRAKOZE - Social Pedagogy researcher, educational services specialist, and social impact evaluator with international grant management experience.', category: 'seo', description: 'Default meta description for pages without a custom description' },
    { key: 'appearance.primaryColor', value: '#102a43', category: 'appearance', description: 'Primary brand color used throughout the site' },
    { key: 'comments.enabled', value: true, category: 'comments', description: 'Whether comments are enabled on articles and resources' },
    { key: 'newsletter.enabled', value: true, category: 'newsletter', description: 'Whether the newsletter subscription feature is active' }
  ];
  const created = await Setting.create(records);
  console.log(`  Created ${created.length} platform settings`);
  return created;
}

async function seed() {
  console.log('========================================');
  console.log('  Database Seed Script');
  console.log('  Celine Marie CYUZUZO IRAKOZE');
  console.log('  Academic Portfolio Platform');
  console.log('========================================\n');

  try {
    console.log('[1/5] Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('  Connected successfully\n');

    console.log('[2/5] Dropping existing collections...');
    await dropCollections();
    console.log('  All collections cleared\n');

    console.log('[3/5] Seeding admin user...');
    const adminUser = await seedAdminUser();
    const userId = adminUser._id;
    console.log('');

    console.log('[4/5] Seeding portfolio data...');
    await seedProfile(userId);
    await seedEducation(userId);
    await seedSkills(userId);
    await seedExperience(userId);
    await seedExpertise(userId);
    await seedResearchInterests(userId);
    await seedServices(userId);
    await seedAcademicTitles();
    await seedFAQs(userId);
    console.log('');

    console.log('[5/5] Seeding platform settings...');
    await seedSettings();
    console.log('');

    console.log('========================================');
    console.log('  Seed completed successfully!');
    console.log('========================================');
    console.log('');
    console.log('Summary:');
    console.log('  Admin User:      tumusengeblaise7@gmail.com (password: Admin123!)');
    console.log('  Profile:         Celine Marie CYUZUZO IRAKOZE');
    console.log('  Education:       2 records (PhD, Master)');
    console.log('  Skills:          27 records across 7 categories');
    console.log('  Experience:      6 records');
    console.log('  Expertise:       10 areas');
    console.log('  Research:        7 interests');
    console.log('  Services:        16 services');
    console.log('  Academic Titles: 4 equivalences (Italy/US/UK)');
    console.log('  FAQs:            5 entries');
    console.log('  Settings:        7 platform settings');

  } catch (error) {
    console.error('\nSeed failed with error:');
    console.error(error);
    process.exitCode = 1;
  } finally {
    console.log('\nClosing database connection...');
    await mongoose.disconnect();
    console.log('Disconnected. Exiting.');
    process.exit();
  }
}

seed();
