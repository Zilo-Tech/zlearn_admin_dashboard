import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../components/common';
import { Globe, Bell } from 'lucide-react';

const API_URL_KEY = 'admin_api_url_preference';
const NOTIFICATIONS_KEY = 'admin_notifications_enabled';

export const SettingsPage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(
    () => process.env.REACT_APP_API_URL || 'http://localhost:8000/api'
  );
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored !== null ? stored === 'true' : true;
  });

  useEffect(() => {
    const stored = localStorage.getItem(API_URL_KEY);
    if (stored) setApiUrl(stored);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (stored !== null) setNotifications(stored === 'true');
  }, []);

  const handleApiUrlSave = () => {
    localStorage.setItem(API_URL_KEY, apiUrl);
    alert('API URL preference saved. Reload the app for changes to take effect.');
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem(NOTIFICATIONS_KEY, String(checked));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Platform configuration</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-zlearn-primary" />
              <CardTitle>API Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-xl">
              <Input
                label="API Base URL"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000/api"
              />
              <p className="text-sm text-gray-500">
                Default: {process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}
              </p>
              <Button size="sm" onClick={handleApiUrlSave}>
                Save API URL
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-zlearn-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => handleNotificationsToggle(e.target.checked)}
                className="w-4 h-4 text-zlearn-primary border-gray-300 rounded focus:ring-zlearn-primary/20"
              />
              <span className="text-sm font-medium text-gray-700">Enable in-app notifications</span>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Receive alerts for new enrollments, submissions, and platform updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
