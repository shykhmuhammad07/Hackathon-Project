// Updated About.jsx with new theme
import React from 'react'

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl shadow-purple-500/20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          About PitchCraft
        </h1>
        <div className="space-y-6 text-lg text-gray-300">
          <p>
            PitchCraft is an AI-powered platform that transforms your startup ideas into compelling, 
            investor-ready pitches. Our advanced algorithms generate creative names, catchy taglines, 
            and professional website previews in seconds.
          </p>
          <p>
            Founded in 2024, we believe that every great idea deserves a great presentation. 
            Whether you're a solo entrepreneur or part of a startup team, PitchCraft helps you 
            communicate your vision effectively.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">Our Mission</h3>
              <p className="text-gray-400">
                Democratize access to professional pitch creation tools for entrepreneurs worldwide.
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">Our Vision</h3>
              <p className="text-gray-400">
                Become the go-to platform for AI-powered startup development and presentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About