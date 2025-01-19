import React from 'react';
import { useLocation } from 'react-router-dom';
import { Editor } from "@monaco-editor/react";
import CodeExplorer from '../components/CodeExplorer';

export const Builder = () => {
//     const location = useLocation();
//     const { prompt } = location.state || {}; // Handle case where location.state is undefined

    const defaultCode =[
        {
          "id": "src/index.tsx",
          "name": "src",
          "type": "folder",
          "content": null,
          "children": [
            {
              "id": "src/pages/Home.tsx",
              "name": "pages",
              "type": "folder",
              "content": null,
              "children": [
                {
                  "id": "src/pages/Home.tsx",
                  "name": "Home.tsx",
                  "type": "file",
                  "content": "import React from 'react';\nimport { Link } from 'react-router-dom';\n\nfunction Home() {\n  return (\n    <div className=\"container mx-auto p-8\">\n      <h1 className=\"text-4xl font-bold mb-4\">Welcome to Dr. [Doctor's Name]'s Website</h1>\n      <p className=\"text-lg mb-8\">[Short description of the doctor and their practice]</p>\n      <div className=\"flex space-x-4\">\n        <Link to=\"/about\" className=\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded\">\n          About\n        </Link>\n        <Link to=\"/location\" className=\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded\">\n          Location\n        </Link>\n        <Link to=\"/contact\" className=\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded\">\n          Contact\n        </Link>\n      </div>\n    </div>\n  );\n}\n\nexport default Home;",
                  "children": null
                },
                {
                  "id": "src/pages/About.tsx",
                  "name": "About.tsx",
                  "type": "file",
                  "content": "import React from 'react';\n\nfunction About() {\n  return (\n    <div className=\"container mx-auto p-8\">\n      <h1 className=\"text-4xl font-bold mb-4\">About Dr. [Doctor's Name]</h1>\n      <p className=\"text-lg\">[Detailed information about the doctor's background, qualifications, and experience]</p>\n    </div>\n  );\n}\n\nexport default About;",
                  "children": null
                },
                {
                  "id": "src/pages/Privacy.tsx",
                  "name": "Privacy.tsx",
                  "type": "file",
                  "content": "import React from 'react';\n\nfunction Privacy() {\n  return (\n    <div className=\"container mx-auto p-8\">\n      <h1 className=\"text-4xl font-bold mb-4\">Privacy Policy</h1>\n      <p className=\"text-lg\">[Detailed privacy policy]</p>\n    </div>\n  );\n}\n\nexport default Privacy;",
                  "children": null
                },
                {
                  "id": "src/pages/Location.tsx",
                  "name": "Location.tsx",
                  "type": "file",
                  "content": "import React from 'react';\n\nfunction Location() {\n  return (\n    <div className=\"container mx-auto p-8\">\n      <h1 className=\"text-4xl font-bold mb-4\">Location</h1>\n      <p className=\"text-lg\">[Address, map embed, contact information]</p>\n    </div>\n  );\n}\n\nexport default Location;",
                  "children": null
                },
                {
                  "id": "src/pages/Contact.tsx",
                  "name": "Contact.tsx",
                  "type": "file",
                  "content": "import React, { useState } from 'react';\n\nfunction Contact() {\n  const [name, setName] = useState('');\n  const [email, setEmail] = useState('');\n  const [message, setMessage] = useState('');\n\n  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    // Add your form submission logic here\n    console.log({ name, email, message });\n  };\n\n  return (\n    <div className=\"container mx-auto p-8\">\n      <h1 className=\"text-4xl font-bold mb-4\">Contact</h1>\n      <form onSubmit={handleSubmit}>\n        <div className=\"mb-4\">\n          <label htmlFor=\"name\" className=\"block text-gray-700 font-bold mb-2\">Name</label>\n          <input type=\"text\" id=\"name\" value={name} onChange={(e) => setName(e.target.value)} className=\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\" required />\n        </div>\n        <div className=\"mb-4\">\n          <label htmlFor=\"email\" className=\"block text-gray-700 font-bold mb-2\">Email</label>\n    <input type=\"email\" id=\"email\" value={email} onChange={(e) => setEmail(e.target.value)} className=\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\" required />\n        </div>\n        <div className=\"mb-4\">\n          <label htmlFor=\"message\" className=\"block text-gray-700 font-bold mb-2\">Message</label>\n          <textarea id=\"message\" value={message} onChange={(e) => setMessage(e.target.value)} className=\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\" required></textarea>\n        </div>\n        <button type=\"submit\" className=\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded\">Send</button>\n      </form>\n    </div>\n  );\n}\n\nexport default Contact;",
                  "children": null
                },
                {
                  "id": "src/index.css",
                  "name": "index.css",
                  "type": "file",
                  "content": "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
                  "children": null
                }
              ]
            },
            {
              "id": "src/index.tsx",
              "name": "index.tsx",
              "type": "file",
              "content": "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport App from './App';\nimport reportWebVitals from './reportWebVitals';\n\nconst root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n\nreportWebVitals();",
              "children": null
            },
            {
              "id": "src/App.tsx",
              "name": "App.tsx",
              "type": "file",
              "content": "import React from 'react';\nimport { BrowserRouter, Routes, Route } from 'react-router-dom';\nimport Home from './pages/Home';\nimport About from './pages/About';\nimport Privacy from './pages/Privacy';\nimport Location from './pages/Location';\nimport Contact from './pages/Contact';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path=\"/\" element={<Home />} />\n        <Route path=\"/about\" element={<About />} />\n        <Route path=\"/privacy\" element={<Privacy />} />\n        <Route path=\"/location\" element={<Location />} />\n        <Route path=\"/contact\" element={<Contact />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}\n\nexport default App;",
              "children": null
            },
            {
              "id": "tsconfig.json",
              "name": "tsconfig.json",
              "type": "file",
              "content": "{\n  \"compilerOptions\": {\n    \"target\": \"es5\",\n    \"lib\": [\n      \"dom\",\n      \"dom.iterable\",\n      \"esnext\"\n   ] ,\n    \"allowJs\": true,\n    \"skipLibCheck\": true,\n    \"esModuleInterop\": true,\n    \"allowSyntheticDefaultImports\": true,\n    \"strict\": true,\n    \"forceConsistentCasingInFileNames\": true,\n    \"noFallthroughCasesInSwitch\": true,\n    \"module\": \"esnext\",\n    \"moduleResolution\": \"node\",\n    \"resolveJsonModule\": true,\n    \"isolatedModules\": true,\n    \"noEmit\": true,\n    \"jsx\": \"react-jsx\"\n  },\n  \"include\": [\n    \"src\"\n  ]\n}",
              "children": null
            }
          ]
        },
        {
          "id": "package.json",
          "name": "package.json",
          "type": "file",
          "content": "{ \"name\": \"doctor-landing-page\", \"version\": \"1.0.0\", \"private\": true, \"dependencies\": { \"react\": \"18.2.0\", \"react-dom\": \"18.2.0\", \"react-scripts\": \"5.0.1\", \"@types/react\": \"18.0.27\", \"@types/react-dom\": \"18.0.11\", \"tailwindcss\": \"3.3.3\", \"autoprefixer\": \"10.4.14\", \"postcss\": \"8.4.24\", \"lucide-react\": \"0.268.0\" }, \"scripts\": { \"start\": \"react-scripts start\", \"build\": \"react-scripts build\", \"test\": \"react-scripts test\", \"eject\": \"react-scripts eject\" }, \"eslintConfig\": { \"extends\": [ \"react-app\", \"react-app/jest\" ] }, \"browserslist\": { \"production\": [ \">0.2%\", \"not dead\", \"not op_mini all\" ], \"development\": [ \"last 1 chrome version\", \"last 1 firefox version\", \last 1 safari version\" ] } }",
          "children": null
        },
        {
          "id": "tailwind.config.js",
          "name": "tailwind.config.js",
          "type": "file",
          "content": "/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: [ \"./src/**/*.{js,jsx,ts,tsx}\", ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};",
          "children": null
        }
      ];
//     return (
//         <Editor
//             height="75vh"
//             theme="vs-dark"
//             value={prompt || defaultCode} // Use the prompt from location.state or fallback to defaultCode
//         />
//     );
    return(<CodeExplorer fileData={defaultCode}></CodeExplorer>)
};
