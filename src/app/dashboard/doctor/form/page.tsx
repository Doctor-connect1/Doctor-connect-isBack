'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button, Input, Label } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [profilePicture, setProfilePicture] = useState(null);

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gray-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form 
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full space-y-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-700 text-center">Doctor Registration</h2>
        
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center">
          <input type="file" accept="image/*" className="hidden" id="file-upload" onChange={handleFileChange} />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-teal-500" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-teal-500">
                <Upload className="text-teal-500 w-8 h-8" />
              </div>
            )}
            <span className="text-teal-500 text-sm">Upload Profile Picture</span>
          </label>
        </div>

        {/* Input Fields */}
        {['name', 'email', 'phone', 'speciality', 'experience', 'password', 'bio'].map((field, index) => (
          <div key={index}>
            <Label htmlFor={field} className="text-gray-600 font-medium capitalize">{field}</Label>
            <Input id={field} type={field === 'password' ? 'password' : 'text'} {...register(field, { required: true })} className="w-full p-3 border rounded-md" />
            {errors[field] && <span className="text-red-500 text-sm">{field} is required</span>}
          </div>
        ))}

        <motion.button 
          type="submit" 
          className="w-full bg-teal-500 text-white py-3 rounded-md font-medium hover:bg-teal-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
