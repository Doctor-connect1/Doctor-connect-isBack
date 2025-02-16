"use client"

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

export default function ConsultationPage() {
  const params = useParams();
  const roomId = params?.roomId;
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        // Get local stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        });
        peerConnectionRef.current = peerConnection;

        // Add local tracks to peer connection
        stream.getTracks().forEach(track => {
          if (localStreamRef.current) {
            peerConnection.addTrack(track, localStreamRef.current);
          }
        });

        // Handle incoming tracks
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Connect to signaling server with auth token
        const socket = io('http://localhost:4000', {
          auth: {
            token: localStorage.getItem('token')
          }
        });
        socketRef.current = socket;

        // Join room
        socket.emit('join-room', roomId);

        // Handle incoming offers
        socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('answer', answer, roomId);
        });

        // Handle incoming answers
        socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // Handle ICE candidates
        socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
          try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error('Error adding received ice candidate', e);
          }
        });

        // When a new user joins, create and send offer
        socket.on('user-joined', async () => {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socket.emit('offer', offer, roomId);
        });

        // Send ICE candidates to signaling server
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', event.candidate, roomId);
          }
        };

        // Update connection status
        peerConnection.onconnectionstatechange = () => {
          setConnectionStatus(`Connection: ${peerConnection.connectionState}`);
        };

      } catch (error) {
        console.error('Error initializing video call:', error);
        setConnectionStatus('Failed to connect');
      }
    };

    init();

    // Cleanup
    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-20 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="text-gray-600">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold">Video Consultation</h2>
          </div>
          <div className="text-sm text-gray-500">{connectionStatus}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white text-sm">You</div>
          </div>
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white text-sm">Remote User</div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-center space-x-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-200'}`}
          >
            {isMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6" />}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-200'}`}
          >
            {isVideoOff ? <VideoOff className="h-6 w-6 text-white" /> : <Video className="h-6 w-6" />}
          </button>
          <button
            onClick={() => router.back()}
            className="p-3 rounded-full bg-red-500"
          >
            <Phone className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}