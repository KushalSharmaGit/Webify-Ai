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

export const Home = () => {
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
      icon: <SparklesIcon className="w-6 h-6 text-indigo-400" />,
      title: 'AI-Powered Generation',
      description: 'Use advanced AI to craft highly customizable websites effortlessly.',
    },
    {
      icon: <PaletteIcon className="w-6 h-6 text-indigo-400" />,
      title: 'Developer-Friendly Design',
      description: 'Modern, responsive, and customizable designs tailored for developers.',
    },
    {
      icon: <CodeIcon className="w-6 h-6 text-indigo-400" />,
      title: 'Clean, Optimized Code',
      description: 'Generate production-ready, readable, and scalable code.',
    },
  ];

  const examples = [
    'Create a sleek portfolio with a focus on performance.',
    'Design a dashboard for monitoring server analytics.',
    'Build a knowledge-sharing platform with Markdown support.',
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BoltIcon className="w-6 h-6 text-indigo-400" />
            <span className="font-bold text-xl">Webify AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="py-2 px-4 text-indigo-400 hover:underline">
              Sign In
            </button>
            <button className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-indigo-400">
            Transform Ideas Into Reality
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            Describe your ideal website, and let our AI handle the rest. Perfect for developers
            and tech enthusiasts.
          </p>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-gray-100 max-w-xl mx-auto"
          >
            <textarea
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg mb-4 text-sm focus:ring focus:ring-indigo-500"
              rows="5"
              placeholder="Describe your ideal website..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
            >
              <RocketIcon className="w-5 h-5 mr-2" />
              Generate Website
            </button>
          </form>
          <div className="mt-6 text-sm">
            <p className="mb-2 text-gray-400">Try these examples:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-indigo-400 hover:underline"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-indigo-400">
            Why Choose Webify AI
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform"
              >
                <div className="p-4 bg-indigo-900 rounded-full inline-flex mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-400">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-gray-400">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <BoltIcon className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-gray-100">Webify AI</span>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-gray-100">
              About
            </a>
            <a href="#" className="hover:text-gray-100">
              Features
            </a>
            <a href="#" className="hover:text-gray-100">
              Pricing
            </a>
            <a href="#" className="hover:text-gray-100">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};