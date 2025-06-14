import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      login();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-4 animate-pulse-gentle">
            <Heart className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome to MindfulChat
          </h1>
          <p className="text-slate-600">
            Your safe space for mental wellness and support
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-xl text-lg font-medium transition-all duration-200 transform hover:scale-105 h-12"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up
                </button>
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-xs text-slate-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-500 mr-2" />
                Your conversations are private and secure
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Note */}
        <div className="mt-6 p-4 bg-slate-100 rounded-xl text-center">
          <p className="text-sm text-slate-600">
            <strong>Demo Mode:</strong> Use any email and password to continue
          </p>
        </div>

        {/* Emergency Resources */}
        <div className="mt-6 bg-red-50 rounded-xl p-4 text-center">
          <h3 className="text-sm font-semibold text-red-800 mb-2">In Crisis?</h3>
          <p className="text-xs text-red-700 mb-3">
            If you're having thoughts of self-harm, please reach out immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a 
              href="tel:988" 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Call 988 - Crisis Lifeline
            </a>
            <a 
              href="sms:741741" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Text HOME to 741741
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}