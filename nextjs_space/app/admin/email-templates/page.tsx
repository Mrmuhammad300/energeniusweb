'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileType, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates');
      if (response.ok) {
        setTemplates(await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      supplier: { variant: 'default', label: 'Supplier' },
      customer: { variant: 'secondary', label: 'Customer' },
      internal: { variant: 'outline', label: 'Internal' },
    };
    const { variant, label } = config[category] || config.internal;
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Email Templates</h1>
            <p className="text-gray-600">Manage email templates for automated communications</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Templates</div>
          <div className="text-2xl font-bold">{templates.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Supplier Templates</div>
          <div className="text-2xl font-bold text-green-600">
            {templates.filter(t => t.category === 'supplier').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Customer Templates</div>
          <div className="text-2xl font-bold text-blue-600">
            {templates.filter(t => t.category === 'customer').length}
          </div>
        </Card>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileType className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  {getCategoryBadge(template.category)}
                  {template.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                {template.description && (
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                )}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Subject:</span> {template.subject}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTemplate(template);
                  setViewDialogOpen(true);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Template
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Category</div>
                {getCategoryBadge(selectedTemplate.category)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Subject</div>
                <div className="p-3 bg-gray-50 rounded border">{selectedTemplate.subject}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Body</div>
                <Textarea
                  value={selectedTemplate.body}
                  readOnly
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              {selectedTemplate.variables && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Available Variables</div>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(selectedTemplate.variables).map((variable: string) => (
                      <Badge key={variable} variant="secondary">
                        {'{{' + variable + '}}'}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
