import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BoltIcon,
  SparklesIcon,
  CodeIcon,
  PaletteIcon,
  RocketIcon,
  CheckCircleIcon,
} from 'lucide-react';

export const Home =() => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
        navigate('/builder', { state: { prompt } });
    }
  };

  const features = [
    {
      icon: <SparklesIcon className="w-6 h-6 text-primary" />,
      title: 'AI-Powered Generation',
      description: 'Advanced AI understands your needs and creates the perfect website.',
    },
    {
      icon: <PaletteIcon className="w-6 h-6 text-primary" />,
      title: 'Beautiful Design',
      description: 'Professional, modern designs that look great on all devices.',
    },
    {
      icon: <CodeIcon className="w-6 h-6 text-primary" />,
      title: 'Clean Code',
      description: 'Generate production-ready code that follows best practices.',
    },
  ];

  const examples = [
    'I need a modern portfolio website with a dark theme and project showcase section.',
    'Create an e-commerce site for selling handmade jewelry with product galleries.',
    'Build a restaurant website with online menu and reservation system.',
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white shadow">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BoltIcon className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-xl">Webify AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="py-2 px-4 bg-transparent text-blue-500 hover:underline">
              Sign In
            </button>
            <button className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Describe Your Dream Website</h1>
            <p className="text-xl mb-12">
              Let our AI transform your vision into a beautiful, functional website in minutes.
              No coding required.
            </p>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg text-gray-900">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 resize-none"
                rows="5"
                placeholder="Describe your ideal website..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
              >
                <RocketIcon className="w-5 h-5 mr-2" />
                Generate Website
              </button>
            </form>
            <div className="mt-6 text-sm">
              <p className="mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setDescription(example)}
                    className="text-blue-200 hover:underline"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform"
              >
                <div className="p-4 bg-blue-100 rounded-full inline-flex mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Webify AI</h2>
          <ul className="space-y-4">
            {[
              'Instant website generation based on your description.',
              'Professional designs that adapt to any device.',
              'SEO-optimized code and structure.',
              'No technical knowledge required.',
              'Customizable templates and styles.',
              'Ready for production deployment.',
            ].map((benefit, index) => (
              <li key={index} className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-blue-500" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-gray-400">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <BoltIcon className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-white">Webify AI</span>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-white">
              About
            </a>
            <a href="#" className="hover:text-white">
              Features
            </a>
            <a href="#" className="hover:text-white">
              Pricing
            </a>
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


