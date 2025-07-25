"use client"

import { useState } from "react"
import { ArrowRight, Globe, MessageCircle, Sparkles, Users, Zap, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { africanLanguages } from "@/lib/languages"
import Image from "next/image"

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "23+ African Languages",
      description: "Communicate in Shona, Swahili, Yoruba, Igbo, Zulu, and many more African languages",
      color: "purple"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Natural Conversations",
      description: "Engage in fluid, contextual conversations that understand cultural nuances",
      color: "violet"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered",
      description: "Advanced AI technology trained specifically for African languages and contexts",
      color: "purple"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Cultural Context",
      description: "Responses that understand and respect African cultural values and traditions",
      color: "violet"
    }
  ]

  const languages = africanLanguages.slice(0, 12) // Show first 12 languages

  const testimonials = [
    {
      name: "Amara Okafor",
      location: "Lagos, Nigeria",
      text: "Finally, an AI that understands my language and culture. Mutumwa speaks Igbo like a native!",
      rating: 5
    },
    {
      name: "Tendai Mukamuri",
      location: "Harare, Zimbabwe",
      text: "The Shona translations are incredibly accurate. This is exactly what Africa needed.",
      rating: 5
    },
    {
      name: "Fatou Diallo",
      location: "Dakar, Senegal",
      text: "Speaking Wolof with Mutumwa feels natural and authentic. Truly impressive technology.",
      rating: 5
    }
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/95 via-slate-900/90 to-purple-950/95 relative overflow-x-hidden overflow-y-auto scroll-smooth" data-landing-page>
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-800/20 blur-3xl float-animation"></div>
        <div className="absolute right-0 top-1/4 h-60 w-60 rounded-full bg-violet-700/20 blur-3xl float-animation" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-purple-800/20 blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-40 w-40 rounded-full bg-violet-600/15 blur-2xl float-animation" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 left-1/4 h-32 w-32 rounded-full bg-purple-600/10 blur-xl float-animation" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative h-12 w-12">
              <Image 
                src="/mutumwa-nobg-high-res.png"
                alt="Mutumwa AI Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Mutumwa AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={onGetStarted}
              className="bg-purple-600/80 hover:bg-purple-500 text-white border border-purple-400/50 shadow-[0_0_15px_rgba(147,51,234,0.5)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.7)]"
            >
              Launch App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 border border-purple-400/30 text-purple-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Powered by Advanced AI Technology
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your AI Assistant for
            <span className="block gradient-text">
              African Languages
            </span>
          </h1>

          {/* Hero Description */}
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Experience the power of AI that truly understands African cultures and languages. 
            Communicate naturally in over 23 African languages with cultural context and authenticity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 text-lg font-semibold shadow-[0_0_20px_rgba(147,51,234,0.6)] border border-purple-400/50 backdrop-blur-sm group transition-all duration-300 hover:shadow-[0_0_25px_rgba(147,51,234,0.8)] purple-glow"
            >
              Start Chatting Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-purple-600/50 text-purple-300 hover:text-white hover:bg-purple-800/30 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300 hover:border-purple-400/70"
            >
              <Globe className="mr-2 h-5 w-5" />
              Explore Languages
            </Button>
          </div>

          {/* Language Showcase */}
          <div className="mt-16">
            <p className="text-sm text-slate-400 mb-6">Supporting African Languages:</p>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {languages.map((language, index) => (
                <div
                  key={language.value}
                  className="px-3 py-2 bg-slate-800/40 border border-slate-700/50 rounded-lg text-sm text-slate-300 backdrop-blur-sm hover:bg-purple-800/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {language.label.split(' ')[0]}
                </div>
              ))}
              <div className="px-3 py-2 bg-purple-600/20 border border-purple-400/30 rounded-lg text-sm text-purple-300 backdrop-blur-sm">
                +{africanLanguages.length - languages.length} more
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose Mutumwa?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built specifically for African languages with deep cultural understanding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm transition-all duration-300 h-full ${
                  hoveredFeature === index ? 'bg-purple-800/30 border-purple-400/50 shadow-[0_0_20px_rgba(147,51,234,0.3)] transform scale-105' : ''
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    feature.color === 'purple' ? 'bg-purple-600/20 text-purple-400' :
                    'bg-violet-600/20 text-violet-400'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Loved by Communities Across Africa
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              See what people are saying about their experience with Mutumwa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-purple-800/20 hover:border-purple-400/30 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-slate-400 text-sm">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-400/30 backdrop-blur-sm purple-glow">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Conversing?
            </h2>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Join thousands of users experiencing AI that truly understands African languages and cultures.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 text-lg font-semibold shadow-[0_0_25px_rgba(147,51,234,0.8)] border border-purple-400/50 group transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,1)] purple-glow"
              >
                <Zap className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="flex items-center justify-center mt-6 text-sm text-purple-300">
              <CheckCircle className="mr-2 h-4 w-4" />
              No account required • Start chatting immediately
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-8 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative h-10 w-10 mr-3">
              <Image 
                src="/mutumwa-nobg-high-res.png"
                alt="Mutumwa AI Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">Mutumwa AI</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2025 Mutumwa AI. Empowering African voices through technology.
          </p>
        </div>
      </footer>
      <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    </div>
  )
}