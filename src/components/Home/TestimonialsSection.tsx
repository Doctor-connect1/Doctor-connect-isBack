'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  experience: number;
  isVerified: boolean;
  user?: {
    media?: {
      url: string;
    }[];
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const TeamMemberCard = ({ doctor }: { doctor: Doctor }) => {
  const [imageLoading, setImageLoading] = useState(true);

  const handleSocialClick = (url: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-72 bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-80 w-full bg-gradient-to-b from-teal-50 to-white">
        <div className={`absolute inset-0 bg-gray-200 ${imageLoading ? 'animate-pulse' : 'hidden'}`} />
        <Image
          src={doctor.user?.media?.[0]?.url || '/api/placeholder/400/320'}
          alt={`${doctor.firstName} ${doctor.lastName}`}
          fill
          className={`object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setImageLoading(false)}
        />
        {doctor.isVerified && (
          <div className="absolute top-4 right-4 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-1 doctor-name">
          {doctor.firstName} {doctor.lastName}
        </h3>
        <p className="text-teal-600 font-medium mb-2 specialty">{doctor.specialty}</p>
        <p className="text-gray-600 text-sm mb-4 experience">{doctor.experience} years of experience</p>

        {/* Social Links */}
        <div className="flex justify-center gap-3 social-icons">
          {doctor.socialLinks?.facebook && (
            <button
              onClick={() => handleSocialClick(doctor.socialLinks!.facebook!)}
              className="p-2 rounded-full bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </button>
          )}
          {doctor.socialLinks?.twitter && (
            <button
              onClick={() => handleSocialClick(doctor.socialLinks!.twitter!)}
              className="p-2 rounded-full bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </button>
          )}
          {doctor.socialLinks?.instagram && (
            <button
              onClick={() => handleSocialClick(doctor.socialLinks!.instagram!)}
              className="p-2 rounded-full bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </button>
          )}
          {doctor.socialLinks?.linkedin && (
            <button
              onClick={() => handleSocialClick(doctor.socialLinks!.linkedin!)}
              className="p-2 rounded-full bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TeamSection = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/allDoctors');
        const result = await response.json();
        setDoctors(result.data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.querySelector('.scroll-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Doctors</h2>
          <div className="w-24 h-1 bg-teal-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team of qualified medical professionals is here to provide you with the best healthcare services.
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative">
          <div className="scroll-container overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <div className="flex gap-6 p-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="snap-center">
                  <TeamMemberCard doctor={doctor} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg text-teal-600 hover:text-teal-700 hover:shadow-xl transition-all focus:outline-none"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg text-teal-600 hover:text-teal-700 hover:shadow-xl transition-all focus:outline-none"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;