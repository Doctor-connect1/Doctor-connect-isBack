'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image from Next.js

type Doctor = {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  isAvailable: boolean;
  profilePicture: string; // Add profilePicture to the Doctor type
};

export default function DoctorSearch() {
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]); // Store filtered doctors based on search
  const [isAvailable, setIsAvailable] = useState(false); // Availability filter
  const [name, setName] = useState(''); // Name search input
  const [specialty, setSpecialty] = useState(''); // Specialty search input
  const [hasSearched, setHasSearched] = useState(false); // Track if the user has searched

  // Fetch doctors whenever search criteria change
  useEffect(() => {
    // Only fetch doctors if the user has started searching (name, specialty, or isAvailable has a value)
    if (name || specialty || isAvailable) {
      const fetchDoctors = async () => {
        try {
          const response = await fetch(
            `http://localhost:3002/api/doctors/search?name=${name}&specialty=${specialty}&isAvailable=${isAvailable}`
          );
          const data = await response.json();

          if (response.ok) {
            setFilteredDoctors(data.data); // Update filtered doctors from the API response
            setHasSearched(true); // Mark that the user has searched
          } else {
            console.error('Error fetching doctors');
          }
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      };

      fetchDoctors(); // Trigger API call
    } else {
      // If no search criteria, clear the results and reset hasSearched
      setFilteredDoctors([]);
      setHasSearched(false);
    }
  }, [name, specialty, isAvailable]); // Dependencies for the useEffect

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Find A Doctor</h2>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Name"
            className="flex-1 min-w-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            value={name}
            onChange={(e) => setName(e.target.value)} // Update name state on change
          />
          <input
            type="text"
            placeholder="Specialty"
            className="flex-1 min-w-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)} // Update specialty state on change
          />
          <div className="flex items-center gap-2">
            <span>Available</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                isAvailable ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ease-in-out ${
                  isAvailable ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6">
          {hasSearched && (name || specialty || isAvailable) ? ( // Only show results if the user has searched and there are search criteria
            filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                    {/* Image container without fixed height */}
                    <div className="relative w-full aspect-square bg-gradient-to-b from-teal-50 to-white">
                      <Image
                        src={doctor.profilePicture} // Use the profile picture URL
                        alt={`${doctor.firstName} ${doctor.lastName}`}
                        fill // Use fill to make the image cover the container
                        style={{ objectFit: 'cover' }} // Ensure the image covers the container
                        className="rounded-t-lg" // Add rounded corners to the top of the image
                      />
                      <h3 className="absolute top-4 right-4 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                        {doctor.isAvailable ? 'Available' : 'Not Available'}
                      </h3>
                    </div>
                    {/* Card content */}
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-teal-600 font-medium mb-2">{doctor.specialty}</p>
                      <p className="text-gray-600 text-sm mb-4">4 years of experience</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No doctors found.</p>
            )
          ) : (
            <p>Start typing or apply filters to search for doctors.</p> // Prompt the user to search
          )}
        </div>
      </div>
    </section>
  );
}