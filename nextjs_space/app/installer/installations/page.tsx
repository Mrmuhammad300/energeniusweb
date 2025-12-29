'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { MapPin, Calendar, Clock, CheckCircle2, AlertCircle, MessageSquare, Upload, Package } from 'lucide-react';

interface Installation {
  id: string;
  installationNumber: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  priority: string;
  customerName: string;
  customerPhone: string;
  installationAddress: string;
  scheduledDate: string | null;
  estimatedDuration: number | null;
  products: string[];
  productNames: string[];
  hasIssues: boolean;
  updates: any[];
  messages: any[];
}

export default function InstallerInstallationsPage() {
  const router = useRouter();
  const { data: session, status } = useSession() || {};
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [filteredInstallations, setFilteredInstallations] = useState<Installation[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  // Update form state
  const [updateForm, setUpdateForm] = useState({
    title: '',
    description: '',
    updateType: 'progress',
    progressPercent: 0,
    hasIssues: false,
    issueDescription: '',
  });

  // Complete form state
  const [completeForm, setCompleteForm] = useState({
    completionNotes: '',
  });

  // Message form state
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    messageType: 'general',
    priority: 'normal',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchInstallations();
    }
  }, [status, router]);

  useEffect(() => {
    filterInstallations();
  }, [installations, activeTab]);

  const fetchInstallations = async () => {
    try {
      const response = await fetch('/api/installer/installations');
      if (!response.ok) throw new Error('Failed to fetch installations');
      const data = await response.json();
      setInstallations(data.installations || []);
    } catch (error: any) {
      console.error('Error fetching installations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch installations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterInstallations = () => {
    let filtered = installations;

    switch (activeTab) {
      case 'pending':
        filtered = installations.filter((i) => i.status === 'assigned' || i.status === 'pending');
        break;
      case 'active':
        filtered = installations.filter((i) => i.status === 'in_progress');
        break;
      case 'completed':
        filtered = installations.filter((i) => i.status === 'completed');
        break;
    }

    setFilteredInstallations(filtered);
  };

  const handleSubmitUpdate = async () => {
    if (!selectedInstallation) return;

    try {
      const response = await fetch(`/api/installer/installations/${selectedInstallation.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm),
      });

      if (!response.ok) throw new Error('Failed to submit update');

      toast({
        title: 'Success',
        description: 'Progress update submitted successfully',
      });

      setShowUpdateDialog(false);
      resetUpdateForm();
      fetchInstallations();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleComplete = async () => {
    if (!selectedInstallation) return;

    try {
      const response = await fetch(`/api/installer/installations/${selectedInstallation.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeForm),
      });

      if (!response.ok) throw new Error('Failed to complete installation');

      toast({
        title: 'Success',
        description: 'Installation marked as completed',
      });

      setShowCompleteDialog(false);
      setCompleteForm({ completionNotes: '' });
      fetchInstallations();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedInstallation) return;

    try {
      const response = await fetch(`/api/admin/installations/${selectedInstallation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...messageForm,
          receiverRole: 'sales_rep',
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast({
        title: 'Success',
        description: 'Message sent successfully',
      });

      setShowMessageDialog(false);
      setMessageForm({ subject: '', message: '', messageType: 'general', priority: 'normal' });
      fetchInstallations();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetUpdateForm = () => {
    setUpdateForm({
      title: '',
      description: '',
      updateType: 'progress',
      progressPercent: 0,
      hasIssues: false,
      issueDescription: '',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-gray-500', label: 'Pending' },
      assigned: { color: 'bg-blue-500', label: 'Assigned' },
      in_progress: { color: 'bg-yellow-500', label: 'In Progress' },
      completed: { color: 'bg-green-500', label: 'Completed' },
      cancelled: { color: 'bg-red-500', label: 'Cancelled' },
      on_hold: { color: 'bg-orange-500', label: 'On Hold' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, string> = {
      low: 'bg-gray-500',
      normal: 'bg-blue-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500',
    };

    return <Badge className={priorityConfig[priority] || priorityConfig.normal}>{priority.toUpperCase()}</Badge>;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading installations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Installation Jobs</h1>
        <p className="text-gray-600 mt-2">
          View and manage your assigned installation jobs
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{installations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {installations.filter((i) => i.status === 'assigned' || i.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {installations.filter((i) => i.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {installations.filter((i) => i.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Jobs ({installations.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({installations.filter((i) => i.status === 'assigned' || i.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({installations.filter((i) => i.status === 'in_progress').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({installations.filter((i) => i.status === 'completed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredInstallations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No installations found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredInstallations.map((installation) => (
                <Card key={installation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{installation.title}</CardTitle>
                          {getStatusBadge(installation.status)}
                          {getPriorityBadge(installation.priority)}
                          {installation.hasIssues && (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Issues Reported
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm">
                          {installation.installationNumber} • {installation.customerName}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        {installation.progress}% Complete
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{installation.installationAddress}</span>
                        </div>
                        {installation.scheduledDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{new Date(installation.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>
                            {installation.estimatedDuration ? `${installation.estimatedDuration} hours` : 'TBD'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span>{installation.productNames.join(', ')}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{installation.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${installation.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedInstallation(installation);
                            setShowUpdateDialog(true);
                          }}
                          disabled={installation.status === 'completed'}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Update
                        </Button>
                        {installation.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={() => {
                              setSelectedInstallation(installation);
                              setShowCompleteDialog(true);
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedInstallation(installation);
                            setShowMessageDialog(true);
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Sales Rep ({installation.messages.length})
                        </Button>
                      </div>

                      {/* Recent Updates */}
                      {installation.updates.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold mb-2">Recent Updates</h4>
                          <div className="space-y-2">
                            {installation.updates.slice(0, 2).map((update, idx) => (
                              <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                                <div className="font-medium">{update.title}</div>
                                <div className="text-gray-600 text-xs">
                                  {new Date(update.createdAt).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Progress Update</DialogTitle>
            <DialogDescription>
              {selectedInstallation?.installationNumber} - {selectedInstallation?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Update Title *</Label>
              <Input
                id="title"
                value={updateForm.title}
                onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                placeholder="Brief summary of update"
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={updateForm.description}
                onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                placeholder="Detailed description of work completed"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="updateType">Update Type</Label>
                <Select
                  value={updateForm.updateType}
                  onValueChange={(value) => setUpdateForm({ ...updateForm, updateType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="progress">Progress Update</SelectItem>
                    <SelectItem value="issue">Issue Report</SelectItem>
                    <SelectItem value="note">General Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="progressPercent">Progress %</Label>
                <Input
                  id="progressPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={updateForm.progressPercent}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, progressPercent: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitUpdate}>Submit Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Installation Complete</DialogTitle>
            <DialogDescription>
              {selectedInstallation?.installationNumber} - {selectedInstallation?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="completionNotes">Completion Notes</Label>
              <Textarea
                id="completionNotes"
                value={completeForm.completionNotes}
                onChange={(e) => setCompleteForm({ ...completeForm, completionNotes: e.target.value })}
                placeholder="Final notes about the installation"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              Mark as Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to Sales Rep</DialogTitle>
            <DialogDescription>
              {selectedInstallation?.installationNumber} - {selectedInstallation?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={messageForm.subject}
                onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                placeholder="Message subject"
              />
            </div>
            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={messageForm.message}
                onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                placeholder="Your message"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="messageType">Type</Label>
                <Select
                  value={messageForm.messageType}
                  onValueChange={(value) => setMessageForm({ ...messageForm, messageType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="issue">Issue</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={messageForm.priority}
                  onValueChange={(value) => setMessageForm({ ...messageForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Show recent messages */}
            {selectedInstallation && selectedInstallation.messages.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">Recent Messages</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedInstallation.messages.slice(0, 3).map((msg, idx) => (
                    <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                      <div className="font-medium">
                        {msg.sender.name} ({msg.sender.role})
                      </div>
                      <div className="text-gray-600">{msg.message.substring(0, 100)}...</div>
                      <div className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
