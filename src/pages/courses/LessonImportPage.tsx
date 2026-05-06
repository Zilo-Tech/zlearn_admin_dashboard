import React, { useState, useCallback } from 'react';
import { AdminLayout } from '../../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/common';
import { useImportLessonPackageMutation } from '../../store/api/examsApi';
import { FileJson, Upload, CheckCircle, XCircle } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const validateJsonFile = (file: File): Promise<Record<string, any>> => {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.json')) {
      reject(new Error('Please select a JSON file'));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error('File too large (max 10MB)'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse((e.target?.result as string) || '{}');
        resolve(content);
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const LessonImportPage: React.FC = () => {
  const [importLesson, { isLoading }] = useImportLessonPackageMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await validateJsonFile(file);
      setSelectedFile(file);
      setPreview(content);
      setError(null);
      setResult(null);
    } catch (err: any) {
      setError(err.message || 'Invalid file');
      setSelectedFile(null);
      setPreview(null);
    }
    e.target.value = '';
  }, []);

  const handleImport = async () => {
    if (!selectedFile) return;
    setError(null);
    setResult(null);
    try {
      const data = await importLesson({ moduleId, file: selectedFile }).unwrap();
      setResult(data);
      setSelectedFile(null);
      setPreview(null);
    } catch (err: any) {
      const msg = err?.data?.error || err?.message || 'Import failed';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setResult(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Import Lessons (JSON)</h1>
          <p className="text-gray-500 mt-1">Upload lesson JSON and attach to an existing module (provide `module_id`).</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Target Module</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">Enter the target `module_id` (required) to attach imported lessons.</p>
            <input
              type="text"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              placeholder="Module ID (e.g. 123)"
              className="w-64 px-3 py-2 border rounded"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload JSON File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input type="file" accept=".json,application/json" onChange={handleFileSelect} id="lessonFile" className="hidden" />
              <label htmlFor="lessonFile" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="font-medium">Choose JSON File</span>
                <span className="text-sm text-gray-500">or drag and drop · Max 10MB</span>
              </label>
            </div>

            {selectedFile && (
              <div className="mt-3 flex items-center justify-between p-3 bg-surface-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-zlearn-primary" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setSelectedFile(null); setPreview(null); }}>
                  Clear
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {preview && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs max-h-64 overflow-auto p-3 bg-surface-muted rounded">{JSON.stringify(preview, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button onClick={handleImport} disabled={!selectedFile || !moduleId || isLoading} loading={isLoading}>
            Import Lessons
          </Button>
          {(selectedFile || result || error) && (
            <Button variant="outline" onClick={handleReset}>Reset</Button>
          )}
        </div>

        {result && (
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-emerald-800">Lessons Imported</h3>
                  <pre className="text-sm text-emerald-700 mt-2">{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50/50">
            <CardContent>
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Import Failed</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default LessonImportPage;
