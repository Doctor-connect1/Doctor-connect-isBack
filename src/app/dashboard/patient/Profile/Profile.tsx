import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface ProfileProps {
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    medicalHistory?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
  }) => void;
  initialData: {
    id: string;
    firstName: string;
    lastName: string;
    medicalHistory: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
  };
  updateNavbarName: (name: string) => void;
  isNewProfile?: boolean;
  patientId: string;
}

const Profile = ({ updateProfile, initialData, updateNavbarName, isNewProfile = false, patientId }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(isNewProfile);
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    medicalHistory: initialData?.medicalHistory || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    gender: initialData?.gender || '',
  });

  const handleSave = async () => {
    try {
      const url = isNewProfile 
        ? 'http://localhost:3000/api/patients' // Create profile
        : `http://localhost:3000/api/patients/${patientId}`; // Update profile with patientId

      const method = isNewProfile ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const savedData = await response.json();
      updateProfile(savedData);
      updateNavbarName(`${formData.firstName} ${formData.lastName}`);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{isNewProfile ? 'Create Profile' : 'Edit Profile'}</h2>
          {isEditing ? (
            <button 
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isNewProfile ? 'Create Profile' : 'Save Changes'}
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile form inputs go here */}
        <div className="space-y-6">
          {/* Render form fields as before */}
          {/* Example for 'First Name' */}
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">First Name</p>
              {isEditing ? (
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border rounded p-2 w-full mt-1"
                />
              ) : (
                <p className="font-medium">{formData.firstName}</p>
              )}
            </div>
          </div>
          {/* Repeat for other fields like 'Last Name', 'Medical History', etc. */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
