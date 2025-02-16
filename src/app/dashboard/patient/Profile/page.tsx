// app/dashboard/patient/Profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Profile from './Profile';

// Define the interface for patient data
interface PatientData {
  id: string; // Ensure id is included
  firstName: string;
  lastName: string;
  medicalHistory: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

const PatientProfilePage = ({ params }: { params: Promise<{ patientId: string }> }) => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null); // State to hold patientId

  useEffect(() => {
    // Resolve the params promise
    params.then((resolvedParams) => {
      console.log('Resolved Params:', resolvedParams); // Log resolved params
      if (resolvedParams.patientId) {
        setPatientId(resolvedParams.patientId); // Set patientId from resolved params
      } else {
        setError('Patient ID is missing in resolved params');
      }
    }).catch((err) => {
      console.error('Error resolving params:', err);
      setError('Error resolving patient ID');
    });
  }, [params]);

  useEffect(() => {
    if (!patientId) {
      return; // Don't fetch if patientId is not set
    }

    const fetchPatientData = async () => {
      const response = await fetch(`/api/patient/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setPatientData(data);
      } else {
        console.error('Error fetching patient data');
        setError('Error fetching patient data');
      }
    };

    fetchPatientData();
  }, [patientId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!patientData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Patient Profile</h1>
      <Profile 
        initialData={patientData} 
        updateProfile={() => {}} 
        updateNavbarName={() => {}} 
        isNewProfile={false} 
        patientId={patientId!} // Use non-null assertion if you're sure patientId is not null
      />
    </div>
  );
};

export default PatientProfilePage;
