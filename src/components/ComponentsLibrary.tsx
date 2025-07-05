import React, { useState } from 'react';
import { Copy, Check, Code, Eye, Palette, Layers, FileText } from 'lucide-react';

const ComponentsLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'buttons' | 'accordions' | 'forms'>('buttons');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    { id: 'buttons', label: 'Buttons', icon: Palette },
    { id: 'accordions', label: 'Accordions', icon: Layers },
    { id: 'forms', label: 'Forms', icon: FileText },
  ];

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const buttonComponents = [
    {
      id: 'primary-button',
      name: 'Primary Button',
      description: 'Main action button with solid background',
      preview: (
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
          Primary Button
        </button>
      ),
      code: `<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
  Primary Button
</button>`
    },
    {
      id: 'secondary-button',
      name: 'Secondary Button',
      description: 'Secondary action button with outline style',
      preview: (
        <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
          Secondary Button
        </button>
      ),
      code: `<button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
  Secondary Button
</button>`
    },
    {
      id: 'ghost-button',
      name: 'Ghost Button',
      description: 'Minimal button with subtle hover effect',
      preview: (
        <button className="px-6 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
          Ghost Button
        </button>
      ),
      code: `<button className="px-6 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
  Ghost Button
</button>`
    }
  ];

  const accordionComponents = [
    {
      id: 'basic-accordion',
      name: 'Basic Accordion',
      description: 'Simple accordion with smooth animation',
      preview: <BasicAccordion />,
      code: `const [isOpen, setIsOpen] = useState(false);

<div className="border border-gray-200 rounded-lg overflow-hidden">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
  >
    <span className="font-medium text-gray-900">Accordion Header</span>
    <ChevronDown className={\`h-5 w-5 text-gray-500 transition-transform \${isOpen ? 'rotate-180' : ''}\`} />
  </button>
  <div className={\`overflow-hidden transition-all duration-300 \${isOpen ? 'max-h-96' : 'max-h-0'}\`}>
    <div className="px-6 py-4 bg-white border-t border-gray-200">
      <p className="text-gray-600">
        This is the accordion content that can be expanded or collapsed.
      </p>
    </div>
  </div>
</div>`
    },
    {
      id: 'styled-accordion',
      name: 'Styled Accordion',
      description: 'Accordion with enhanced styling and icons',
      preview: <StyledAccordion />,
      code: `const [isOpen, setIsOpen] = useState(false);

<div className="border-2 border-blue-200 rounded-xl overflow-hidden shadow-sm">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="w-full px-6 py-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all flex items-center justify-between"
  >
    <div className="flex items-center">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
        <FileText className="h-4 w-4 text-white" />
      </div>
      <span className="font-semibold text-gray-900">Enhanced Accordion</span>
    </div>
    <ChevronDown className={\`h-5 w-5 text-blue-600 transition-transform \${isOpen ? 'rotate-180' : ''}\`} />
  </button>
  <div className={\`overflow-hidden transition-all duration-500 ease-in-out \${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}\`}>
    <div className="px-6 py-6 bg-white">
      <p className="text-gray-600 leading-relaxed">
        This accordion features enhanced styling with gradients, icons, and smooth animations.
      </p>
    </div>
  </div>
</div>`
    },
    {
      id: 'multi-accordion',
      name: 'Multi-Section Accordion',
      description: 'Accordion with multiple expandable sections',
      preview: <MultiAccordion />,
      code: `const [openSections, setOpenSections] = useState<string[]>([]);

const toggleSection = (sectionId: string) => {
  setOpenSections(prev => 
    prev.includes(sectionId) 
      ? prev.filter(id => id !== sectionId)
      : [...prev, sectionId]
  );
};

const sections = [
  { id: 'section1', title: 'Section 1', content: 'Content for section 1' },
  { id: 'section2', title: 'Section 2', content: 'Content for section 2' },
  { id: 'section3', title: 'Section 3', content: 'Content for section 3' }
];

<div className="space-y-2">
  {sections.map((section) => (
    <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(section.id)}
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <span className="font-medium text-gray-900">{section.title}</span>
        <ChevronDown className={\`h-5 w-5 text-gray-500 transition-transform \${openSections.includes(section.id) ? 'rotate-180' : ''}\`} />
      </button>
      <div className={\`overflow-hidden transition-all duration-300 \${openSections.includes(section.id) ? 'max-h-96' : 'max-h-0'}\`}>
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <p className="text-gray-600">{section.content}</p>
        </div>
      </div>
    </div>
  ))}
</div>`
    }
  ];

  const formComponents = [
    {
      id: 'contact-form',
      name: 'Contact Form',
      description: 'Simple contact form with validation',
      preview: <ContactForm />,
      code: `const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Handle form submission
};

<form onSubmit={handleSubmit} className="space-y-6 max-w-md">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Name
    </label>
    <input
      type="text"
      value={formData.name}
      onChange={(e) => setFormData({...formData, name: e.target.value})}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Enter your name"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Email
    </label>
    <input
      type="email"
      value={formData.email}
      onChange={(e) => setFormData({...formData, email: e.target.value})}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Enter your email"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Message
    </label>
    <textarea
      value={formData.message}
      onChange={(e) => setFormData({...formData, message: e.target.value})}
      rows={4}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Enter your message"
    />
  </div>
  <button
    type="submit"
    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
  >
    Send Message
  </button>
</form>`
    },
    {
      id: 'login-form',
      name: 'Login Form',
      description: 'Authentication form with modern styling',
      preview: <LoginForm />,
      code: `const [credentials, setCredentials] = useState({
  email: '',
  password: ''
});

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  // Handle login
};

<div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border">
  <div className="text-center mb-8">
    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
    <p className="text-gray-600 mt-2">Sign in to your account</p>
  </div>
  <form onSubmit={handleLogin} className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Address
      </label>
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter your email"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter your password"
      />
    </div>
    <button
      type="submit"
      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      Sign In
    </button>
  </form>
</div>`
    },
    {
      id: 'registration-form',
      name: 'Registration Form',
      description: 'Multi-step registration form with validation',
      preview: <RegistrationForm />,
      code: `const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
});

const handleRegister = (e: React.FormEvent) => {
  e.preventDefault();
  // Handle registration
};

<div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border">
  <div className="text-center mb-8">
    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
    <p className="text-gray-600 mt-2">Join us today</p>
  </div>
  <form onSubmit={handleRegister} className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name
        </label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="First name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name
        </label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Last name"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Address
      </label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter your email"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Create a password"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Confirm Password
      </label>
      <input
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Confirm your password"
      />
    </div>
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={formData.terms}
        onChange={(e) => setFormData({...formData, terms: e.target.checked})}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label className="ml-2 text-sm text-gray-600">
        I agree to the Terms of Service and Privacy Policy
      </label>
    </div>
    <button
      type="submit"
      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      Create Account
    </button>
  </form>
</div>`
    }
  ];

  const getCurrentComponents = () => {
    switch (activeCategory) {
      case 'buttons':
        return buttonComponents;
      case 'accordions':
        return accordionComponents;
      case 'forms':
        return formComponents;
      default:
        return buttonComponents;
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Code className="mr-3 h-6 w-6 text-blue-600" />
            Components
          </h2>
          <p className="text-gray-600 mt-1">Reusable UI components with code examples</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as any)}
                  className={`w-full flex items-center p-4 rounded-lg text-left transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  <div>
                    <div className="font-medium">{category.label}</div>
                    <div className="text-xs text-gray-500">
                      {category.id === 'buttons' && '3 variants'}
                      {category.id === 'accordions' && '3 styles'}
                      {category.id === 'forms' && '3 examples'}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="text-xs text-gray-500 text-center">
            Copy and paste ready-to-use components
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize flex items-center">
                {activeCategory === 'buttons' && <Palette className="mr-2 h-5 w-5" />}
                {activeCategory === 'accordions' && <Layers className="mr-2 h-5 w-5" />}
                {activeCategory === 'forms' && <FileText className="mr-2 h-5 w-5" />}
                {activeCategory}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {activeCategory === 'buttons' && 'Interactive button components with different styles and states'}
                {activeCategory === 'accordions' && 'Collapsible content containers with smooth animations'}
                {activeCategory === 'forms' && 'Form layouts and input components for user interaction'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {getCurrentComponents().length} components
              </span>
            </div>
          </div>
        </div>

        {/* Components Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-8">
            {getCurrentComponents().map((component) => (
              <div key={component.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Component Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{component.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Eye size={12} className="mr-1" />
                        Preview
                      </span>
                    </div>
                  </div>
                </div>

                {/* Component Preview */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-center justify-center min-h-[120px]">
                    {component.preview}
                  </div>
                </div>

                {/* Code Section */}
                <div className="border-t border-gray-200">
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Code size={16} className="mr-2" />
                      Code
                    </span>
                    <button
                      onClick={() => copyToClipboard(component.code, component.id)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      {copiedCode === component.id ? (
                        <>
                          <Check size={14} className="mr-1 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="px-6 py-4 bg-gray-900 text-gray-100 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{component.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component Examples
const BasicAccordion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-md border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <span className="font-medium text-gray-900">Accordion Header</span>
        <div className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <p className="text-gray-600">
            This is the accordion content that can be expanded or collapsed.
          </p>
        </div>
      </div>
    </div>
  );
};

const StyledAccordion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-md border-2 border-blue-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all flex items-center justify-between"
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Enhanced Accordion</span>
        </div>
        <div className={`h-5 w-5 text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-6 bg-white">
          <p className="text-gray-600 leading-relaxed">
            This accordion features enhanced styling with gradients, icons, and smooth animations.
          </p>
        </div>
      </div>
    </div>
  );
};

const MultiAccordion: React.FC = () => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    { id: 'section1', title: 'Section 1', content: 'Content for section 1' },
    { id: 'section2', title: 'Section 2', content: 'Content for section 2' },
    { id: 'section3', title: 'Section 3', content: 'Content for section 3' }
  ];

  return (
    <div className="w-full max-w-md space-y-2">
      {sections.map((section) => (
        <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
          >
            <span className="font-medium text-gray-900">{section.title}</span>
            <div className={`h-5 w-5 text-gray-500 transition-transform ${openSections.includes(section.id) ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openSections.includes(section.id) ? 'max-h-96' : 'max-h-0'}`}>
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <p className="text-gray-600">{section.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your message"
        />
      </div>
      <button
        type="submit"
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Send Message
      </button>
    </form>
  );
};

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">Join us today</p>
      </div>
      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Last name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Create a password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Confirm your password"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.terms}
            onChange={(e) => setFormData({...formData, terms: e.target.checked})}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-600">
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default ComponentsLibrary;