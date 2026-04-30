export const JOBS = [
  {
    id: 1,
    title: 'Software Engineering Intern',
    company: 'Google',
    logo: 'G',
    color: '#1a73e8',
    type: 'Internship',
    mode: 'Remote',
    tags: ['React', 'JavaScript', 'TypeScript'],
    stipend: '$3,500/mo',
    location: 'Remote (US/EU)',
    posted: '2d ago',
    featured: true,
    category: 'Technology',
    desc: 'Join the Google Chrome DevTools team for a transformative 12-week internship where you will build next-generation developer experiences. As a Software Engineering Intern, you will work alongside some of the brightest minds in the industry to create tools that millions of web developers rely on daily. You will be fully integrated into our agile development teams, participating in daily stand-ups, code reviews, and architecture discussions. This role provides unparalleled exposure to large-scale distributed systems, frontend performance optimization, and cutting-edge web standards.',
    responsibilities: [
      'Design, develop, test, deploy, maintain, and enhance software solutions within the Chrome DevTools ecosystem.',
      'Collaborate with cross-functional teams including Product Managers, UX Designers, and other engineers to deliver impactful features.',
      'Write clean, efficient, and well-documented code using JavaScript, TypeScript, and modern web frameworks.',
      'Identify and resolve performance bottlenecks in frontend applications.',
      'Participate in code reviews and contribute to engineering best practices.'
    ],
    requiredSkills: [
      'Currently pursuing a Bachelor’s, Master’s, or PhD degree in Computer Science or a related technical field.',
      'Strong proficiency in JavaScript, HTML, and CSS.',
      'Experience with modern frontend frameworks (e.g., React, Angular, or Vue).',
      'Solid understanding of data structures, algorithms, and software design principles.',
      'Excellent problem-solving and analytical skills.'
    ],
    preferredSkills: [
      'Previous internship experience in software development.',
      'Contributions to open-source projects.',
      'Experience with TypeScript and state management libraries (e.g., Redux).',
      'Familiarity with web performance optimization techniques.'
    ],
    aboutCompany: 'Google’s mission is to organize the world’s information and make it universally accessible and useful. We are a global technology leader focused on improving the ways people connect with information. We believe that technology can change the world, and our engineers are at the forefront of this transformation. We offer a highly collaborative, inclusive, and innovative work environment where your ideas can make a real impact.'
  },
  {
    id: 2,
    title: 'Data Analyst Intern',
    company: 'Spotify',
    logo: 'S',
    color: '#1DB954',
    type: 'Internship',
    mode: 'Hybrid',
    tags: ['Python', 'SQL', 'Tableau'],
    stipend: '$2,800/mo',
    location: 'Stockholm, Sweden',
    posted: '1d ago',
    featured: false,
    category: 'Data Science',
    desc: 'Join Spotify’s Data Science team to analyze user listening patterns and build interactive dashboards that drive critical business decisions. In this internship, you will dive deep into petabytes of audio streaming data to uncover trends, user preferences, and actionable insights. You will work closely with product and marketing teams to understand their data needs and deliver compelling visualizations that shape the future of music streaming.',
    responsibilities: [
      'Write complex SQL queries to extract, transform, and analyze large datasets from multiple sources.',
      'Develop interactive and visually appealing dashboards using Tableau or similar BI tools.',
      'Conduct exploratory data analysis using Python (Pandas, NumPy) to identify user behavior patterns.',
      'Present findings and actionable recommendations to stakeholders in a clear and concise manner.',
      'Assist in A/B testing analysis for new feature rollouts.'
    ],
    requiredSkills: [
      'Pursuing a degree in Data Science, Statistics, Computer Science, or a related quantitative field.',
      'Strong SQL skills and experience working with relational databases.',
      'Proficiency in Python or R for data analysis.',
      'Familiarity with data visualization tools (e.g., Tableau, PowerBI, Looker).',
      'Strong communication skills to translate complex data into understandable business insights.'
    ],
    preferredSkills: [
      'Experience with big data technologies (e.g., BigQuery, Hadoop, Spark).',
      'Knowledge of statistical modeling and hypothesis testing.',
      'Passion for the music and audio streaming industry.'
    ],
    aboutCompany: 'Spotify transformed music listening forever when we launched in 2008. Our mission is to unlock the potential of human creativity by giving a million creative artists the opportunity to live off their art and billions of fans the opportunity to enjoy and be inspired by it. Today, Spotify is the world’s most popular audio streaming subscription service with a community of over 500 million users.'
  },
  {
    id: 3,
    title: 'Product Designer',
    company: 'Stripe',
    logo: 'S',
    color: '#635BFF',
    type: 'Full-time',
    mode: 'On-site',
    tags: ['Figma', 'Design Systems', 'Fresher OK'],
    stipend: '$80k - $120k/yr',
    location: 'San Francisco, CA',
    posted: '3d ago',
    featured: false,
    category: 'Design',
    desc: 'Stripe is looking for a talented Product Designer to help craft seamless payment experiences for millions of merchants worldwide. This role is perfect for a highly creative individual who excels at turning complex financial workflows into intuitive, beautiful interfaces. You will take ownership of end-to-end design processes, from initial user research and wireframing to high-fidelity prototyping and collaborating with engineering teams for implementation. Help us build the economic infrastructure of the internet.',
    responsibilities: [
      'Lead the design of core user flows, creating wireframes, prototypes, and high-fidelity visuals.',
      'Conduct user research and usability testing to validate design decisions and understand merchant pain points.',
      'Collaborate closely with Product Managers and Engineers to define product strategy and scope.',
      'Contribute to and maintain Stripe’s design system, ensuring consistency across all products.',
      'Advocate for a user-centered design approach and high-quality craft across the organization.'
    ],
    requiredSkills: [
      'Degree in HCI, Design, or equivalent practical experience. Freshers with exceptional portfolios are welcome.',
      'Expert proficiency in Figma and modern design prototyping tools.',
      'Strong portfolio demonstrating a deep understanding of UX principles and exceptional visual design craft.',
      'Ability to communicate design rationale clearly to diverse stakeholders.',
      'Understanding of HTML/CSS and technical constraints of web and mobile platforms.'
    ],
    preferredSkills: [
      'Experience designing B2B SaaS or financial technology products.',
      'Knowledge of accessibility (a11y) best practices in product design.',
      'Experience working in a fast-paced, agile environment.'
    ],
    aboutCompany: 'Stripe is a financial infrastructure platform for the internet. Millions of companies—from the world’s largest enterprises to the most ambitious startups—use Stripe to accept payments, grow their revenue, and accelerate new business opportunities. Our mission is to increase the GDP of the internet by making it easier for companies to start, run, and scale their businesses globally.'
  },
  {
    id: 4,
    title: 'Backend Engineer Intern',
    company: 'Airbnb',
    logo: 'A',
    color: '#FF5A5F',
    type: 'Internship',
    mode: 'Hybrid',
    tags: ['Node.js', 'AWS', 'Microservices'],
    stipend: '$4,000/mo',
    location: 'London, UK',
    posted: '5h ago',
    featured: true,
    category: 'Technology',
    desc: 'As a Backend Engineer Intern at Airbnb, you will help scale the services that handle millions of bookings globally. You will work on challenging technical problems related to distributed systems, performance optimization, and data consistency. This internship offers the chance to write robust APIs, refactor legacy monoliths into microservices, and ensure our platform remains highly available during peak travel seasons. You will be mentored by senior engineers and ship code that directly impacts millions of hosts and guests.',
    responsibilities: [
      'Design, build, and maintain scalable backend services using Node.js and Java.',
      'Optimize API performance and reduce latency for high-traffic endpoints.',
      'Work with cloud infrastructure (AWS) and containerization technologies (Docker, Kubernetes).',
      'Collaborate with frontend engineers to integrate APIs and ensure seamless user experiences.',
      'Write comprehensive unit and integration tests to ensure code reliability.'
    ],
    requiredSkills: [
      'Currently enrolled in a Bachelor’s or Master’s program in Computer Science or related field.',
      'Strong programming skills in Node.js, Java, Python, or Ruby.',
      'Understanding of RESTful API design and microservices architecture.',
      'Experience with relational databases (e.g., PostgreSQL, MySQL) and ORMs.',
      'Strong grasp of data structures, algorithms, and object-oriented design.'
    ],
    preferredSkills: [
      'Familiarity with cloud platforms like AWS or Google Cloud.',
      'Knowledge of caching mechanisms (Redis, Memcached) and message queues (Kafka, RabbitMQ).',
      'Previous experience with CI/CD pipelines.'
    ],
    aboutCompany: 'Airbnb was born in 2007 when two Hosts welcomed three guests to their San Francisco home, and has since grown to over 4 million Hosts who have welcomed more than 1 billion guest arrivals across over 220 countries and regions. Every day, Hosts offer unique stays and experiences that make it possible for guests to connect with communities in a more authentic way.'
  },
  {
    id: 5,
    title: 'Growth Marketing Intern',
    company: 'Notion',
    logo: 'N',
    color: '#000000',
    type: 'Part-time',
    mode: 'Remote',
    tags: ['SEO', 'Content', 'Analytics'],
    stipend: '$2,000/mo',
    location: 'Remote',
    posted: '5d ago',
    featured: false,
    category: 'Marketing',
    desc: 'Notion is seeking a creative and data-driven Growth Marketing Intern to help drive organic growth campaigns for the leading workspace platform. In this remote, part-time role, you will play a crucial part in expanding our user base through SEO, content marketing, and community engagement. You will analyze traffic patterns, optimize landing pages for conversion, and create compelling content that resonates with our target audience of students, creators, and professionals.',
    responsibilities: [
      'Assist in executing the global SEO strategy, including keyword research and on-page optimization.',
      'Create, edit, and publish high-quality blog posts, case studies, and marketing copy.',
      'Analyze website traffic and conversion metrics using Google Analytics and Amplitude.',
      'Collaborate with the design team to create engaging visual assets for social media campaigns.',
      'Engage with the Notion community across Twitter, Reddit, and LinkedIn to foster brand loyalty.'
    ],
    requiredSkills: [
      'Pursuing a degree in Marketing, Communications, Business, or a related field.',
      'Excellent written and verbal communication skills with a keen eye for detail.',
      'Basic understanding of SEO principles and content marketing strategies.',
      'Analytical mindset with the ability to interpret data and draw actionable conclusions.',
      'Familiarity with marketing analytics tools (e.g., Google Analytics).'
    ],
    preferredSkills: [
      'Previous experience managing social media accounts for a brand or organization.',
      'Familiarity with marketing automation tools and CRM software.',
      'Passion for productivity tools and a strong understanding of the Notion product.'
    ],
    aboutCompany: 'Notion is a single space where you can think, write, and plan. Capture thoughts, manage projects, or even run an entire company — and do it exactly the way you want. We are building the all-in-one workspace that blends your everyday work apps into one. We are a fast-growing, highly collaborative team dedicated to improving the way people work and organize their lives.'
  },
  {
    id: 6,
    title: 'ML Research Intern',
    company: 'OpenAI',
    logo: 'O',
    color: '#10A37F',
    type: 'Internship',
    mode: 'On-site',
    tags: ['Python', 'PyTorch', 'NLP'],
    stipend: '$6,000/mo',
    location: 'San Francisco, CA',
    posted: '1d ago',
    featured: true,
    category: 'Data Science',
    desc: 'Join OpenAI as an ML Research Intern and contribute to the research and development of state-of-the-art large language models. This is a unique opportunity to work alongside pioneers in artificial intelligence and push the boundaries of what is possible. You will be involved in designing new neural network architectures, optimizing training pipelines for massive datasets, and evaluating model safety and alignment. Your work will directly impact the next generation of AI systems.',
    responsibilities: [
      'Conduct empirical research to improve the capabilities, efficiency, and alignment of large language models.',
      'Design, implement, and run large-scale experiments using PyTorch and distributed training systems.',
      'Analyze model behavior, identify failure modes, and propose robust solutions.',
      'Publish research findings internally and contribute to external papers when applicable.',
      'Collaborate with engineering teams to deploy research models into production environments.'
    ],
    requiredSkills: [
      'Currently pursuing a PhD (or strong Master’s) in Computer Science, AI/ML, Mathematics, or a related field.',
      'Deep understanding of deep learning concepts, particularly Transformers and NLP.',
      'Strong programming proficiency in Python and extensive experience with PyTorch.',
      'Solid mathematical foundation in linear algebra, calculus, and probability.',
      'Demonstrated research capability through publications or significant projects.'
    ],
    preferredSkills: [
      'Experience with distributed training (e.g., DeepSpeed, Megatron-LM).',
      'Background in reinforcement learning or AI safety/alignment.',
      'Strong software engineering skills and experience writing highly optimized code.'
    ],
    aboutCompany: 'OpenAI is an AI research and deployment company dedicated to ensuring that artificial general intelligence benefits all of humanity. We are building safe and beneficial AGI, and we are committed to sharing our research and tools to democratize AI technology. Our teams work on the cutting edge of deep learning, reinforcing learning, and alignment research.'
  },
  {
    id: 7,
    title: 'Product Manager Intern',
    company: 'Duolingo',
    logo: 'D',
    color: '#58CC02',
    type: 'Internship',
    mode: 'Hybrid',
    tags: ['Product', 'Agile', 'EdTech'],
    stipend: '$3,200/mo',
    location: 'Pittsburgh, PA',
    posted: '2d ago',
    featured: false,
    category: 'Operations',
    desc: 'Help shape learning products used by millions of students worldwide as a Product Manager Intern at Duolingo. You will work at the intersection of engineering, design, and education to build features that make learning fun, free, and effective. You will define product requirements, analyze user engagement data, and run A/B experiments to optimize the learning experience. This is a highly cross-functional role requiring strong empathy for learners and excellent execution skills.',
    responsibilities: [
      'Lead a cross-functional squad of engineers and designers to deliver a specific product feature from conception to launch.',
      'Analyze user data and conduct market research to identify opportunities for product improvement.',
      'Write clear and concise product requirement documents (PRDs) and user stories.',
      'Design and execute A/B tests to measure the impact of new features on user retention and learning outcomes.',
      'Communicate product strategy, progress, and results to stakeholders across the company.'
    ],
    requiredSkills: [
      'Pursuing an MBA or a degree in Computer Science, Design, Business, or a related field.',
      'Strong analytical skills and the ability to make data-informed decisions.',
      'Excellent communication and leadership skills to align diverse teams.',
      'Demonstrated passion for education technology and the Duolingo mission.',
      'Basic understanding of software development processes (e.g., Agile, Scrum).'
    ],
    preferredSkills: [
      'Previous experience in product management, software engineering, or UX design.',
      'Familiarity with SQL for querying data to answer product questions.',
      'Experience building consumer-facing mobile applications.'
    ],
    aboutCompany: 'Duolingo is the most popular language-learning platform and the most downloaded education app in the world, with over 500 million total learners. Our mission is to develop the best education in the world and make it universally available. We believe that everyone should have access to high-quality education, and we use gamification and advanced technology to make learning engaging and effective.'
  },
  {
    id: 8,
    title: 'Cloud DevOps Engineer',
    company: 'Microsoft',
    logo: 'M',
    color: '#00A4EF',
    type: 'Full-time',
    mode: 'On-site',
    tags: ['Azure', 'Kubernetes', 'CI/CD', 'Fresher OK'],
    stipend: '$90k - $110k/yr',
    location: 'Seattle, WA',
    posted: 'Just now',
    featured: false,
    category: 'Technology',
    desc: 'Join Microsoft as a Cloud DevOps Engineer and help build and maintain enterprise-scale cloud infrastructure for Azure clients. This role is ideal for fresh graduates with a strong passion for automation, cloud architecture, and reliable systems. You will work on designing robust CI/CD pipelines, managing Kubernetes clusters, and ensuring high availability for mission-critical applications. You will collaborate with global teams to drive DevOps transformation for Fortune 500 companies.',
    responsibilities: [
      'Design, implement, and manage automated CI/CD pipelines using Azure DevOps and GitHub Actions.',
      'Provision and manage cloud infrastructure using Infrastructure as Code (IaC) tools like Terraform or ARM templates.',
      'Deploy, monitor, and scale containerized applications on Azure Kubernetes Service (AKS).',
      'Implement robust monitoring, logging, and alerting solutions using Azure Monitor and Application Insights.',
      'Respond to system incidents, troubleshoot infrastructure issues, and implement preventative measures.'
    ],
    requiredSkills: [
      'Bachelor’s degree in Computer Science, Information Technology, or a related field. Freshers are encouraged to apply.',
      'Solid understanding of cloud computing concepts, preferably with Microsoft Azure.',
      'Experience with scripting languages (e.g., PowerShell, Python, Bash) for automation tasks.',
      'Knowledge of containerization technologies (Docker) and orchestration (Kubernetes).',
      'Understanding of networking fundamentals, security principles, and operating systems.'
    ],
    preferredSkills: [
      'Microsoft Azure certifications (e.g., AZ-900, AZ-104, or AZ-400).',
      'Experience with configuration management tools (e.g., Ansible, Chef).',
      'Familiarity with agile methodologies and site reliability engineering (SRE) practices.'
    ],
    aboutCompany: 'Microsoft’s mission is to empower every person and every organization on the planet to achieve more. As a global leader in software, services, devices, and solutions, we are driving digital transformation in the era of an intelligent cloud and an intelligent edge. We foster a culture of inclusion, innovation, and continuous learning, providing a platform where you can build a meaningful and impactful career.'
  }
];

export const COMPANIES = [
  { id: 1, name: 'Google', logo: 'G', color: '#1a73e8', bg: '#e8f0fe', industry: 'Technology', location: 'Global', openings: 142, size: '150k+', desc: 'Search, Cloud & YouTube. World-class engineering internship programs.' },
  { id: 2, name: 'Spotify', logo: 'S', color: '#1DB954', bg: '#e8fdf2', industry: 'Music Tech', location: 'Stockholm, Global', openings: 45, size: '9k+', desc: 'Audio streaming platform — hiring in tech, product, and design.' },
  { id: 3, name: 'Stripe', logo: 'S', color: '#635BFF', bg: '#efefff', industry: 'FinTech', location: 'San Francisco', openings: 87, size: '7k+', desc: 'Financial infrastructure platform for the internet.' },
  { id: 4, name: 'Airbnb', logo: 'A', color: '#FF5A5F', bg: '#ffeef0', industry: 'Travel-Tech', location: 'Global', openings: 54, size: '6k+', desc: 'Global travel community hiring across engineering and design.' },
  { id: 5, name: 'OpenAI', logo: 'O', color: '#10A37F', bg: '#e8fbf5', industry: 'AI Research', location: 'San Francisco', openings: 32, size: '1k+', desc: 'Creating safe AGI that benefits all of humanity.' },
  { id: 6, name: 'Microsoft', logo: 'M', color: '#00A4EF', bg: '#e5f6fd', industry: 'Technology', location: 'Seattle, Global', openings: 300, size: '200k+', desc: 'Empowering every person and organization to achieve more.' }
];


export const FILTERS = ['All', 'Internship', 'Full-time', 'Part-time', 'Remote', 'Fresher OK'];
export const CATEGORIES = ['Technology', 'Design', 'Data Science', 'Finance', 'Marketing', 'Operations'];

