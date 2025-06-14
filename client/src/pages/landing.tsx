import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Users, Sparkles } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-50 to-nature-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-calm-500 to-nature-500 rounded-3xl mb-6 animate-breathing">
            <Heart className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-800 mb-4">
            MindfulChat
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Your empathetic AI companion for mental wellness. Get support, practice mindfulness, 
            and track your emotional journey in a safe, private space.
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-calm-500 to-calm-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">Empathetic Conversations</h3>
              <p className="text-neutral-600">
                Chat with an AI that truly listens and provides compassionate, 
                non-judgmental support for your mental health journey.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-nature-500 to-nature-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">Guided Exercises</h3>
              <p className="text-neutral-600">
                Access breathing techniques, journaling prompts, and mindfulness 
                exercises tailored to help you manage stress and anxiety.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-warm-500 to-warm-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">Private & Secure</h3>
              <p className="text-neutral-600">
                Your conversations are encrypted and private. We prioritize your 
                mental health and confidentiality above all else.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <Card className="max-w-md mx-auto border-0 shadow-xl bg-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                Ready to start your wellness journey?
              </h2>
              <p className="text-neutral-600 mb-6">
                Join thousands who have found support and peace of mind with MindfulChat.
              </p>
              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-calm-500 to-nature-500 hover:from-calm-600 hover:to-nature-600 text-white py-3 px-6 rounded-xl text-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Button>
              
              <div className="mt-6 p-4 bg-nature-50 rounded-xl">
                <p className="text-xs text-neutral-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-nature-500 mr-2" />
                  Your conversations are private and secure
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Resources */}
        <div className="bg-red-50 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">In Crisis?</h3>
          <p className="text-red-700 mb-4">
            If you're having thoughts of self-harm or suicide, please reach out for immediate help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="tel:988" 
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Call 988 - Crisis Lifeline
            </a>
            <a 
              href="sms:741741" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Text HOME to 741741
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
