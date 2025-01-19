import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const Home = () => {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const generateRoomId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  function joinRoom() {
    const roomId = room.trim() ? room.trim() : generateRoomId();
    toast.success("Joining room...");
    navigate(`/room/${roomId}`);
  }

  return (
    <div className="min-h-screen border flex flex-col justify-center items-center bg-cartoon-bg">
      <div className="bg-cartoon-light p-8 rounded-[1.5rem] shadow-xl text-center w-full max-w-md mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cartoon-accent/30 to-cartoon-accent" />

        <div className="flex justify-center ">
          <div className="p-2 rounded-2xl animate-float">
            {/* <MessageSquare className="w-12 h-12 text-cartoon-accent" /> */}
            <img
              src="/chat.gif"
              width={80}
              height={80}
              alt="Picture of the author"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3 text-cartoon-accent">
          Chat Rooms
        </h1>

        <p className="text-cartoon-text mb-8 text-lg">
          Join a room or create your own!
        </p>

        <div className="space-y-4">
          <div className="relative">
            <input
              className="w-full px-6 py-4 bg-cartoon-bg/50 border-2 border-cartoon-accent/20 rounded-2xl
                       text-cartoon-text placeholder-cartoon-text/60 text-lg
                       focus:ring-4 focus:ring-cartoon-accent/20 focus:border-cartoon-accent
                       outline-none transition duration-300"
              placeholder="Enter Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cartoon-accent/40" />
          </div>

          <button
            onClick={joinRoom}
            className="w-full bg-cartoon-accent text-cartoon-light font-medium py-4 px-6 rounded-2xl
                     transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                     hover:bg-cartoon-accent/90 text-lg shadow-lg shadow-cartoon-accent/20"
          >
            Join Room
          </button>

          <button
            onClick={() => {
              const newRoom = generateRoomId();
              setRoom(newRoom);
              toast.success(`Room created: ${newRoom}`, {
                icon: "🎉",
              });
            }}
            className="w-full bg-cartoon-bg font-medium py-4 px-6 rounded-2xl text-lg
                     text-cartoon-accent border-2 border-cartoon-accent/20
                     transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                     hover:bg-cartoon-accent/10"
          >
            Generate New Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
