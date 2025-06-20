
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bot, Zap, Shield, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">BotForge</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              Sign In
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <Badge className="mb-6 bg-purple-100 text-purple-800 border-purple-200">
          🚀 Now in Beta - Join 10,000+ Creators
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Forge Intelligent
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Bots</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Create, deploy, and manage AI-powered bots without coding. From customer service to content creation, 
          BotForge makes bot development accessible to everyone.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
            Start Building Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-gray-400 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose BotForge?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to create, deploy, and scale intelligent bots
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">Lightning Fast Setup</CardTitle>
              <CardDescription className="text-gray-300">
                Get your bot up and running in minutes with our intuitive drag-and-drop interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li>• Visual flow builder</li>
                <li>• Pre-built templates</li>
                <li>• One-click deployment</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-white">Enterprise Security</CardTitle>
              <CardDescription className="text-gray-300">
                Bank-grade security with SOC 2 compliance and end-to-end encryption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li>• 99.9% uptime SLA</li>
                <li>• Data encryption</li>
                <li>• GDPR compliant</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Team Collaboration</CardTitle>
              <CardDescription className="text-gray-300">
                Work together seamlessly with real-time collaboration and version control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li>• Real-time editing</li>
                <li>• Role-based access</li>
                <li>• Version history</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">10,000+</div>
            <div className="text-gray-300">Active Bots</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">50M+</div>
            <div className="text-gray-300">Messages Processed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
            <div className="text-gray-300">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
            <div className="text-gray-300">Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Your Bot?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already building the future with BotForge
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-800">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">BotForge</span>
            </div>
            <p className="text-gray-400">
              The most powerful platform for creating intelligent bots without code.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BotForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
