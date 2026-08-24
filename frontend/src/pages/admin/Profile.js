import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import SEO from '../../components/common/SEO';
import { profileAPI } from '../../api/endpoints';
import { useAuth } from '../../contexts/AuthContext';
import RichTextEditor from '../../components/common/RichTextEditor';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    profileAPI.get().then(({ data }) => {
      const p = data?.data || data?.profile || data || {};
      reset({
        professionalName: p.professionalName || '',
        currentPosition: p.currentPosition || '',
        headline: p.headline || '',
        email: p.contactInfo?.email || '',
        phone: p.contactInfo?.phone || '',
        website: p.contactInfo?.website || '',
        city: p.location?.city || '',
        country: p.location?.country || '',
        linkedin: p.socialLinks?.linkedin || '',
        twitter: p.socialLinks?.twitter || '',
        googleScholarId: p.identifiers?.googleScholarId || '',
        languages: Array.isArray(p.languages) ? p.languages.join(', ') : '',
      });
      setBio(p.fullBio || p.shortBio || '');
    }).catch(() => {});
  }, [reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        professionalName: formData.professionalName,
        currentPosition: formData.currentPosition,
        headline: formData.headline,
        contactInfo: {
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
        },
        location: {
          city: formData.city || '',
          country: formData.country || '',
        },
        socialLinks: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        },
        identifiers: {
          googleScholarId: formData.googleScholarId,
        },
        languages: formData.languages ? formData.languages.split(',').map(l => l.trim()).filter(Boolean) : [],
        fullBio: bio,
      };
      const { data: result } = await profileAPI.update(payload);
      setUser(result?.data?.user || result?.user || { ...user, professionalName: payload.professionalName });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Edit Profile" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500">Manage your public profile information.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Name</label>
              <input {...register('professionalName', { required: true })} className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              {errors.professionalName && <p className="text-red-500 text-xs mt-1">Required</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
              <input {...register('currentPosition')} className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
              <input {...register('headline')} className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
              <input {...register('languages')} placeholder="e.g. English, French, Kinyarwanda" className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...register('email', { required: true })} type="email" className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input {...register('phone')} className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input {...register('website')} className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Scholar ID</label>
              <input {...register('googleScholarId')} className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input {...register('city')} className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input {...register('country')} className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Bio</h2>
          <RichTextEditor value={bio} onChange={setBio} rows={8} />
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input {...register('linkedin')} className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
              <input {...register('twitter')} className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </>
  );
}
