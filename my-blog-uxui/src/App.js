import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog UI/UX + E-commerce</h1>
        <p className="text-gray-600 mb-6">
          Plataforma profesional con React, Tailwind CSS y Strapi
        </p>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-gray-700">Blog Profesional</h2>
            <p className="text-gray-500 mt-1">Enfocado en UI/UX y Frontend</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-gray-700">Tienda Digital</h2>
            <p className="text-gray-500 mt-1">Recursos, wireframes, componentes y templates</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-gray-700">Panel de Administración</h2>
            <p className="text-gray-500 mt-1">Control completo de contenido y ventas</p>
          </div>
        </div>
        <button className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
          Comenzar Proyecto
        </button>
      </div>
    </div>
  );
}

export default App;
