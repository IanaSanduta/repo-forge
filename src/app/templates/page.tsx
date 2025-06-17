import Link from 'next/link';
import ClientImage from '@/components/ClientImage';

interface TemplateProps {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  category: string;
}

const templates: TemplateProps[] = [
  {
    id: 'minimal-portfolio',
    name: 'Minimal Portfolio',
    description: 'A clean, minimalist portfolio template perfect for developers who want to showcase their work with a focus on simplicity.',
    image: '/assets/templates/minimal-portfolio.jpg',
    features: ['Clean design', 'Mobile responsive', 'Project showcase', 'About section', 'Contact form'],
    category: 'portfolio'
  },
  {
    id: 'developer-showcase',
    name: 'Developer Showcase',
    description: 'A modern, feature-rich portfolio template designed to highlight your skills, projects, and professional experience.',
    image: '/assets/templates/developer-showcase.jpg',
    features: ['Skills visualization', 'Project gallery', 'GitHub stats integration', 'Blog section', 'Dark/light mode'],
    category: 'portfolio'
  },
  {
    id: 'project-docs',
    name: 'Project Documentation',
    description: 'A comprehensive documentation template for your open-source projects with easy navigation and code highlighting.',
    image: '/assets/templates/project-docs.jpg',
    features: ['Code highlighting', 'Sidebar navigation', 'Search functionality', 'API documentation', 'Versioning support'],
    category: 'documentation'
  },
  {
    id: 'tech-blog',
    name: 'Tech Blog',
    description: 'A blog template optimized for technical content with code snippets, syntax highlighting, and a clean reading experience.',
    image: '/assets/templates/tech-blog.jpg',
    features: ['Article categories', 'Code snippet support', 'Newsletter integration', 'Author profiles', 'Reading time estimate'],
    category: 'blog'
  },
  {
    id: 'startup-landing',
    name: 'Startup Landing',
    description: 'A professional landing page template for startups and SaaS products with sections for features, pricing, and testimonials.',
    image: '/assets/templates/startup-landing.jpg',
    features: ['Hero section', 'Feature showcase', 'Pricing table', 'Testimonials', 'Newsletter signup'],
    category: 'landing'
  },
  {
    id: 'agency-portfolio',
    name: 'Agency Portfolio',
    description: 'A bold, creative template for agencies and creative professionals to showcase their work and services.',
    image: '/assets/templates/agency-portfolio.jpg',
    features: ['Case studies', 'Team profiles', 'Services section', 'Client logos', 'Contact form'],
    category: 'portfolio'
  }
];

export default function TemplatesPage() {
  const categories = Array.from(new Set(templates.map(template => template.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Website Templates</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Choose from our collection of professionally designed templates to showcase your GitHub repositories and create your perfect portfolio website.
        </p>
      </div>

      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full">
            All Templates
          </button>
          {categories.map(category => (
            <button 
              key={category}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors capitalize"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map(template => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {/* Use ClientImage component for template previews with error handling */}
              <ClientImage
                src={`/assets/templates/${template.id}.jpg`}
                alt={`${template.name} template preview`}
                className="object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{template.name}</h3>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full capitalize">
                  {template.category}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {template.description}
              </p>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features:</h4>
                <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {template.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <Link 
                  href={`/templates/${template.id}`}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-center text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Preview
                </Link>
                <Link 
                  href="/github/connect"
                  className="flex-1 px-4 py-2 bg-black dark:bg-white dark:text-black text-white text-center rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Use Template
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
