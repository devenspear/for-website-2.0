'use client';

import React, { useState } from 'react';
import { Trash2, Download, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { CharacterTheme } from '@/types';
import { THEME_DEFINITIONS } from '@/constants/themes';

export default function SettingsPage() {
  const { clearAllData, exportData, isLoading } = useDataStore();
  const { hiddenThemes, toggleThemeVisibility, reset: resetAppStore } = useAppStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `character-insights-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmed) return;

    await clearAllData();
    resetAppStore();

    // Clear the onboarding cookie
    document.cookie = 'character-insights-onboarded=; path=/; max-age=0';

    setShowDeleteConfirm(false);
    setDeleteConfirmed(false);

    // Redirect to onboarding
    window.location.href = '/onboarding';
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#18181b' }}>Settings</h1>
          <p className="mt-1" style={{ color: '#71717a' }}>Manage your data and preferences</p>
        </div>

        {/* Theme Visibility */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <h2 className="font-semibold" style={{ color: '#18181b' }}>Theme Visibility</h2>
            <p className="text-sm mt-0.5" style={{ color: '#71717a' }}>
              Hide themes you don&apos;t want to track
            </p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.values(CharacterTheme).map((theme) => {
                const def = THEME_DEFINITIONS[theme];
                const isHidden = hiddenThemes.includes(theme);
                return (
                  <button
                    key={theme}
                    onClick={() => toggleThemeVisibility(theme)}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150"
                    style={{
                      backgroundColor: isHidden ? '#f4f4f5' : '#ffffff',
                      border: `1px solid ${isHidden ? '#d4d4d8' : '#e4e4e7'}`,
                      opacity: isHidden ? 0.6 : 1,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: def.color }}
                    />
                    <span
                      className="text-sm font-medium flex-1 text-left"
                      style={{ color: isHidden ? '#71717a' : '#18181b' }}
                    >
                      {def.name}
                    </span>
                    {isHidden ? (
                      <EyeOff size={16} className="text-neutral-400" />
                    ) : (
                      <Eye size={16} className="text-neutral-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <h2 className="font-semibold" style={{ color: '#18181b' }}>Data Management</h2>
            <p className="text-sm mt-0.5" style={{ color: '#71717a' }}>
              Export or delete your data
            </p>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
              <div>
                <p className="font-medium" style={{ color: '#18181b' }}>Export Data</p>
                <p className="text-sm" style={{ color: '#71717a' }}>Download all your data as JSON</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                leftIcon={<Download size={16} />}
              >
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#fef2f2' }}>
              <div>
                <p className="font-medium" style={{ color: '#dc2626' }}>Delete All Data</p>
                <p className="text-sm" style={{ color: '#ef4444' }}>Permanently remove all your data</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                leftIcon={<Trash2 size={16} />}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="text-xs" style={{ color: '#a1a1aa' }}>
            Character Insights v2.0.0
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteConfirmed(false);
        }}
        title="Delete All Data"
      >
        <div className="space-y-4">
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
          >
            <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-700">This action cannot be undone</p>
              <p className="text-sm text-red-600 mt-1">
                All your usage data, check-ins, and scores will be permanently deleted.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-neutral-200">
            <input
              type="checkbox"
              checked={deleteConfirmed}
              onChange={(e) => setDeleteConfirmed(e.target.checked)}
              className="mt-0.5"
              style={{ accentColor: '#dc2626' }}
            />
            <span className="text-sm text-neutral-700">
              I understand that this will permanently delete all my data and I cannot recover it.
            </span>
          </label>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteConfirmed(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={!deleteConfirmed}
              isLoading={isLoading}
              className="flex-1"
            >
              Delete Everything
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
