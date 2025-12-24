'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  UserCog,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  status: string;
  hireDate: string | null;
  terminationDate: string | null;
  notes: string | null;
  createdAt: string;
}

export default function TeamMemberViewPage() {
  const router = useRouter();
  const params = useParams();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchMember();
    }
  }, [params.id]);

  const fetchMember = async () => {
    try {
      const response = await fetch(`/api/admin/team/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setMember(data);
      } else if (response.status === 404) {
        toast({
          title: 'Error',
          description: 'Team member not found',
          variant: 'destructive',
        });
        router.push('/admin/team');
      }
    } catch (error) {
      console.error('Error fetching team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading team member...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-600">Team member not found</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      inactive: 'secondary',
      terminated: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
        {role === 'admin' ? 'Admin' : 'Staff'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/team">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {member.firstName} {member.lastName}
            </h1>
            <p className="text-gray-600 mt-1">Team Member Details</p>
          </div>
        </div>
        <Link href={`/admin/team/${member.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Team Member
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Status</div>
          <div className="mt-2">{getStatusBadge(member.status)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Role</div>
          <div className="mt-2">{getRoleBadge(member.role)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Department</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {member.department || 'Not Assigned'}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <a href={`mailto:${member.email}`} className="hover:text-green-600">
                  {member.email}
                </a>
              </div>
            </div>
            {member.phone && (
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <a href={`tel:${member.phone}`} className="hover:text-green-600">
                    {member.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Employment Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Employment Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <UserCog className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Role</div>
                <div className="capitalize">{member.role}</div>
              </div>
            </div>
            {member.department && (
              <div className="flex items-center gap-3 text-gray-700">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Department</div>
                  <div className="capitalize">{member.department}</div>
                </div>
              </div>
            )}
            {member.hireDate && (
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Hire Date</div>
                  <div>{new Date(member.hireDate).toLocaleDateString()}</div>
                </div>
              </div>
            )}
            {member.terminationDate && (
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-5 w-5 text-red-400" />
                <div>
                  <div className="text-sm text-gray-500">Termination Date</div>
                  <div>{new Date(member.terminationDate).toLocaleDateString()}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Added to System</div>
                <div>{new Date(member.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Notes */}
      {member.notes && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Internal Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{member.notes}</p>
        </Card>
      )}
    </div>
  );
}
