'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { FileUpload } from '@/components/FileUpload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LogOut, MessageSquare } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { token, logout } = useAuthStore();
  const [datasets, setDatasets] = useState<any[]>([]);

  const fetchDatasets = async () => {
    try {
      const { data } = await api.get('/datasets/');
      setDatasets(data);
    } catch (error) {
      console.error('Failed to fetch datasets', error);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      fetchDatasets();
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Data Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="text-black">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Upload New Dataset</h2>
          <FileUpload onUploadSuccess={fetchDatasets} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Datasets</h2>
          <div className="rounded-md border border-zinc-800">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableHead className="text-zinc-400">Filename</TableHead>
                  <TableHead className="text-zinc-400">Rows</TableHead>
                  <TableHead className="text-zinc-400">Upload Date</TableHead>
                  <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasets.length === 0 ? (
                  <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                    <TableCell colSpan={4} className="text-center text-zinc-500 py-8">
                      No datasets uploaded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  datasets.map((ds) => (
                    <TableRow key={ds.id} className="border-zinc-800 hover:bg-zinc-900/50">
                      <TableCell className="font-medium">{ds.filename}</TableCell>
                      <TableCell>{ds.row_count}</TableCell>
                      <TableCell>{new Date(ds.upload_time).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="secondary" size="sm" onClick={() => router.push(`/chat/${ds.id}`)}>
                          <MessageSquare className="mr-2 h-4 w-4" /> Analyze
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
