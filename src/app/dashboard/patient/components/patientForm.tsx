// 'use client';

// import { useState } from 'react';

// export default function AddPatientForm() {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     medicalHistory: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     gender: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/patients', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const newPatient = await response.json();
//       console.log('New patient added:', newPatient);
//       // Optionally, redirect or show a success message
//     } catch (error) {
//       console.error('Error adding new patient:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
//       <div>
//         <label className="block text-sm text-gray-500">First Name</label>
//         <input
//           type="text"
//           name="firstName"
//           value={formData.firstName}
//           onChange={handleChange}
//           className="border rounded p-2 w-full mt-1"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm text-gray-500">Last Name</label>
//         <input
//           type="text"
//           name="lastName"
//           value={formData.lastName}
//           onChange={handleChange}
//           className="border rounded p-2 w-full mt-1"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm text-gray-500">Medical History</label>
//         <textarea
//           name="medicalHistory"
//           value={formData.medicalHistory}
//           onChange={handleChange}
//           className="border rounded p-2 w-full mt-1"
//         />
//       </div>
//       <div>
//         <label className="block text-sm text-gray-500">Email</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           className="border rounded p-2 w-full mt-1"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm text-gray-500">Phone</label>
//         <input
//           type="tel"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           className="border rounded p-2 w-full mt-1"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm text-gray-500">Date of Birth</label>
//         <input
//           type="date"
//           name="dateOfBirth"
//           value={formData.dateOfBirth}
//           onChange={handleChange}
//           className="border rounded p-2 w-full mt-1"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm text-gray-500">Gender</label>
//         <select
//           name="gender"
//           value={formData.gender}
//           onChange={handleChange}
//           className="border rounded p-2 w-full mt-1"
//           required
//         >
//           <option value="">Select Gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//         </select>
//       </div>
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Add Patient
//       </button>
//     </form>
//   );
// }