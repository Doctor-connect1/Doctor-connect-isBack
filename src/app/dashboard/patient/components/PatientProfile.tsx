// 'use client';

// import { useState, useEffect } from 'react';

// interface PatientProfileProps {
//   patientId: number;
//   initialData: {
//     firstName: string;
//     lastName: string;
//     medicalHistory: string;
//     email: string;
//     phone: string;
//     dateOfBirth: string;
//     gender: string;
//   };
// }

// export default function PatientProfile({ patientId, initialData }: PatientProfileProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: initialData.firstName,
//     lastName: initialData.lastName,
//     medicalHistory: initialData.medicalHistory,
//     email: initialData.email,
//     phone: initialData.phone,
//     dateOfBirth: initialData.dateOfBirth,
//     gender: initialData.gender,
//   });

//   const handleSave = async () => {
//     try {
//       const response = await fetch(`/api/patients/${patientId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const updatedPatient = await response.json();
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error updating patient data:', error);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   return (
//     <div className="space-y-8 p-6 bg-white rounded-lg shadow-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">Patient Profile</h2>
//         {isEditing ? (
//           <button
//             onClick={handleSave}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Save Changes
//           </button>
//         ) : (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Edit Profile
//           </button>
//         )}
//       </div>

//       <div className="space-y-6">
//         <div>
//           <label className="block text-sm text-gray-500">First Name</label>
//           {isEditing ? (
//             <input
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className="border rounded p-2 w-full mt-1"
//             />
//           ) : (
//             <p className="font-medium">{formData.firstName}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm text-gray-500">Last Name</label>
//           {isEditing ? (
//             <input
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="border rounded p-2 w-full mt-1"
//             />
//           ) : (
//             <p className="font-medium">{formData.lastName}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm text-gray-500">Medical History</label>
//           {isEditing ? (
//             <textarea
//               name="medicalHistory"
//               value={formData.medicalHistory}
//               onChange={handleChange}
//               className="border rounded p-2 w-full mt-1"
//             />
//           ) : (
//             <p className="font-medium">{formData.medicalHistory}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm text-gray-500">Email</label>
//           {isEditing ? (
//             <input
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="border rounded p-2 w-full mt-1"
//             />
//           ) : (
//             <p className="font-medium">{formData.email}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm text-gray-500">Phone</label>
//           {isEditing ? (
//             <input
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="border rounded p-2 w-full mt-1"
//             />
//           ) : (
//             <p className="font-medium">{formData.phone}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm text-gray-500">Date of Birth</label>
//           {isEditing ? (
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={formData.dateOfBirth}
//               onChange={handleChange}
//               className="border rounded p-2 w-full mt-1"
//             />
//           ) : (
//             <p className="font-medium">{formData.dateOfBirth}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm text-gray-500">Gender</label>
//           {isEditing ? (
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="border rounded p-2 w-full mt-1"
//             >
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//           ) : (
//             <p className="font-medium">{formData.gender}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }