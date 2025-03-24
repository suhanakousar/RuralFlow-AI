import { useState, useEffect, useRef } from "react";
import { apiService } from "@/lib/apiService";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "@/lib/types";

// Add these type definitions at the top of the file, after the imports
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your RuralFlow AI assistant. How can I help you today with your infrastructure management?",
      sender: "assistant",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: `System: You are RuralFlow AI assistant, specialized in infrastructure management. Current system status:
- Energy: Solar 3.4kW, Battery 78%, Grid 5.2kW
- Water: Reservoir 68%, Flow 45L/min, Quality 92%
- Agriculture: Soil Moisture 42%, Temperature 27°C, Irrigation ON

User Query: ${input}

Please provide specific, data-driven responses based on the current system status.`
        })
      });

      if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();
      const aiMessage: ChatMessage = {
        id: Math.random().toString(36).substring(2, 11),
        content: data[0].generated_text || "I'm sorry, I couldn't generate a response.",
        sender: "assistant",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting to the AI service. Please try again later.",
        sender: "assistant",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const startVoiceRecording = async () => {
    try {
      // First check if we already have a recognition instance
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Create new recognition instance
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'aborted') {
          setInput("Recording stopped. Click the microphone to start again.");
        } else {
          setInput("Error with speech recognition. Please try again.");
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (isRecording) {
          // Restart recognition if it ends while we're still recording
          recognition.start();
        } else {
          setIsRecording(false);
        }
      };

      // Start recognition
      recognition.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setInput("Error accessing microphone. Please check your permissions.");
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically handle the image upload
      // For now, we'll just simulate it
      setInput(`Image uploaded: ${file.name}`);
    }
  };

  const showSuggestions = () => {
    const suggestions = [
      "Check water supply status",
      "View energy consumption",
      "Monitor irrigation system",
      "Get weather forecast"
    ];
    setInput(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderChatInterface = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center animate-pulse mr-2">
            <i className="fas fa-robot text-white"></i>
          </div>
          <h3 className="font-bold text-white">AI Assistant</h3>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`text-gray-400 hover:text-white ${isRecording ? 'text-danger animate-pulse' : ''}`}
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            title={isRecording ? "Stop voice recording" : "Start voice recording"}
            aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
          >
            <i className="fas fa-microphone"></i>
          </button>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={handleExpand}
            title={isExpanded ? "Minimize chat" : "Expand chat"}
            aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
          >
            <i className={`fas ${isExpanded ? 'fa-compress-alt' : 'fa-expand-alt'}`}></i>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start max-w-[85%] ${
              message.sender === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div 
              className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                message.sender === "user" 
                  ? "bg-gradient-to-r from-primary to-gray-700 ml-2" 
                  : "bg-gradient-to-r from-secondary to-primary mr-2"
              }`}
            >
              {message.sender === "user" ? (
                <span className="text-white text-xs">A</span>
              ) : (
                <i className="fas fa-robot text-white text-xs"></i>
              )}
            </div>
            <div 
              className={`${
                message.sender === "user" 
                  ? "bg-primary/20 rounded-tr-none" 
                  : "bg-gray-700/60 rounded-tl-none"
              } rounded-lg p-3`}
            >
              <p className="text-sm text-gray-200">{message.content}</p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
        
        {isProcessing && (
          <div className="flex items-start max-w-[85%]">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-secondary to-primary flex-shrink-0 flex items-center justify-center mr-2">
              <i className="fas fa-robot text-white text-xs"></i>
            </div>
            <div className="bg-gray-700/60 rounded-lg rounded-tl-none p-3">
              <p className="text-sm text-gray-200 flex items-center">
                <span className="inline-block w-2 h-2 bg-secondary rounded-full mr-1 animate-pulse"></span>
                <span className="inline-block w-2 h-2 bg-secondary rounded-full mr-1 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="inline-block w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask RuralFlow AI..."
            className="w-full bg-gray-700/60 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-secondary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
          />
          <button
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              input.trim() && !isProcessing ? "text-secondary hover:text-white" : "text-gray-500"
            }`}
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing}
            title="Send message"
            aria-label="Send message"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <button className="hover:text-gray-200" onClick={showSuggestions}>
            <i className="fas fa-lightbulb mr-1"></i> Suggestions
          </button>
          <div>
            <button 
              className={`hover:text-gray-200 mr-2 ${isRecording ? 'text-danger animate-pulse' : ''}`}
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              title={isRecording ? "Stop voice recording" : "Start voice recording"}
              aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
            >
              <i className="fas fa-microphone"></i> Voice
            </button>
            <label className="hover:text-gray-200 cursor-pointer">
              <i className="fas fa-image"></i> Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Regular View */}
      <div className={`lg:col-span-1 rounded-xl overflow-hidden border border-gray-700 bg-gray-800 shadow-lg ${
        isExpanded ? 'hidden' : 'block'
      }`}>
        {renderChatInterface()}
      </div>

      {/* Expanded Modal View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={handleExpand}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl h-[80vh] rounded-xl overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {renderChatInterface()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
