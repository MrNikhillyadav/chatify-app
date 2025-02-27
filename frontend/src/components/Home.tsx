import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MessageSquare, Sparkles } from "lucide-react";

const Home = () => {
  const [room, setRoom] = useState("");
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate();

  useEffect(()=> {
    inputRef.current?.focus()
  },[])

  const generateRoomId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  function joinRoom() {
    const roomId = room.trim() ? room.trim() : generateRoomId();
    toast.success("Joining room...");
    navigate(`/room/${roomId}`);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black relative overflow-hidden">
    {/* Spotlight effect */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
    
    

    <div className="bg-zinc-900/90 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center w-full max-w-md mx-4 relative overflow-hidden border border-zinc-800">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500" />
        
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 shadow-lg">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2 text-white">Chat Rooms</h1>
        
      <p className="text-zinc-400 mb-8">
        Join a room or create your own!
      </p>

      <div className="space-y-5">
        <div className="relative">
          <input
          ref={inputRef}
            className="w-full px-4 py-3 bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/50 rounded-lg
                     text-white placeholder-zinc-500 text-sm
                     focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 focus:outline-none
                     transition duration-300 shadow-inner"
            placeholder="Enter Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/70" />
        </div>

        <button
          onClick={joinRoom}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-6 rounded-lg
                   transition duration-300 hover:opacity-90 active:opacity-70 text-sm shadow-lg shadow-purple-900/30"
        >
          Join Room
        </button>

        <button
          onClick={() => {
            const newRoom = generateRoomId();
            setRoom(newRoom);
            showNotification(`Room created: ${newRoom}`);
          }}
          className="w-full bg-gradient-to-r from-zinc-800 to-zinc-900 font-medium py-3 px-6 rounded-lg text-sm
                   text-white border border-zinc-700/50 backdrop-blur-sm
                   transition duration-300 hover:border-purple-500/30 shadow-lg"
        >
          Generate New Room
        </button>
      </div>
    </div>
    
    <div className="mt-8 text-center relative z-10">
      <div className="flex justify-center mb-2">
        <div className="flex -space-x-2">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-6 h-6 rounded-full border border-zinc-800 shadow-md"
              style={{
                background: `linear-gradient(135deg, ${['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f97316'][i]} 0%, rgba(0,0,0,0.8) 120%)`
              }}
            />
          ))}
        </div>
      </div>
      <p className="text-zinc-500 text-xs backdrop-blur-sm py-1 px-3 rounded-full bg-zinc-900/50 inline-block">
        Trusted by over 50,000 users
      </p>
    </div>
  </div>
  );
};

export default Home;