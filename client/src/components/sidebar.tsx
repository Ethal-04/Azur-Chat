import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, TrendingUp, Book, ExternalLink, Wind, PenTool, Bath, Dumbbell } from "lucide-react";
import { mockExercises } from "@/lib/mockData";

export default function Sidebar() {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    toast({
      title: "Mood recorded",
      description: "Thank you for sharing how you're feeling",
      variant: "default",
    });
  };

  const handleExerciseClick = (exercise: any) => {
    toast({
      title: exercise.title,
      description: exercise.description,
      variant: "default",
    });
  };

  const getExerciseIcon = (category: string) => {
    switch (category) {
      case "breathing":
        return <Wind className="text-blue-500" />;
      case "journaling":
        return <PenTool className="text-cyan-500" />;
      case "mindfulness":
        return <Bath className="text-indigo-500" />;
      case "movement":
        return <Dumbbell className="text-slate-500" />;
      default:
        return <Bath className="text-blue-500" />;
    }
  };

  const getExerciseGradient = (category: string) => {
    switch (category) {
      case "breathing":
        return "from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100";
      case "journaling":
        return "from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100";
      case "mindfulness":
        return "from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100";
      case "movement":
        return "from-slate-50 to-blue-50 hover:from-slate-100 hover:to-blue-100";
      default:
        return "from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100";
    }
  };

  return (
    <aside className="w-80 bg-white/80 backdrop-blur-sm border-r border-blue-100 lg:relative fixed inset-y-0 left-0 z-50 lg:z-auto">
      <div className="p-6 h-full overflow-y-auto">
        {/* Quick Exercises */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Leaf className="text-blue-500 mr-2" />
            Quick Exercises
          </h3>
          
          <div className="space-y-3">
            {mockExercises.slice(0, 3).map((exercise) => (
              <Button
                key={exercise.id}
                variant="ghost"
                onClick={() => handleExerciseClick(exercise)}
                className={`w-full text-left p-4 bg-gradient-to-r ${getExerciseGradient(exercise.category)} transition-all duration-200 group h-auto`}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h4 className="font-medium text-slate-800 group-hover:text-blue-700 text-left">
                      {exercise.title}
                    </h4>
                    <p className="text-sm text-slate-600 text-left">
                      {exercise.description} • {exercise.duration} min
                    </p>
                  </div>
                  {getExerciseIcon(exercise.category)}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Mood Tracker */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <TrendingUp className="text-blue-500 mr-2" />
            How are you feeling?
          </h3>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="ghost"
              onClick={() => handleMoodSelect("great")}
              className={`p-3 rounded-xl transition-colors text-center h-auto ${
                selectedMood === "great" 
                  ? "bg-green-200" 
                  : "bg-green-100 hover:bg-green-200"
              }`}
            >
              <div className="text-2xl mb-1">😊</div>
              <div className="text-xs text-slate-600">Great</div>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => handleMoodSelect("okay")}
              className={`p-3 rounded-xl transition-colors text-center h-auto ${
                selectedMood === "okay" 
                  ? "bg-yellow-200" 
                  : "bg-yellow-100 hover:bg-yellow-200"
              }`}
            >
              <div className="text-2xl mb-1">😐</div>
              <div className="text-xs text-slate-600">Okay</div>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => handleMoodSelect("tough")}
              className={`p-3 rounded-xl transition-colors text-center h-auto ${
                selectedMood === "tough" 
                  ? "bg-blue-200" 
                  : "bg-blue-100 hover:bg-blue-200"
              }`}
            >
              <div className="text-2xl mb-1">😟</div>
              <div className="text-xs text-slate-600">Tough</div>
            </Button>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
            <Book className="text-warm-500 mr-2" />
            Resources
          </h3>
          
          <div className="space-y-2 text-sm">
            <a
              href="tel:988"
              className="block text-calm-600 hover:text-calm-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              National Suicide Prevention
            </a>
            <a
              href="sms:741741"
              className="block text-calm-600 hover:text-calm-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              Crisis Text Line
            </a>
            <a
              href="https://www.mentalhealth.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-calm-600 hover:text-calm-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              Mental Health Resources
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
