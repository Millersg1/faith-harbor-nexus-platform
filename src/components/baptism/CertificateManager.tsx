import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Mail, Printer, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  certificate_number: string;
  recipient_name: string;
  issued_date: string;
  printed: boolean;
  mailed: boolean;
  created_at: string;
}

interface CertificateManagerProps {
  onRefresh: () => void;
}

export const CertificateManager: React.FC<CertificateManagerProps> = ({
  onRefresh
}) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('baptism_certificates')
        .select('*')
        .order('issued_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error loading certificates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsPrinted = async (certificateId: string) => {
    try {
      const { error } = await supabase
        .from('baptism_certificates')
        .update({ printed: true })
        .eq('id', certificateId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Certificate marked as printed",
      });

      loadCertificates();
    } catch (error) {
      console.error('Error updating certificate:', error);
      toast({
        title: "Error",
        description: "Failed to update certificate status",
        variant: "destructive",
      });
    }
  };

  const markAsMailed = async (certificateId: string) => {
    try {
      const { error } = await supabase
        .from('baptism_certificates')
        .update({ mailed: true })
        .eq('id', certificateId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Certificate marked as mailed",
      });

      loadCertificates();
    } catch (error) {
      console.error('Error updating certificate:', error);
      toast({
        title: "Error",
        description: "Failed to update certificate status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Certificate Management</h3>
          <p className="text-muted-foreground">Manage baptism certificates and their distribution</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Generate Certificate
        </Button>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Certificates Issued</h3>
            <p className="text-muted-foreground mb-4">
              Certificates will appear here once they are generated for completed baptisms
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate First Certificate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Award className="h-5 w-5 text-gold" />
                    <span>{certificate.recipient_name}</span>
                  </CardTitle>
                </div>
                <CardDescription>
                  Certificate #{certificate.certificate_number}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    <strong>Issued:</strong> {new Date(certificate.issued_date).toLocaleDateString()}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={certificate.printed ? "default" : "secondary"}>
                      {certificate.printed ? '✓ Printed' : 'Not Printed'}
                    </Badge>
                    <Badge variant={certificate.mailed ? "default" : "secondary"}>
                      {certificate.mailed ? '✓ Mailed' : 'Not Mailed'}
                    </Badge>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    {!certificate.printed && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => markAsPrinted(certificate.id)}
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Printed
                      </Button>
                    )}
                    {!certificate.mailed && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => markAsMailed(certificate.id)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Mailed
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};