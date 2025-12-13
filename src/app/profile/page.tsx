'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Github, Linkedin, Globe, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    avatarUrl: '',
    location: '',
    company: '',
    jobTitle: '',
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: ''
  });

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
    loadProfile();
  }, [isConnected, address]);

  const loadProfile = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/profile?walletAddress=${address}`);
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!address) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          ...profile
        })
      });

      if (response.ok) {
        alert('Profile saved successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to save profile: ${error.message}`);
      }
    } catch (error) {
      alert('Error saving profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">My Profile</h1>
            <p className="text-sky-600">Manage your professional information</p>
          </div>

          <Card className="glass-card border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-900">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sky-700">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="John Doe"
                        className="bg-white border-sky-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sky-700">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="john@example.com"
                        className="bg-white border-sky-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-sky-700">
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        value={profile.jobTitle}
                        onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                        placeholder="Software Engineer"
                        className="bg-white border-sky-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sky-700">Company</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        placeholder="Tech Corp"
                        className="bg-white border-sky-200"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location" className="text-sky-700">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="San Francisco, CA"
                        className="bg-white border-sky-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sky-700">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="bg-white border-sky-200"
                    />
                  </div>

                  <div className="space-y-4 pt-6 border-t border-sky-200">
                    <h3 className="text-lg font-semibold text-sky-900">Social Links</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="github" className="text-sky-700">
                        <Github className="w-4 h-4 inline mr-2" />
                        GitHub
                      </Label>
                      <Input
                        id="github"
                        value={profile.githubUrl}
                        onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                        placeholder="https://github.com/username"
                        className="bg-white border-sky-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-sky-700">
                        <Linkedin className="w-4 h-4 inline mr-2" />
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        value={profile.linkedinUrl}
                        onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="bg-white border-sky-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sky-700">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={profile.websiteUrl}
                        onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="bg-white border-sky-200"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
