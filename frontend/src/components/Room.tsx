import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  message: string;
  name: string;
}

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      message: "Share roomId & start chatting! 👋",
      name: "Server",
    },
  ]);
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("https://chibi-chat.onrender.com");
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        setMessages((prev) => [...prev, data.payload]);
      } 
      catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [roomId]);

  // Scroll to bottom and focus input when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!socket || !message.trim()) return;

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: message.trim(),
          name: name?.trim() || "Anonymous",
        },
      })
    );

    setMessage("");
    
    // Focus on input after sending message
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  const shareRoom = async () => {
    const url = `${window.location.origin}/room/${roomId}`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Room link copied! Share with friends 🎉");
    } catch (err) {
      toast.error("Oops! Couldn't copy the link");
    }
  };

  function leaveRoom() {
    navigate("/");
  }

  function openNameModal() {
    setTempName(name || "");
    setIsNameModalOpen(true);
  }

  function submitName() {
    if (tempName.trim()) {
      setName(tempName.trim());
      toast.success("Name updated successfully!");
    }
    setIsNameModalOpen(false);
    
    // Focus back on input after closing modal
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Spotlight effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />

      {/* Name Modal */}
      {isNameModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Set Your Name</h2>
            <input
              type="text"
              placeholder="Enter your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800/70 border border-zinc-700/50 rounded-lg
                         text-white placeholder-zinc-500
                         focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 focus:outline-none
                         transition duration-300 shadow-inner mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") submitName();
              }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsNameModalOpen(false);
                  // Focus back on input after closing modal
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 0);
                }}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg
                           transition-all hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={submitName}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg
                           transition-all hover:opacity-90 shadow-lg shadow-purple-900/30"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Header */}
        <div className="bg-zinc-900/90 backdrop-blur-md rounded-t-xl shadow-2xl p-4 border border-zinc-800 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500" />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-xl text-white hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">
                    Room: {roomId}
                  </h1>
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-zinc-400">
                    {name?.trim() || "Anonymous"}
                  </p>
                  <button
                    onClick={openNameModal}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded flex items-center gap-1"
                  >
                    <User className="w-3 h-3" />
                    <span>{name ? "Change Name" : "Set Name"}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={leaveRoom}
                className="px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-lg
                           transition-all hover:opacity-90 text-sm border border-zinc-700/50"
              >
                Leave Room
              </button>
              <button
                onClick={shareRoom}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg
                           transition-all hover:opacity-90 text-sm shadow-lg shadow-purple-900/30"
              >
                Share Room
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-zinc-900/80 backdrop-blur-md p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.name === name ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                  msg.name === name
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-zinc-800 text-white"
                } shadow-lg`}
              >
                <div className="text-sm opacity-75 mb-1 flex items-center gap-2">
                  {msg.name}
                  {msg.name === "Server" && <Sparkles className="w-3 h-3" />}
                </div>
                <div className="break-words">{msg.message}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="bg-zinc-900/90 backdrop-blur-md rounded-b-xl shadow-2xl p-4 border border-zinc-800">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              className="flex-1 px-4 py-2 bg-zinc-800/70 border border-zinc-700/50 rounded-lg
                         text-white placeholder-zinc-500 text-sm
                         focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 focus:outline-none
                         transition duration-300 shadow-inner"
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              onClick={sendMessage}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg
                         flex items-center gap-2 transition-all hover:opacity-90
                         shadow-lg shadow-purple-900/30 text-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;