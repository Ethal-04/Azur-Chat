import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, X } from "lucide-react";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-red-500 text-2xl" />
            </div>
            Crisis Support
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center mb-6">
          <p className="text-neutral-600">
            If you're in immediate danger, please contact emergency services.
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href="tel:988"
            className="block w-full bg-red-500 hover:bg-red-600 text-white text-center py-3 rounded-xl font-medium transition-colors"
          >
            <Phone className="w-4 h-4 mr-2 inline" />
            Call 988 - Suicide & Crisis Lifeline
          </a>
          
          <a
            href="sms:741741"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-xl font-medium transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2 inline" />
            Text HOME to 741741
          </a>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
