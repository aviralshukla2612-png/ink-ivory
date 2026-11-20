'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Sliders,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  X,
  Palette,
  FileText,
  Settings2,
  Check,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';
import { APPROVED_RENDERER_REGISTRY } from '@/lib/templates/renderer-registry';

interface SectionItem {
  id: string;
  templateId: string;
  sectionType: string;
  title: string;
  order: number;
  isEnabled: boolean;
  settings: Record<string, any>;
  fieldsSchema: Record<string, any>;
}

interface VersionItem {
  id: string;
  versionNumber: number;
  changeSummary: string;
  createdBy: string;
  createdAt: string;
  snapshotConfig: any;
}

export default function TemplateBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const templateId = resolvedParams.id;

  const { hasPermission } = useAdmin();
  const canManage = hasPermission('TEMPLATES_MANAGE');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Core Template State
  const [template, setTemplate] = useState<any>(null);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [supportedSections, setSupportedSections] = useState<string[]>([]);

  // Editor State
  const [activeTab, setActiveTab] = useState<'sections' | 'fields' | 'design'>('sections');
  const [selectedSection, setSelectedSection] = useState<SectionItem | null>(null);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [versionModalOpen, setVersionModalOpen] = useState(false);

  // Form Fields
  const [defaultFields, setDefaultFields] = useState<Record<string, any>>({});
  const [designConfig, setDesignConfig] = useState<Record<string, any>>({});
  const [changeSummary, setChangeSummary] = useState('');

  // Load Template Builder Data
  const loadBuilderData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<any>(`/api/admin/templates/${encodeURIComponent(templateId)}/builder`);
      const { template: tpl, sections: secs, versions: vers, renderer, currentVersion: cVer } = res.data;

      setTemplate(tpl);
      setSections(secs);
      setVersions(vers);
      setCurrentVersion(cVer);
      setDefaultFields(tpl.defaultFields || {});
      setDesignConfig(tpl.designConfig || {});

      if (secs.length > 0) setSelectedSection(secs[0]);

      if (renderer && renderer.supportedSections) {
        setSupportedSections(renderer.supportedSections);
      } else if (tpl.rendererId && APPROVED_RENDERER_REGISTRY[tpl.rendererId]) {
        setSupportedSections(APPROVED_RENDERER_REGISTRY[tpl.rendererId].supportedSections);
      } else {
        setSupportedSections(['opening', 'hero', 'welcome', 'story', 'events', 'venue', 'closing']);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load builder configuration.' });
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    loadBuilderData();
  }, [loadBuilderData]);

  // Save All Builder Changes
  const handleSave = async () => {
    if (!canManage) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await apiRequest<any>(`/api/admin/templates/${encodeURIComponent(templateId)}/builder`, {
        method: 'PUT',
        body: JSON.stringify({
          sections,
          defaultFields,
          designConfig,
          changeSummary: changeSummary.trim() || `Builder update v${currentVersion + 1}`,
        }),
      });

      setTemplate(res.data.template);
      setSections(res.data.sections);
      setCurrentVersion(res.data.version.versionNumber);
      setChangeSummary('');
      setFeedback({ type: 'success', text: `Saved version ${res.data.version.versionNumber} successfully.` });

      // Refresh versions list
      const versRes = await apiRequest<VersionItem[]>(`/api/admin/templates/${encodeURIComponent(templateId)}/versions`);
      setVersions(versRes.data);
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to save builder changes.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Reorder Sections
  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIdx, 0, moved);

    // Re-assign sequential order
    const updated = newSections.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(updated);

    // Call reorder API immediately
    try {
      await apiRequest(`/api/admin/templates/${encodeURIComponent(templateId)}/sections/reorder`, {
        method: 'PUT',
        body: JSON.stringify({
          sectionOrders: updated.map((s) => ({ id: s.id, order: s.order })),
        }),
      });
    } catch (err) {
      console.error('Section reorder error:', err);
    }
  };

  // Toggle Section Enabled
  const handleToggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  // Add Section from supported list
  const handleAddSection = (secType: string) => {
    const existing = sections.find((s) => s.sectionType === secType);
    const title = secType.charAt(0).toUpperCase() + secType.slice(1).replace(/-/g, ' ');

    const newSec: SectionItem = {
      id: `sec_${templateId}_${secType}_${Date.now().toString().slice(-4)}`,
      templateId,
      sectionType: secType,
      title: existing ? `${title} (Extra)` : title,
      order: sections.length + 1,
      isEnabled: true,
      settings: { background: '#FFFFFF', padding: 'normal', animation: 'fade-up' },
      fieldsSchema: {},
    };

    setSections((prev) => [...prev, newSec]);
    setSelectedSection(newSec);
  };

  // Remove Section
  const handleRemoveSection = (id: string) => {
    const filtered = sections.filter((s) => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(filtered);
    if (selectedSection?.id === id) {
      setSelectedSection(filtered[0] || null);
    }
  };

  // Restore Version Snapshot
  const handleRestoreVersion = async (vNum: number) => {
    if (!canManage) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await apiRequest<any>(`/api/admin/templates/${encodeURIComponent(templateId)}/versions`, {
        method: 'POST',
        body: JSON.stringify({ versionNumber: vNum }),
      });

      setTemplate(res.data.template);
      setSections(res.data.sections);
      setDefaultFields(res.data.template.defaultFields || {});
      setDesignConfig(res.data.template.designConfig || {});
      setVersionModalOpen(false);
      setFeedback({ type: 'success', text: `Restored version ${vNum} snapshot successfully.` });

      await loadBuilderData();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to restore version.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3 text-[#705E55]">
        <Loader2 className="w-8 h-8 animate-spin text-[#8C6D3B]" />
        <span className="font-mono text-xs">Loading template builder canvas...</span>
      </div>
    );
  }

  // Determine Preview URL with current fields
  const previewQueryParams = new URLSearchParams();
  previewQueryParams.set('preview', 'true');
  if (defaultFields.names) previewQueryParams.set('names', defaultFields.names);
  if (defaultFields.headline) previewQueryParams.set('headline', defaultFields.headline);
  if (defaultFields.date) previewQueryParams.set('date', defaultFields.date);
  if (defaultFields.venue) previewQueryParams.set('venue', defaultFields.venue);

  const previewBaseUrl = template?.liveDemoUrl || `/customize/${template?.id}`;
  const fullPreviewUrl = `${previewBaseUrl}${previewBaseUrl.includes('?') ? '&' : '?'}${previewQueryParams.toString()}`;

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col space-y-3 -mx-4 -my-4 p-4 bg-[#F8F5F1]">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/templates"
            className="p-1.5 text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-xl transition-colors"
            title="Back to Templates"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-base text-[#1F1916] line-clamp-1">
                {template?.title}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#641A2A] text-white">
                v{currentVersion}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8]">
                {template?.occasion}
              </span>
            </div>
            <p className="text-[11px] text-[#705E55] font-mono">
              Renderer: {template?.rendererId}
            </p>
          </div>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              viewport === 'mobile'
                ? 'bg-white text-[#1F1916] font-bold shadow-xs'
                : 'text-[#705E55] hover:text-[#1F1916]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile (375px)</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              viewport === 'tablet'
                ? 'bg-white text-[#1F1916] font-bold shadow-xs'
                : 'text-[#705E55] hover:text-[#1F1916]'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet (768px)</span>
          </button>
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              viewport === 'desktop'
                ? 'bg-white text-[#1F1916] font-bold shadow-xs'
                : 'text-[#705E55] hover:text-[#1F1916]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVersionModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EAD8C8] hover:border-[#8C6D3B] text-[#705E55] text-xs font-medium rounded-xl transition-colors"
          >
            <History className="w-3.5 h-3.5 text-[#8C6D3B]" />
            <span>History ({versions.length})</span>
          </button>

          <a
            href={fullPreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EAD8C8] hover:border-[#8C6D3B] text-[#705E55] text-xs font-medium rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Tab</span>
          </a>

          {canManage && (
            <button
              onClick={handleSave}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#641A2A] hover:bg-[#4E1320] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save &amp; Snapshot</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Builder Canvas (2-Column / Split View) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Side: Editor Tabs (Sections / Fields / Design) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAD8C8] shadow-sm flex flex-col overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex items-center border-b border-[#EAD8C8] bg-[#FAF5EE] px-3 pt-2 gap-2">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'sections'
                  ? 'border-[#641A2A] text-[#641A2A] bg-white rounded-t-xl'
                  : 'border-transparent text-[#705E55] hover:text-[#1F1916]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sections ({sections.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'fields'
                  ? 'border-[#641A2A] text-[#641A2A] bg-white rounded-t-xl'
                  : 'border-transparent text-[#705E55] hover:text-[#1F1916]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Default Fields</span>
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'design'
                  ? 'border-[#641A2A] text-[#641A2A] bg-white rounded-t-xl'
                  : 'border-transparent text-[#705E55] hover:text-[#1F1916]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme &amp; Colors</span>
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* TAB 1: SECTIONS MANAGER */}
            {activeTab === 'sections' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#705E55] font-semibold">
                    Reorder &amp; Toggle Sections
                  </span>
                  <div className="relative group">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#8C6D3B] bg-[#FAF5EE] border border-[#EAD8C8] rounded-lg hover:bg-white transition-colors">
                      <Plus className="w-3 h-3" />
                      <span>Add Section</span>
                    </button>
                    {/* Supported sections dropdown */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-[#EAD8C8] shadow-lg p-1 hidden group-hover:block z-20">
                      {supportedSections.map((secType) => (
                        <button
                          key={secType}
                          onClick={() => handleAddSection(secType)}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg font-mono capitalize"
                        >
                          + {secType.replace(/-/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section List */}
                <div className="space-y-2">
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSection(sec)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedSection?.id === sec.id
                          ? 'bg-[#FAF5EE] border-[#8C6D3B] shadow-xs'
                          : 'bg-white border-[#EAD8C8]/80 hover:border-[#8C6D3B]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSection(sec.id);
                          }}
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            sec.isEnabled
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-[#EAD8C8] text-transparent'
                          }`}
                          title="Toggle visibility"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </button>

                        <div>
                          <span
                            className={`text-xs font-semibold block ${
                              sec.isEnabled ? 'text-[#1F1916]' : 'text-[#705E55]/60 line-through'
                            }`}
                          >
                            {sec.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#8C6D3B]">
                            {sec.sectionType} • Order {sec.order}
                          </span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleMoveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:text-[#1F1916] text-[#705E55] disabled:opacity-20"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(idx, 'down')}
                          disabled={idx === sections.length - 1}
                          className="p-1 hover:text-[#1F1916] text-[#705E55] disabled:opacity-20"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveSection(sec.id)}
                          className="p-1 text-rose-500 hover:text-rose-700"
                          title="Remove section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Section Settings */}
                {selectedSection && (
                  <div className="p-3.5 rounded-xl bg-[#FAF5EE]/70 border border-[#EAD8C8] space-y-3 mt-4">
                    <div className="flex items-center justify-between border-b border-[#EAD8C8]/60 pb-2">
                      <span className="font-serif font-bold text-xs text-[#1F1916]">
                        Settings: {selectedSection.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#8C6D3B]">
                        {selectedSection.sectionType}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-[#705E55] mb-1">
                        Display Title
                      </label>
                      <input
                        type="text"
                        value={selectedSection.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSections((prev) =>
                            prev.map((s) => (s.id === selectedSection.id ? { ...s, title: val } : s))
                          );
                          setSelectedSection((prev) => (prev ? { ...prev, title: val } : null));
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#EAD8C8] rounded-lg text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DEFAULT FIELDS */}
            {activeTab === 'fields' && (
              <div className="space-y-4">
                <p className="text-xs text-[#705E55] leading-relaxed">
                  Default placeholder copy pre-populated when a customer opens this template.
                </p>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={defaultFields.headline || ''}
                    onChange={(e) => setDefaultFields({ ...defaultFields, headline: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                    Celebrants / Host Names
                  </label>
                  <input
                    type="text"
                    value={defaultFields.names || ''}
                    onChange={(e) => setDefaultFields({ ...defaultFields, names: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                    Date &amp; Time
                  </label>
                  <input
                    type="text"
                    value={defaultFields.date || ''}
                    onChange={(e) => setDefaultFields({ ...defaultFields, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={defaultFields.venue || ''}
                    onChange={(e) => setDefaultFields({ ...defaultFields, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                    Invitation Message
                  </label>
                  <textarea
                    rows={3}
                    value={defaultFields.message || ''}
                    onChange={(e) => setDefaultFields({ ...defaultFields, message: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: DESIGN & COLORS */}
            {activeTab === 'design' && (
              <div className="space-y-4">
                <p className="text-xs text-[#705E55] leading-relaxed">
                  Color palette and luxury accents applied to this template renderer.
                </p>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                    Theme / Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={designConfig.themeColor || '#FAF8F5'}
                      onChange={(e) => setDesignConfig({ ...designConfig, themeColor: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-[#EAD8C8] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={designConfig.themeColor || '#FAF8F5'}
                      onChange={(e) => setDesignConfig({ ...designConfig, themeColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-mono text-[#1F1916]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                    Gold Accent / Button Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={designConfig.accentColor || '#D4AF37'}
                      onChange={(e) => setDesignConfig({ ...designConfig, accentColor: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-[#EAD8C8] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={designConfig.accentColor || '#D4AF37'}
                      onChange={(e) => setDesignConfig({ ...designConfig, accentColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-mono text-[#1F1916]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                    Typography Font Family
                  </label>
                  <select
                    value={designConfig.fontFamily || 'Cinzel'}
                    onChange={(e) => setDesignConfig({ ...designConfig, fontFamily: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                  >
                    <option value="Cinzel">Cinzel (Royal Heritage)</option>
                    <option value="Playfair Display">Playfair Display (Editorial Romance)</option>
                    <option value="Great Vibes">Great Vibes (Calligraphic Script)</option>
                    <option value="Inter">Inter (Modern Clean)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Multi-Device Responsive Live Preview */}
        <div className="lg:col-span-7 bg-[#EFECE6] rounded-2xl border border-[#EAD8C8] shadow-inner flex flex-col items-center justify-center p-3 overflow-hidden relative">
          <div
            className={`transition-all duration-300 h-full flex flex-col bg-white shadow-2xl overflow-hidden ${
              viewport === 'mobile'
                ? 'w-[375px] max-w-full rounded-[40px] border-[10px] border-[#1F1916]'
                : viewport === 'tablet'
                ? 'w-[768px] max-w-full rounded-[30px] border-[12px] border-[#1F1916]'
                : 'w-full rounded-xl border border-[#EAD8C8]'
            }`}
          >
            {/* Mock device status bar on mobile */}
            {viewport === 'mobile' && (
              <div className="h-6 bg-[#1F1916] flex items-center justify-between px-6 text-[10px] text-white/70">
                <span>9:41</span>
                <div className="w-16 h-3.5 bg-black rounded-full" />
                <span>5G</span>
              </div>
            )}

            {/* Live Iframe */}
            <iframe
              src={fullPreviewUrl}
              title="Template Live Preview"
              className="w-full flex-1 border-0"
            />
          </div>
        </div>
      </div>

      {/* VERSION HISTORY MODAL */}
      {versionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#FAF5EE] border-b border-[#EAD8C8] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1F1916]">Version History</h3>
                <p className="text-[11px] text-[#705E55]">Immutable template snapshots with instant rollback</p>
              </div>
              <button
                onClick={() => setVersionModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white text-[#705E55] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto space-y-3">
              {versions.length === 0 ? (
                <p className="text-xs text-[#705E55] text-center py-6">No snapshots saved yet.</p>
              ) : (
                versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3.5 rounded-2xl bg-[#FAF5EE]/60 border border-[#EAD8C8] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#641A2A] text-white">
                          v{ver.versionNumber}
                        </span>
                        <span className="text-xs font-semibold text-[#1F1916]">
                          {ver.changeSummary}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#705E55] mt-1 font-mono">
                        By {ver.createdBy} • {new Date(ver.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {canManage && (
                      <button
                        onClick={() => handleRestoreVersion(ver.versionNumber)}
                        disabled={submitting || ver.versionNumber === currentVersion}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#EAD8C8] hover:border-[#8C6D3B] text-[#8C6D3B] disabled:opacity-40 transition-colors"
                      >
                        {ver.versionNumber === currentVersion ? 'Active' : 'Restore'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
