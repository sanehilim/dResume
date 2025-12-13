'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    skills: [''],
    education: [{ institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
    experience: [{ company: '', title: '', location: '', startDate: '', endDate: '', description: '' }],
    certifications: [{ name: '', issuer: '', date: '', url: '' }],
    projects: [{ name: '', description: '', technologies: [''], url: '', githubUrl: '' }],
  });

  const addItem = (field: 'skills' | 'education' | 'experience' | 'certifications' | 'projects') => {
    setFormData(prev => {
      if (field === 'skills') {
        return { ...prev, skills: [...prev.skills, ''] };
      } else if (field === 'education') {
        return { ...prev, education: [...prev.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }] };
      } else if (field === 'experience') {
        return { ...prev, experience: [...prev.experience, { company: '', title: '', location: '', startDate: '', endDate: '', description: '' }] };
      } else if (field === 'certifications') {
        return { ...prev, certifications: [...prev.certifications, { name: '', issuer: '', date: '', url: '' }] };
      } else {
        return { ...prev, projects: [...prev.projects, { name: '', description: '', technologies: [''], url: '', githubUrl: '' }] };
      }
    });
  };

  const removeItem = (field: 'skills' | 'education' | 'experience' | 'certifications' | 'projects', index: number) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const filteredData = {
        ...formData,
        skills: formData.skills.filter(s => s.trim()),
        education: formData.education.filter(e => e.institution.trim()),
        experience: formData.experience.filter(e => e.company.trim()),
        certifications: formData.certifications.filter(c => c.name.trim()),
        projects: formData.projects.filter(p => p.name.trim()).map(p => ({
          ...p,
          technologies: p.technologies.filter(t => t.trim())
        })),
      };

      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, ...filteredData }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Resume uploaded successfully!');
        router.push(`/verify?resumeId=${data.resume._id}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to upload resume');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Upload Resume</h1>
          <p className="text-sky-600">Fill in your professional details to create a verifiable credential</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-card border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-900">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sky-700">Full Name *</Label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="border-sky-200 focus:border-sky-400"
                  />
                </div>
                <div>
                  <Label className="text-sky-700">Email *</Label>
                  <Input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="border-sky-200 focus:border-sky-400"
                  />
                </div>
                <div>
                  <Label className="text-sky-700">Phone (Optional)</Label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="border-sky-200 focus:border-sky-400"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sky-700">Professional Summary (Optional)</Label>
                <Textarea 
                  rows={4}
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  className="border-sky-200 focus:border-sky-400"
                  placeholder="Brief overview of your professional background..."
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sky-700">LinkedIn URL (Optional)</Label>
                  <Input 
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                    className="border-sky-200 focus:border-sky-400"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label className="text-sky-700">GitHub URL (Optional)</Label>
                  <Input 
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    className="border-sky-200 focus:border-sky-400"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <Label className="text-sky-700">Portfolio URL (Optional)</Label>
                  <Input 
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                    className="border-sky-200 focus:border-sky-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-sky-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sky-900">Skills *</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem('skills')} className="border-sky-300 text-sky-700">
                  <Plus className="w-4 h-4 mr-1" /> Add Skill
                </Button>
              </div>
              <CardDescription className="text-sky-600">Add at least one skill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Input 
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...formData.skills];
                        newSkills[index] = e.target.value;
                        setFormData(prev => ({ ...prev, skills: newSkills }));
                      }}
                      className="w-32 border-sky-200 focus:border-sky-400"
                      placeholder="Skill name"
                    />
                    {formData.skills.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem('skills', index)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-sky-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sky-900">Education *</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem('education')} className="border-sky-300 text-sky-700">
                  <Plus className="w-4 h-4 mr-1" /> Add Education
                </Button>
              </div>
              <CardDescription className="text-sky-600">Add at least one education entry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 border border-sky-200 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-sky-700">Education #{index + 1}</span>
                    {formData.education.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem('education', index)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input placeholder="Institution" value={edu.institution} onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].institution = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }} className="border-sky-200" />
                    <Input placeholder="Degree" value={edu.degree} onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].degree = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }} className="border-sky-200" />
                    <Input placeholder="Field of Study" value={edu.field} onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].field = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }} className="border-sky-200" />
                    <Input placeholder="GPA" value={edu.gpa} onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].gpa = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }} className="border-sky-200" />
                    <Input type="date" placeholder="Start Date" value={edu.startDate} onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].startDate = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }} className="border-sky-200" />
                    <Input type="date" placeholder="End Date" value={edu.endDate} onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].endDate = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }} className="border-sky-200" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-sky-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sky-900">Experience (Optional)</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem('experience')} className="border-sky-300 text-sky-700">
                  <Plus className="w-4 h-4 mr-1" /> Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.experience.map((exp, index) => (
                <div key={index} className="p-4 border border-sky-200 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-sky-700">Experience #{index + 1}</span>
                    {formData.experience.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem('experience', index)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input placeholder="Company" value={exp.company} onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].company = e.target.value;
                      setFormData(prev => ({ ...prev, experience: newExp }));
                    }} className="border-sky-200" />
                    <Input placeholder="Job Title" value={exp.title} onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].title = e.target.value;
                      setFormData(prev => ({ ...prev, experience: newExp }));
                    }} className="border-sky-200" />
                    <Input placeholder="Location" value={exp.location} onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].location = e.target.value;
                      setFormData(prev => ({ ...prev, experience: newExp }));
                    }} className="border-sky-200" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" value={exp.startDate} onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index].startDate = e.target.value;
                        setFormData(prev => ({ ...prev, experience: newExp }));
                      }} className="border-sky-200" />
                      <Input type="date" value={exp.endDate} onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index].endDate = e.target.value;
                        setFormData(prev => ({ ...prev, experience: newExp }));
                      }} className="border-sky-200" />
                    </div>
                  </div>
                  <Textarea placeholder="Description" value={exp.description} onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[index].description = e.target.value;
                    setFormData(prev => ({ ...prev, experience: newExp }));
                  }} className="border-sky-200" rows={3} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-sky-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sky-900">Projects (Optional)</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem('projects')} className="border-sky-300 text-sky-700">
                  <Plus className="w-4 h-4 mr-1" /> Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.projects.map((proj, index) => (
                <div key={index} className="p-4 border border-sky-200 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-sky-700">Project #{index + 1}</span>
                    {formData.projects.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem('projects', index)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input placeholder="Project Name" value={proj.name} onChange={(e) => {
                      const newProj = [...formData.projects];
                      newProj[index].name = e.target.value;
                      setFormData(prev => ({ ...prev, projects: newProj }));
                    }} className="border-sky-200" />
                    <Input placeholder="Live URL" value={proj.url} onChange={(e) => {
                      const newProj = [...formData.projects];
                      newProj[index].url = e.target.value;
                      setFormData(prev => ({ ...prev, projects: newProj }));
                    }} className="border-sky-200" />
                    <Input placeholder="GitHub URL" value={proj.githubUrl} onChange={(e) => {
                      const newProj = [...formData.projects];
                      newProj[index].githubUrl = e.target.value;
                      setFormData(prev => ({ ...prev, projects: newProj }));
                    }} className="border-sky-200 md:col-span-2" />
                  </div>
                  <Textarea placeholder="Project Description" value={proj.description} onChange={(e) => {
                    const newProj = [...formData.projects];
                    newProj[index].description = e.target.value;
                    setFormData(prev => ({ ...prev, projects: newProj }));
                  }} className="border-sky-200" rows={2} />
                  <Input placeholder="Technologies (comma separated)" value={proj.technologies.join(', ')} onChange={(e) => {
                    const newProj = [...formData.projects];
                    newProj[index].technologies = e.target.value.split(',').map(t => t.trim());
                    setFormData(prev => ({ ...prev, projects: newProj }));
                  }} className="border-sky-200" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-sky-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sky-900">Certifications (Optional)</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem('certifications')} className="border-sky-300 text-sky-700">
                  <Plus className="w-4 h-4 mr-1" /> Add Certification
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="p-4 border border-sky-200 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-sky-700">Certification #{index + 1}</span>
                    {formData.certifications.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem('certifications', index)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input placeholder="Certification Name" value={cert.name} onChange={(e) => {
                      const newCert = [...formData.certifications];
                      newCert[index].name = e.target.value;
                      setFormData(prev => ({ ...prev, certifications: newCert }));
                    }} className="border-sky-200" />
                    <Input placeholder="Issuer" value={cert.issuer} onChange={(e) => {
                      const newCert = [...formData.certifications];
                      newCert[index].issuer = e.target.value;
                      setFormData(prev => ({ ...prev, certifications: newCert }));
                    }} className="border-sky-200" />
                    <Input type="date" value={cert.date} onChange={(e) => {
                      const newCert = [...formData.certifications];
                      newCert[index].date = e.target.value;
                      setFormData(prev => ({ ...prev, certifications: newCert }));
                    }} className="border-sky-200" />
                    <Input placeholder="Certificate URL" value={cert.url} onChange={(e) => {
                      const newCert = [...formData.certifications];
                      newCert[index].url = e.target.value;
                      setFormData(prev => ({ ...prev, certifications: newCert }));
                    }} className="border-sky-200" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard')} className="border-sky-300 text-sky-700">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save & Continue to Verification
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}