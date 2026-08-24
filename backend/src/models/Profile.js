import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  professionalName: { type: String, required: true },
  headline: String,
  profileImage: String,
  coverImage: String,
  shortBio: String,
  fullBio: String,
  professionalSummary: String,
  academicSummary: String,
  researchInterests: [String],
  professionalMission: String,
  professionalVision: String,
  areasOfSpecialization: [String],
  currentPosition: String,
  location: {
    city: String,
    country: String
  },
  contactInfo: {
    email: String,
    phone: String,
    website: String
  },
  socialLinks: {
    linkedin: String,
    orcid: String,
    googleScholar: String,
    researchGate: String,
    personalWebsite: String,
    twitter: String
  },
  identifiers: {
    orcid: String,
    googleScholarId: String,
    researchGateId: String
  },
  languages: [String],
  seoTitle: String,
  seoDescription: String,
  canonicalUrl: String
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
