"use client"

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Phone, MoreVertical } from 'lucide-react';
import Navbar from '@/components/Home/Navbar';
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();

  // Separate useEffect for userId initialization
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', Date.now().toString());
    }
  }, []);

  // Main video call setup useEffect
  useEffect(() => {
    const init = async () => {
      console.log('Initializing video call...');
      try {
        // Get local stream
        console.log('Requesting media devices...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        console.log('Got local stream:', stream.id);
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connection first
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        });
        peerConnectionRef.current = peerConnection;

        // Add local tracks to peer connection
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        // Handle incoming tracks
        peerConnection.ontrack = (event) => {
          console.log('Received remote track:', event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Connect to socket
        console.log('Connecting to socket server...');
        const socket = io('http://localhost:4000', {
          auth: {
            userId: localStorage.getItem('userId') || Date.now().toString()
          }
        });
        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('Socket connected with ID:', socket.id);
          console.log('Joining room:', roomId);
          socket.emit('join-video-room', roomId);
          setConnectionStatus('Connected to server');
        });

        socket.on('user-joined', async () => {
          console.log('Remote user joined - creating offer');
          setConnectionStatus('Creating offer...');
          try {
            const offer = await peerConnectionRef.current?.createOffer();
            await peerConnectionRef.current?.setLocalDescription(offer);
            console.log('Sending offer:', offer);
            socket.emit('offer', offer, roomId);
          } catch (e) {
            console.error('Error creating offer:', e);
          }
        });

        socket.on('offer', async (offer) => {
          console.log('Received offer:', offer);
          setConnectionStatus('Received offer, creating answer...');
          try {
            await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnectionRef.current?.createAnswer();
            await peerConnectionRef.current?.setLocalDescription(answer);
            console.log('Sending answer:', answer);
            socket.emit('answer', answer, roomId);
          } catch (e) {
            console.error('Error creating answer:', e);
          }
        });

        socket.on('answer', async (answer) => {
          console.log('Received answer:', answer);
          setConnectionStatus('Received answer');
          try {
            await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
          } catch (e) {
            console.error('Error setting remote description:', e);
          }
        });

        socket.on('ice-candidate', async (candidate) => {
          console.log('Received ICE candidate:', candidate);
          try {
            await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error('Error adding ICE candidate:', e);
          }
        });

        // Add ICE candidate event handler
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('Generated ICE candidate for room:', roomId);
            socket.emit('ice-candidate', event.candidate, roomId);
          }
        };

        // Add connection state change handler
        peerConnectionRef.current.onconnectionstatechange = () => {
          console.log('Connection state changed:', peerConnectionRef.current?.connectionState);
          setConnectionStatus('Connection: ' + peerConnectionRef.current?.connectionState);
        };

        // Add ICE connection state change handler
        peerConnectionRef.current.oniceconnectionstatechange = () => {
          console.log('ICE connection state:', peerConnectionRef.current?.iceConnectionState);
          setConnectionStatus('ICE: ' + peerConnectionRef.current?.iceConnectionState);
        };

        // Add signaling state change handler
        peerConnectionRef.current.onsignalingstatechange = () => {
          console.log('Signaling state:', peerConnectionRef.current?.signalingState);
        };

        // Debug socket events
        socket.onAny((eventName, ...args) => {
          console.log('Socket event:', eventName, args);
        });

      } catch (error) {
        console.error('Error in init:', error);
        setConnectionStatus('Error: ' + (error as Error).message);
      }
    };

    init();

    return () => {
      console.log('Cleaning up...');
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        {/* Consultation Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 font-semibold shadow-sm">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('') : ''}
              </div>
              <div className="ml-4">
                <h2 className="font-semibold text-lg text-black">
                  {user?.role === 'DOCTOR' ? `Dr. ${user.name}` : user?.name}
                </h2>
                <p className="text-blue-600">Video Consultation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500">{connectionStatus}</p>
            <button className="text-gray-600 hover:text-gray-800">
              <MoreVertical className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 h-[600px]">
          <div className="bg-black rounded-lg overflow-hidden relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <p className="absolute bottom-4 left-4 text-white text-sm">You</p>
          </div>
          <div className="bg-black rounded-lg overflow-hidden relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <p className="absolute bottom-4 left-4 text-white text-sm">Dr. Sarah Johnson</p>
          </div>
        </div>

        {/* Controls Area */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full ${
                isMuted ? 'bg-red-500' : 'bg-gray-200'
              } hover:opacity-90`}
            >
              {isMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6" />}
            </button>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-4 rounded-full ${
                isVideoOff ? 'bg-red-500' : 'bg-gray-200'
              } hover:opacity-90`}
            >
              {isVideoOff ? <VideoOff className="h-6 w-6 text-white" /> : <Video className="h-6 w-6" />}
            </button>
            <button
              className="p-4 rounded-full bg-red-500 hover:bg-red-600"
              onClick={() => window.history.back()}
            >
              <Phone className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
