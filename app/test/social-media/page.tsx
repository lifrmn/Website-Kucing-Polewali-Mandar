'use client';

import { useEffect, useState } from 'react';
import { SocialMediaLinks } from '@/components/SocialMediaBar';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import AppIcon from '@/components/AppIcon';

export default function SocialMediaTestPage() {
  const [links, setLinks] = useState<SocialMediaLinks>({});
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/settings/social');
      const data = await res.json();
      if (data.success) {
        setLinks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setLoading(false);
    }
  };

  const testLink = (platform: string, url?: string) => {
    if (!url) {
      setTestResults(prev => ({ ...prev, [platform]: false }));
      return;
    }

    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Mark as tested
    setTestResults(prev => ({ ...prev, [platform]: true }));
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', url: links.instagram },
    { id: 'facebook', name: 'Facebook', url: links.facebook },
    { id: 'tiktok', name: 'TikTok', url: links.tiktok },
    { id: 'youtube', name: 'YouTube', url: links.youtube },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading social media settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Social Media Icons Test
          </h1>
          <p className="text-gray-600 mb-8">
            Click each button to test if the link opens correctly in a new tab
          </p>

          <div className="space-y-4">
            {platforms.map((platform) => {
              const hasUrl = !!platform.url;
              const isTested = testResults[platform.id];

              return (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      hasUrl 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {hasUrl ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {platform.url || 'Not configured'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isTested && (
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <AppIcon icon={CheckCircle} size="sm" />
                        Tested
                      </span>
                    )}
                    
                    <button
                      onClick={() => testLink(platform.id, platform.url)}
                      disabled={!hasUrl}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        hasUrl
                          ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {hasUrl ? 'Test Link' : 'Disabled'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AppIcon icon={AlertCircle} size="md" className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Test Instructions</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Click "Test Link" button for each platform</li>
                  <li>Verify the correct page opens in a new tab</li>
                  <li>Check that disabled icons show "Link belum diatur" tooltip</li>
                  <li>Confirm WhatsApp button doesn't overlap social bar</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <a
              href="/"
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors"
            >
              View Footer on Homepage
            </a>
            <a
              href="/api/settings/social"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium text-center hover:bg-green-700 transition-colors"
            >
              View API Response
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
