'use client';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

export default function WebRTCComponent() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [myId, setMyId] = useState("");
  const [callTo, setCallTo] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [callerName, setCallerName] = useState("");

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:4000');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socketRef.current.on('me', (id: string) => {
      setMyId(id);
    });

    socketRef.current.on('users', (users: any[]) => {
      setUsers(users);
    });

    socketRef.current.on('callUser', (data: any) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setCallerName(data.from);
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      socketRef.current?.disconnect();
    };
  }, []);

  const callUser = (userId: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream!
    });

    peer.on('signal', (data) => {
      socketRef.current.emit('callUser', {
        userToCall: userId,
        signal: data,
        from: myId
      });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socketRef.current.on('callAccepted', (data: any) => {
      setCallAccepted(true);
      peer.signal(data.signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream!
    });

    peer.on('signal', (data) => {
      socketRef.current.emit('answerCall', {
        signal: data,
        to: caller
      });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Video Chat Room</h1>
          <p className="mt-2 text-blue-100">Connect with others in real-time</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <div>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-[400px] h-[300px] bg-black rounded-lg shadow-lg"
            />
            <p className="mt-2 text-center text-gray-600">My Video</p>
          </div>
          {callAccepted && (
            <div>
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="w-[400px] h-[300px] bg-black rounded-lg shadow-lg"
              />
              <p className="mt-2 text-center text-gray-600">Remote Video</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={callTo}
            onChange={(e) => setCallTo(e.target.value)}
            placeholder="ID to call"
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={() => callUser(callTo)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Call
          </button>
        </div>

        {receivingCall && !callAccepted && (
          <div className="flex gap-4 items-center bg-yellow-100 p-4 rounded-lg">
            <p>Incoming Call from: {callerName}</p>
            <button
              onClick={answerCall}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Answer
            </button>
            <button
              onClick={() => setReceivingCall(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Decline
            </button>
          </div>
        )}

        <div className="mt-4 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2">Online Users:</h3>
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li 
                key={user.id} 
                className="py-2 px-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => setCallTo(user.id)}
              >
                <span>{user.id}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    callUser(user.id);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Call
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-center">
            <span className="font-semibold">Your ID:</span> 
            <span className="ml-2 text-blue-600">{myId}</span>
            <button 
              onClick={() => navigator.clipboard.writeText(myId)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              📋
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}