'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Type,
  Sparkles,
  Check,
  ShoppingBag,
  Smartphone,
  Music,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  Play,
  Pause,
  Heart,
  Volume2,
  Save,
  Globe,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Trash2,
  Camera,
  MoveVertical,
  MoveHorizontal,
  ZoomIn,
  RotateCcw,
} from 'lucide-react';
import PublishModal from '@/components/editor/PublishModal';
import { templatesData } from '@/data/templates';
import { EditableFields, DesignConfig } from '@/types';
import { useCart } from '@/context/CartContext';

// Curated library of iconic soundtracks
const SONG_LIBRARY = [
  {
    id: 'happy-birthday',
    title: 'Happy Birthday to You (Music Box & Piano)',
    artist: 'You Are Mine Music Box • Celebratory Melody',
    source: '/audio/happy-birthday.mp3',
    duration: 31,
    tag: 'Birthday Anthem',
  },
  {
    id: 'aaj-sajeya',
    title: 'Aaj Sajeya — Goldie Sohel',
    artist: 'Saregama Music • Romantic Wedding Anthem',
    source: '/audio/aaj-sajeya.mp3',
    duration: 249,
    tag: 'Wedding Favorite',
  },
  {
    id: 'kudmayi',
    title: 'Kudmayi (Film Version) — Shahid Mallya',
    artist: 'Pritam, Saregama • Rocky Aur Rani',
    source: '/audio/kudmayi.mp3',
    duration: 274,
    tag: 'Cinematic Royal',
  },
  {
    id: 'mast-magan',
    title: 'Mast Magan — Arijit Singh & Chinmayi',
    artist: 'T-Series • 2 States South Indian Anthem',
    source: '/audio/mast-magan.mp3',
    duration: 232,
    tag: 'South Indian & Bollywood',
  },
  {
    id: 'valentine-theme',
    title: 'Until I Found You — Stephen Sanchez',
    artist: 'Mercury Records • Romantic Acoustic',
    source: '/audio/valentine-theme.mp3',
    duration: 177,
    tag: 'Valentine Romance',
  },
  {
    id: 'shehnai',
    title: 'Indian Wedding Shehnai & Dhol',
    artist: 'Traditional Auspicious Vedic Shehnai',
    source: '/audio/indian-wedding-shehnai.mp3',
    duration: 360,
    tag: 'Traditional Sacred',
  },
  {
    id: 'kashi-theme',
    title: 'Kashi Heritage Sitar & Flute',
    artist: 'Traditional Indian Classical Harmony',
    source: '/audio/kashi-theme.mp3',
    duration: 180,
    tag: 'Serene Sitar',
  },
];

export default function CustomizePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = (params?.templateId as string) || 'template-01';

  const baseTemplate =
    templatesData.find(
      (t) =>
        t.id === templateId ||
        t.slug === templateId ||
        t.liveDemoUrl?.includes(templateId) ||
        (templateId === 'date-planner' && t.liveDemoUrl === '/date-planner') ||
        (templateId === 'valentine' && t.liveDemoUrl === '/valentine') ||
        (templateId === 'birthday' && t.liveDemoUrl === '/birthday') ||
        (templateId === 'template-02' && t.liveDemoUrl === '/template-02') ||
        (templateId === 'template-03' && t.liveDemoUrl === '/template-03')
    ) || templatesData[0];

  // Resolve template key
  const getTemplateKey = () => {
    if (
      templateId === 'date-planner' ||
      templateId === 'tpl-date-planner-07' ||
      templateId === 'our-date-planner' ||
      baseTemplate.id === 'tpl-date-planner-07' ||
      baseTemplate.liveDemoUrl === '/date-planner'
    ) {
      return 'date-planner';
    }
    if (
      templateId === 'template-02' ||
      templateId === 'tpl-anniversary-gold-02' ||
      baseTemplate.id === 'tpl-anniversary-gold-02' ||
      baseTemplate.liveDemoUrl === '/template-02'
    ) {
      return 'template-02';
    }
    if (
      templateId === 'template-03' ||
      templateId === 'tpl-engagement-garden-03' ||
      baseTemplate.id === 'tpl-engagement-garden-03' ||
      baseTemplate.liveDemoUrl === '/template-03'
    ) {
      return 'template-03';
    }
    if (
      templateId === 'valentine' ||
      templateId === 'tpl-valentine-velvet-05' ||
      baseTemplate.id === 'tpl-valentine-velvet-05' ||
      baseTemplate.liveDemoUrl === '/valentine'
    ) {
      return 'valentine';
    }
    if (
      templateId === 'birthday' ||
      templateId === 'tpl-birthday-botanical-04' ||
      templateId === 'interactive-birthday-celebration' ||
      baseTemplate.id === 'tpl-birthday-botanical-04' ||
      baseTemplate.liveDemoUrl === '/birthday'
    ) {
      return 'birthday';
    }
    return 'template-01';
  };

  const templateKey = getTemplateKey();
  const { cart, addToCart } = useCart();

  // State for editable fields
  const [fields, setFields] = useState<EditableFields>(() => {
    let saved: Partial<EditableFields> = {};
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(`ink_ivory_custom_${templateKey}`);
        if (stored) saved = JSON.parse(stored);
      } catch (e) { }
    }
    const defaultEvents = baseTemplate.defaultFields.events || (templateKey === 'template-02' ? [
      { name: 'Haldi', icon: 'haldi', date: 'Friday, 12 February 2027', time: '10:00 AM', venue: 'Family home, Jaipur' },
      { name: 'Mehendi', icon: 'mehendi', date: 'Friday, 12 February 2027', time: '4:00 PM', venue: 'The courtyard, Jaipur' },
      { name: 'Sangeet', icon: 'sangeet', date: 'Friday, 12 February 2027', time: '8:00 PM', venue: 'Rooftop lawns, Jaipur' },
      { name: 'Wedding', icon: 'wedding', date: 'Saturday, 13 February 2027', time: '7:30 PM', venue: 'Rambagh Palace, Jaipur' },
      { name: 'Reception', icon: 'reception', date: 'Sunday, 14 February 2027', time: '8:00 PM', venue: 'Rambagh Palace, Jaipur' },
    ] : undefined);

    return {
      ...baseTemplate.defaultFields,
      audioSource: baseTemplate.defaultFields.audioSource || '/audio/aaj-sajeya.mp3',
      events: saved.events || defaultEvents,
      ...saved,
    };
  });

  // State for design styling
  const [design, setDesign] = useState<DesignConfig>({
    ...baseTemplate.designConfig,
  });

  const [activeTab, setActiveTab] = useState<'text' | 'music'>('text');
  const [isSavedToCart, setIsSavedToCart] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(() => Number(fields.audioStartTime) || 0);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [audioDuration, setAudioDuration] = useState<number>(240);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioUploadMessage, setAudioUploadMessage] = useState<string | null>(null);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);

  // Persistent Draft & Try-Before-You-Publish State
  const [addingToCart, setAddingToCart] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [draftSaveStatus, setDraftSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load existing draft or cart item if in query params
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const existingDraftId = sp.get('draftId');
    const cartItemId = sp.get('cartItemId');

    if (cartItemId) {
      const cartItem = cart.find((i) => i.customizedId === cartItemId);
      if (cartItem) {
        if (cartItem.customization) setFields((prev) => ({ ...prev, ...cartItem.customization }));
        if (cartItem.designConfig) setDesign((prev) => ({ ...prev, ...cartItem.designConfig }));
        if (cartItem.draftId && !existingDraftId) setDraftId(cartItem.draftId);
      }
    }

    if (existingDraftId) {
      setDraftId(existingDraftId);
      fetch(`/api/drafts/${existingDraftId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.draft) {
            if (data.draft.fields) setFields((prev) => ({ ...prev, ...data.draft.fields }));
            if (data.draft.design) setDesign((prev) => ({ ...prev, ...data.draft.design }));
          }
        })
        .catch((err) => console.error('Failed to load draft:', err));
    }
  }, [cart]);

  // Save Draft to Server Function
  const saveDraftToServer = async (overrideStatus?: string): Promise<string | null> => {
    setIsDraftSaving(true);
    setDraftSaveStatus('saving');
    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: draftId || undefined,
          templateId: baseTemplate.id,
          title: `${fields.names || baseTemplate.title} Invitation`,
          fields,
          design,
          customAudioUrl: fields.audioSource,
          customAudioTitle: fields.songTitle,
          status: overrideStatus || 'DRAFT',
        }),
      });
      const data = await res.json();
      if (data.success && data.draft) {
        setDraftId(data.draft.id);
        setDraftSaveStatus('saved');
        setHasUnsavedChanges(false);
        setTimeout(() => setDraftSaveStatus('idle'), 2500);
        return data.draft.id;
      } else {
        setDraftSaveStatus('error');
        setTimeout(() => setDraftSaveStatus('idle'), 3000);
        return null;
      }
    } catch (e) {
      console.error('Error saving draft:', e);
      setDraftSaveStatus('error');
      setTimeout(() => setDraftSaveStatus('idle'), 3000);
      return null;
    } finally {
      setIsDraftSaving(false);
    }
  };

  // Auto-save debounce effect (saves automatically every few seconds when changes occur)
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const timer = setTimeout(() => {
      saveDraftToServer();
    }, 5000);
    return () => clearTimeout(timer);
  }, [fields, design, hasUnsavedChanges]);

  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState<string | null>(null);
  const [customPhotoUrlInput, setCustomPhotoUrlInput] = useState('');
  const [saveBannerMessage, setSaveBannerMessage] = useState<string | null>(null);

  const getEffectivePhoto = () => {
    if (fields.photoUrl) return fields.photoUrl;
    if (templateKey === 'birthday') return '/images/birthday/profile.jpg';
    if (templateKey === 'valentine') return '/bgv.png';
    if (templateKey === 'template-01') return '/template-01/gallery-1.jpg';
    if (templateKey === 'template-02') return '/images/hero-luxury.png';
    if (templateKey === 'template-03') return '/images/templates/south-indian-temple.png';
    if (templateKey === 'date-planner') return '/images/templates/date-planner.png';
    return '/images/birthday/profile.jpg';
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    handleFieldChange('photoUrl', localUrl);

    try {
      setIsUploadingPhoto(true);
      setPhotoUploadError(null);
      setPhotoUploadSuccess(`Uploading "${file.name}"...`);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      handleFieldChange('photoUrl', data.url);
      setPhotoUploadSuccess(`✓ Photo uploaded & framed successfully!`);
      setTimeout(() => setPhotoUploadSuccess(null), 5000);
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setPhotoUploadError(err.message || 'Upload failed. Please upload a JPG or PNG under 15MB.');
      setTimeout(() => setPhotoUploadError(null), 5000);
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleApplyCustomPhotoUrl = () => {
    if (!customPhotoUrlInput.trim()) return;
    handleFieldChange('photoUrl', customPhotoUrlInput.trim());
    setPhotoUploadSuccess(`✓ Photo URL applied!`);
    setTimeout(() => setPhotoUploadSuccess(null), 4000);
    setCustomPhotoUrlInput('');
  };

  const handleManualSave = async () => {
    setIsDraftSaving(true);
    // 1. Sync sessionStorage immediately
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`ink_ivory_custom_${templateKey}`, JSON.stringify(fields));
        if (templateKey === 'template-01') {
          sessionStorage.setItem('ink_ivory_custom_wedding_data', JSON.stringify(fields));
        }
      } catch (e) {}
    }
    // 2. Broadcast to iframe
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'INK_IVORY_CUSTOM_UPDATE', payload: fields },
        '*'
      );
    } catch (e) {}
    // 3. Save draft to server
    await saveDraftToServer();
    setSaveBannerMessage('✓ Dates, photos and details saved & updated in preview!');
    setTimeout(() => setSaveBannerMessage(null), 5000);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Broadcast field updates to live preview iframe & sessionStorage
  const handleFieldChange = (key: keyof EditableFields, value: any) => {
    setHasUnsavedChanges(true);
    setFields((prev) => {
      const updated = { ...prev, [key]: value };
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(`ink_ivory_custom_${templateKey}`, JSON.stringify(updated));
        } catch (e) { }
      }
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'INK_IVORY_CUSTOM_UPDATE', payload: updated },
          '*'
        );
      } catch (e) { }
      return updated;
    });
  };

  // Handle updates to specific wedding event items
  const handleEventChange = (index: number, key: string, value: string) => {
    setHasUnsavedChanges(true);
    setFields((prev) => {
      const defaultEvs = baseTemplate.defaultFields.events || [
        { name: 'Haldi', icon: 'haldi', date: 'Friday, 12 February 2027', time: '10:00 AM', venue: 'Family home, Jaipur' },
        { name: 'Mehendi', icon: 'mehendi', date: 'Friday, 12 February 2027', time: '4:00 PM', venue: 'The courtyard, Jaipur' },
        { name: 'Sangeet', icon: 'sangeet', date: 'Friday, 12 February 2027', time: '8:00 PM', venue: 'Rooftop lawns, Jaipur' },
        { name: 'Wedding', icon: 'wedding', date: 'Saturday, 13 February 2027', time: '7:30 PM', venue: 'Rambagh Palace, Jaipur' },
        { name: 'Reception', icon: 'reception', date: 'Sunday, 14 February 2027', time: '8:00 PM', venue: 'Rambagh Palace, Jaipur' },
      ];
      const evList = prev.events && prev.events.length > 0 ? [...prev.events] : [...defaultEvs];
      if (!evList[index]) {
        evList[index] = { name: '', time: '', venue: '' };
      }
      evList[index] = { ...evList[index], [key]: value };
      const updated = { ...prev, events: evList };
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(`ink_ivory_custom_${templateKey}`, JSON.stringify(updated));
        } catch (e) { }
      }
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'INK_IVORY_CUSTOM_UPDATE', payload: updated },
          '*'
        );
      } catch (e) { }
      return updated;
    });
  };

  // Add a new celebration function
  const handleAddEvent = () => {
    setHasUnsavedChanges(true);
    setFields((prev) => {
      const defaultEvs = baseTemplate.defaultFields.events || [
        { name: 'Haldi', icon: 'haldi', date: 'Friday, 12 February 2027', time: '10:00 AM', venue: 'Family home, Jaipur' },
        { name: 'Mehendi', icon: 'mehendi', date: 'Friday, 12 February 2027', time: '4:00 PM', venue: 'The courtyard, Jaipur' },
        { name: 'Sangeet', icon: 'sangeet', date: 'Friday, 12 February 2027', time: '8:00 PM', venue: 'Rooftop lawns, Jaipur' },
        { name: 'Wedding', icon: 'wedding', date: 'Saturday, 13 February 2027', time: '7:30 PM', venue: 'Rambagh Palace, Jaipur' },
        { name: 'Reception', icon: 'reception', date: 'Sunday, 14 February 2027', time: '8:00 PM', venue: 'Rambagh Palace, Jaipur' },
      ];
      const evList = prev.events && prev.events.length > 0 ? [...prev.events] : [...defaultEvs];
      evList.push({
        name: `Function ${evList.length + 1}`,
        date: prev.date || 'Saturday, 13 February 2027',
        time: '7:00 PM',
        venue: prev.venue || '',
      });
      const updated = { ...prev, events: evList };
      if (typeof window !== 'undefined') {
        try { sessionStorage.setItem(`ink_ivory_custom_${templateKey}`, JSON.stringify(updated)); } catch (e) { }
      }
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: 'INK_IVORY_CUSTOM_UPDATE', payload: updated }, '*');
      } catch (e) { }
      return updated;
    });
  };

  // Remove a celebration function
  const handleRemoveEvent = (index: number) => {
    setHasUnsavedChanges(true);
    setFields((prev) => {
      const defaultEvs = baseTemplate.defaultFields.events || [];
      const evList = prev.events && prev.events.length > 0 ? [...prev.events] : [...defaultEvs];
      evList.splice(index, 1);
      const updated = { ...prev, events: evList };
      if (typeof window !== 'undefined') {
        try { sessionStorage.setItem(`ink_ivory_custom_${templateKey}`, JSON.stringify(updated)); } catch (e) { }
      }
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: 'INK_IVORY_CUSTOM_UPDATE', payload: updated }, '*');
      } catch (e) { }
      return updated;
    });
  };

  // Handle Valentine story chapter changes
  const handleStoryChange = (index: number, key: string, value: string) => {
    setHasUnsavedChanges(true);
    setFields((prev) => {
      const defaultStory = baseTemplate.defaultFields.story || [
        { title: 'The Day We Met', date: '14 February 2024', description: 'A quiet café, an accidental glance across the room...' },
        { title: 'Our First Conversation', date: '20 February 2024', description: 'Three hours melted away in minutes...' },
        { title: 'Our First Road Trip', date: '18 June 2024', description: 'Driving up the misty hill roads with the windows down...' },
        { title: 'The Little Everyday Things', date: '12 November 2024', description: 'Midnight ice cream runs, cooking dinners together...' },
        { title: 'Today & All Our Tomorrows', date: prev.date || '14 February 2026', description: 'Standing right here, asking you the simplest question...' },
      ];
      const storyList = prev.story && prev.story.length > 0 ? [...prev.story] : [...defaultStory];
      if (!storyList[index]) storyList[index] = { title: '', date: '', description: '' };
      storyList[index] = { ...storyList[index], [key]: value };
      const updated = { ...prev, story: storyList };
      if (typeof window !== 'undefined') {
        try { sessionStorage.setItem(`ink_ivory_custom_${templateKey}`, JSON.stringify(updated)); } catch (e) { }
      }
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: 'INK_IVORY_CUSTOM_UPDATE', payload: updated }, '*');
      } catch (e) { }
      return updated;
    });
  };

  // Handle Birthday memory item changes
  const handleMemoryChange = (index: number, key: string, value: string) => {
    setHasUnsavedChanges(true);
    setFields((prev) => {
      const defaultMemories = baseTemplate.defaultFields.memories || [
        { caption: "That spontaneous sunset walk where we couldn't stop laughing.", date: 'Spring Evening' },
        { caption: 'Coffee dates that turn into hours of heartfelt conversations.', date: 'Autumn Days' },
        { caption: 'Under fairy lights, celebrating how magical life can be with you.', date: 'December Magic' },
        { caption: "Here's to another year of dreams, joy, and unforgettable stories.", date: 'Golden Hour' },
      ];
      const memList = prev.memories && prev.memories.length > 0 ? [...prev.memories] : [...defaultMemories];
      if (!memList[index]) memList[index] = { caption: '', date: '' };
      memList[index] = { ...memList[index], [key]: value };
      const updated = { ...prev, memories: memList };
      if (typeof window !== 'undefined') {
        try { sessionStorage.setItem(`ink_ivory_custom_${templateKey}`, JSON.stringify(updated)); } catch (e) { }
      }
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: 'INK_IVORY_CUSTOM_UPDATE', payload: updated }, '*');
      } catch (e) { }
      return updated;
    });
  };

  // Change active song (from library or custom upload)
  const handleSelectSong = (song: { title: string; source: string; artist?: string }) => {
    handleFieldChange('songTitle', song.title);
    handleFieldChange('audioSource', song.source);
    handleFieldChange('audioStartTime', 0);
    setAudioCurrentTime(0);

    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.src = song.source;
      audioPreviewRef.current.currentTime = 0;
      audioPreviewRef.current.load();
      audioPreviewRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => { });
    }
  };

  // Handle custom audio file upload (MP3/WAV/AAC/M4A) via real server route
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAudio(true);
      setAudioUploadError(null);
      setAudioUploadMessage(`Uploading "${file.name}"...`);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/audio', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload audio');
      }

      setAudioUploadMessage(`✓ "${data.title}" uploaded successfully & playing!`);
      setTimeout(() => setAudioUploadMessage(null), 6000);

      handleSelectSong({
        title: data.title,
        source: data.url,
        artist: 'My Uploaded Song',
      });
    } catch (err: any) {
      console.error('Audio upload error:', err);
      setAudioUploadError(err.message || 'Upload failed. Please upload an MP3/WAV file under 25MB.');
      setTimeout(() => setAudioUploadError(null), 6000);
    } finally {
      setIsUploadingAudio(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle custom audio URL submit
  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = customUrlInput.trim();
    if (!url) return;

    try {
      new URL(url);
    } catch {
      setAudioUploadError('Please enter a valid URL starting with https:// or http://');
      setTimeout(() => setAudioUploadError(null), 5000);
      return;
    }

    setAudioUploadError(null);
    let extractedName = 'Custom Web Audio';
    try {
      const parts = new URL(url).pathname.split('/');
      const last = parts[parts.length - 1];
      if (last && last.includes('.')) {
        extractedName = decodeURIComponent(last.replace(/\.[^/.]+$/, ''));
      }
    } catch (e) { }

    setAudioUploadMessage(`✓ Direct audio link applied & playing!`);
    setTimeout(() => setAudioUploadMessage(null), 6000);

    handleSelectSong({
      title: extractedName,
      source: url,
      artist: 'Custom Web Stream',
    });
    setCustomUrlInput('');
  };

  // Audio seek & live cropping
  const handleSeekAudio = (startSec: number) => {
    handleFieldChange('audioStartTime', startSec);
    setAudioCurrentTime(startSec);

    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio(fields.audioSource || '/audio/aaj-sajeya.mp3');
      audioPreviewRef.current.volume = 0.6;
      audioPreviewRef.current.ontimeupdate = () => {
        if (audioPreviewRef.current) {
          setAudioCurrentTime(audioPreviewRef.current.currentTime);
        }
      };
      audioPreviewRef.current.onloadedmetadata = () => {
        if (audioPreviewRef.current) {
          setAudioDuration(audioPreviewRef.current.duration || 240);
        }
      };
      audioPreviewRef.current.onended = () => setIsPlayingAudio(false);
    }

    audioPreviewRef.current.currentTime = startSec;
    if (!isPlayingAudio) {
      audioPreviewRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => { });
    }
  };

  const toggleAudioPreview = () => {
    const src = fields.audioSource || '/audio/aaj-sajeya.mp3';
    const startSec = Number(fields.audioStartTime) || 0;

    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio(src);
      audioPreviewRef.current.volume = 0.6;
      audioPreviewRef.current.currentTime = startSec;
      audioPreviewRef.current.ontimeupdate = () => {
        if (audioPreviewRef.current) {
          setAudioCurrentTime(audioPreviewRef.current.currentTime);
        }
      };
      audioPreviewRef.current.onloadedmetadata = () => {
        if (audioPreviewRef.current) {
          setAudioDuration(audioPreviewRef.current.duration || 240);
        }
      };
      audioPreviewRef.current.onended = () => setIsPlayingAudio(false);
    } else if (audioPreviewRef.current.src !== src) {
      audioPreviewRef.current.src = src;
      audioPreviewRef.current.currentTime = startSec;
    }

    if (isPlayingAudio) {
      audioPreviewRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPreviewRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => { });
    }
  };

  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all customizations to default?')) {
      setFields({ ...baseTemplate.defaultFields });
      setDesign({ ...baseTemplate.designConfig });
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`ink_ivory_custom_${templateKey}`);
      }
    }
  };

  const handleAddToCartAndProceed = () => {
    addToCart(baseTemplate, fields, design);
    setIsSavedToCart(true);
    setTimeout(() => {
      router.push('/checkout');
    }, 400);
  };

  const handleSaveToCartOnly = () => {
    addToCart(baseTemplate, fields, design);
    setIsSavedToCart(true);
    setTimeout(() => {
      setIsSavedToCart(false);
    }, 2500);
  };

  // Build dynamic live preview URL based on templateKey
  const getPreviewUrl = () => {
    const params = new URLSearchParams();
    params.set('mode', 'demo');
    params.set('view', 'phone');
    params.set('auto', 'false');
    if (fields.photoUrl) params.set('photoUrl', fields.photoUrl);
    if (fields.photoPositionY !== undefined) params.set('photoPosY', String(fields.photoPositionY));
    if (fields.photoPositionX !== undefined) params.set('photoPosX', String(fields.photoPositionX));
    if (fields.photoFit) params.set('photoFit', fields.photoFit);
    if (fields.photoScale !== undefined) params.set('photoScale', String(fields.photoScale));

    if (templateKey === 'valentine') {
      params.set('names', fields.names || 'Aarav & Riya');
      params.set('headline', fields.headline || 'Will You Be My Valentine?');
      params.set('date', fields.date || '14 February 2026');
      if (fields.venue) params.set('venue', fields.venue);
      params.set('message', fields.message || '');
      if (fields.letterMessage) params.set('letterMessage', fields.letterMessage);
      if (fields.audioSource) params.set('audioSource', fields.audioSource);
      if (fields.audioStartTime) params.set('audioStart', String(fields.audioStartTime));
      return `/valentine?${params.toString()}`;
    }

    if (templateKey === 'birthday') {
      params.set('names', fields.names || 'Ananya & Kabir');
      params.set('heading', fields.headline || 'Birthday');
      params.set('date', fields.date || 'Saturday, 14 November 2026');
      if (fields.time) params.set('time', fields.time);
      if (fields.venue) params.set('venue', fields.venue);
      if (fields.city) params.set('city', fields.city);
      params.set('message', fields.message || 'To the one who makes life more special, may your day be as beautiful, kind and happy as you are.');
      if (fields.letterMessage) params.set('letterMessage', fields.letterMessage);
      params.set('audioSource', fields.audioSource || '/audio/happy-birthday.mp3');
      if (fields.audioStartTime) params.set('audioStart', String(fields.audioStartTime));
      return `/birthday?${params.toString()}`;
    }

    if (templateKey === 'date-planner') {
      const namesList = (fields.names || 'Riya & Aarav').split('&');
      const recipient = namesList[0]?.trim() || 'Riya';
      const sender = namesList[1]?.trim() || (fields.host ? fields.host.replace(/^Planned with love by\s*/i, '').trim() : 'Aarav');
      params.set('recipient', recipient);
      params.set('sender', sender);
      params.set('heading', fields.headline || 'Our Perfect Date ♡');
      params.set('date', fields.date || 'Saturday, 14 February 2026');
      if (fields.time) params.set('time', fields.time);
      if (fields.venue) params.set('venue', fields.venue);
      params.set('description', fields.message || "Tell me what you'd love most, and I'll plan every detail for an unforgettable time together.");
      params.set('eyebrow', fields.eyebrow || "LET'S PLAN");
      if (fields.audioSource) params.set('songUrl', fields.audioSource);
      params.set('skipOpening', 'true');
      return `/date-planner?${params.toString()}`;
    }

    if (templateKey === 'template-03') {
      params.set('names', fields.names || 'Karthik & Meenakshi');
      params.set('date', fields.date || 'Sunday, 14 February 2027');
      if (fields.time) params.set('time', fields.time);
      params.set('venue', fields.venue || 'Sri Meenakshi Sundareswarar Kalyana Mandapam, Madurai');
      params.set('city', fields.city || 'Madurai, Tamil Nadu');
      if (fields.host) params.set('family', fields.host);
      if (fields.audioSource) params.set('audioSource', fields.audioSource);
      if (fields.audioStartTime) params.set('audioStart', String(fields.audioStartTime));
      return `/template-03.html?${params.toString()}`;
    }

    if (templateKey === 'template-02') {
      params.set('names', fields.names || 'Arjun & Sia');
      params.set('date', fields.date || 'Saturday, 13 February 2027');
      if (fields.time) params.set('time', fields.time);
      params.set('venue', fields.venue || 'Rambagh Palace, Jaipur');
      params.set('city', fields.city || 'Jaipur, Rajasthan');
      if (fields.rsvp) params.set('rsvp', fields.rsvp);
      if (fields.audioSource) params.set('audioSource', fields.audioSource);
      if (fields.audioStartTime) params.set('audioStart', String(fields.audioStartTime));
      return `/template-02.html?${params.toString()}`;
    }

    // Default: template-01
    params.set('names', fields.names || 'Aarav & Riya');
    params.set('date', fields.date || 'Friday, 18 December 2026');
    params.set('time', fields.time || '5:00 PM Onwards');
    params.set('venue', fields.venue || 'The Heritage Palace & Gardens');
    params.set('city', fields.city || 'Jaipur, Rajasthan');
    if (fields.brideParents) params.set('brideParents', fields.brideParents);
    if (fields.groomParents) params.set('groomParents', fields.groomParents);
    if (fields.audioSource) params.set('audioSource', fields.audioSource);
    if (fields.audioStartTime) params.set('audioStart', String(fields.audioStartTime));
    return `/template-01?${params.toString()}`;
  };

  const fullInvitationUrl = getPreviewUrl().replace('&mode=demo&view=phone&auto=false', '');

  return (
    <div className="w-full min-h-screen bg-[#F4EFE6] flex flex-col select-none">
      {/* Top Studio Bar */}
      <div className="bg-[#FAF7F2] border-b border-[#DFCEAF] px-4 sm:px-6 py-3 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="p-1.5 rounded-lg hover:bg-[#EFE6D5] text-[#49341F] transition-colors"
            title="Back to Templates"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xs sm:text-sm font-semibold text-[#2C2114] flex items-center gap-2">
              <span>Personalizing:</span>
              <span className="font-serif italic text-[#8F6E3B]">{baseTemplate.title}</span>
            </h1>
            <p className="text-[10px] text-[#7A634E] hidden sm:block">
              {baseTemplate.occasion} • Full Digital Invitation Suite &amp; Live Music Studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-[#6B533E] hover:text-[#2C2114] flex items-center gap-1 rounded-lg hover:bg-[#EFE6D5] transition-colors"
            title="Reset to Template Defaults"
          >
            <span>Reset</span>
          </button>

          {/* Persistent Save Draft Button */}
          <button
            onClick={() => saveDraftToServer()}
            disabled={isDraftSaving}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-[#A77B35] text-[#5C4523] bg-white hover:bg-[#FAF7F0] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Save your progress to resume anytime"
          >
            {draftSaveStatus === 'saving' ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#8F6E3B] border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : draftSaveStatus === 'saved' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Draft Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#8F6E3B]" />
                <span>Save Draft</span>
              </>
            )}
          </button>

          {/* Add to Cart / Update Cart Button */}
          <button
            onClick={async () => {
              setAddingToCart(true);
              try {
                const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
                const cartItemId = sp?.get('cartItemId') || undefined;
                const savedDraftId = await saveDraftToServer('READY_TO_PUBLISH');
                addToCart(baseTemplate, fields, design, savedDraftId || draftId || undefined, cartItemId);
                router.push('/cart');
              } catch (e) {
                console.error('Error adding to cart:', e);
                addToCart(baseTemplate, fields, design, draftId || undefined);
                router.push('/cart');
              } finally {
                setAddingToCart(false);
              }
            }}
            disabled={addingToCart}
            className="px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold rounded-xl bg-gradient-to-r from-[#8F6E3B] via-[#A88347] to-[#8F6E3B] hover:opacity-95 text-white shadow-gold flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
          >
            {addingToCart ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving to Cart...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#FFF2D6]" />
                <span className="tracking-wide">
                  {cart.some(
                    (i) => i.template.id === baseTemplate.id || (draftId && i.draftId === draftId)
                  )
                    ? 'Update in Cart'
                    : 'Add to Cart'}
                </span>
                <span className="font-serif bg-black/15 px-2 py-0.5 rounded text-[11px] font-normal">
                  ₹{baseTemplate.price}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT / CENTER: Interactive Live Mockup Viewport (Col 7) */}
        <div className="lg:col-span-7 bg-[#0B1220] p-4 sm:p-6 flex flex-col items-center justify-between overflow-y-auto relative min-h-[550px]">
          {/* Header Status Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#152136] border border-[#2B3A59] shadow-lg mb-3 z-10 text-xs font-semibold text-[#E7CEA0]">
            <Smartphone className="w-3.5 h-3.5 text-[#E5A842]" />
            <span>
              📱 Live Mobile Invitation • {templateKey.toUpperCase()} Real-Time Preview
            </span>
          </div>

          {/* SMARTPHONE MOCKUP */}
          <div className="flex flex-col items-center my-auto w-full">
            <div className="relative w-[320px] sm:w-[360px] h-[640px] sm:h-[680px] max-h-[70vh] rounded-[44px] border-[10px] border-[#181F2C] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(229,168,66,0.18)] bg-black overflow-hidden flex flex-col">
              {/* Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-[#181F2C] rounded-full flex items-center justify-end px-3">
                <div className="w-2 h-2 rounded-full bg-[#0E1524]" />
              </div>

              {/* Dynamic Live Invitation Iframe */}
              <iframe
                ref={iframeRef}
                key={`${templateKey}-${fields.names}-${fields.audioSource}-${fields.audioStartTime || 0}`}
                src={getPreviewUrl()}
                title="Live Mobile Invitation Preview"
                className="w-full h-full border-none bg-[#091321] no-scrollbar"
                allow="autoplay; encrypted-media"
              />
            </div>

            {/* External Fullscreen Link */}
            <a
              href={fullInvitationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 px-4 py-1.5 rounded-full bg-[#1A263E] hover:bg-[#253552] border border-[#D6B477]/50 text-[#E7CEA0] hover:text-[#FFFDF7] text-xs font-manrope font-semibold flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>Open Fullscreen Invitation ({fields.songTitle || 'Selected Song'})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Bottom status note */}
          <div className="mt-3 text-center">
            <p className="text-[11px] text-[#A7B5CC] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E5A842]" />
              <span>Real-time instant synchronization • All edits update your live page immediately</span>
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Customization Controls (Col 5) */}
        <div className="lg:col-span-5 bg-white border-t lg:border-t-0 lg:border-l border-[#DFCEAF] flex flex-col h-full overflow-y-auto">
          {/* Tabs Navigation */}
          <div className="flex border-b border-[#EFE7D5] bg-[#FAF7F2] sticky top-0 z-10">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${activeTab === 'text'
                ? 'border-[#8F6E3B] text-[#8F6E3B] bg-white'
                : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
                }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${activeTab === 'music'
                ? 'border-[#8F6E3B] text-[#8F6E3B] bg-white'
                : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
                }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Music Freedom</span>
            </button>
          </div>

          {/* TAB 1: DETAILS (DYNAMIC FOR TEMPLATE 1, 2, 3 & VALENTINE) */}
          {activeTab === 'text' && (
            <div className="p-6 space-y-4">
              <div className="text-xs text-[#7A634E] pb-2 border-b border-[#F2ECE0]">
                Customize the names, dates, venue, and heartfelt messages. All changes reflect instantly on the live preview!
              </div>

              {/* Template-Specific Form Fields */}
              {templateKey === 'valentine' ? (
                <>
                  {/* Valentine: Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                        Your Name (Sender)
                      </label>
                      <input
                        type="text"
                        value={fields.names ? fields.names.split('&')[0]?.trim() : 'Aarav'}
                        onChange={(e) => {
                          const other = fields.names ? fields.names.split('&')[1]?.trim() || 'Riya' : 'Riya';
                          handleFieldChange('names', `${e.target.value} & ${other}`);
                        }}
                        placeholder="e.g. Aarav"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                        Their Name (Recipient)
                      </label>
                      <input
                        type="text"
                        value={fields.names ? fields.names.split('&')[1]?.trim() || '' : 'Riya'}
                        onChange={(e) => {
                          const first = fields.names ? fields.names.split('&')[0]?.trim() || 'Aarav' : 'Aarav';
                          handleFieldChange('names', `${first} & ${e.target.value}`);
                        }}
                        placeholder="e.g. Riya"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  {/* Valentine: Proposal Date & Venue / Setting */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#B51F3B]" />
                        <span>Proposal / Valentine Date</span>
                      </label>
                      <input
                        type="text"
                        value={fields.date || '14 February 2026'}
                        onChange={(e) => handleFieldChange('date', e.target.value)}
                        placeholder="e.g. 14 February 2026"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#B51F3B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B51F3B]" />
                        <span>Romantic Setting / Location</span>
                      </label>
                      <input
                        type="text"
                        value={fields.venue || 'Our Favourite Memories'}
                        onChange={(e) => handleFieldChange('venue', e.target.value)}
                        placeholder="e.g. Our Favourite Memories"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#B51F3B]"
                      />
                    </div>
                  </div>

                  {/* Proposal Question Heading */}
                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Proposal Question
                    </label>
                    <input
                      type="text"
                      value={fields.headline || 'Will You Be My Valentine?'}
                      onChange={(e) => handleFieldChange('headline', e.target.value)}
                      placeholder="e.g. Will You Be My Valentine?"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  {/* Proposal Subtitle Message */}
                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Proposal Subtitle / Love Note
                    </label>
                    <textarea
                      rows={2}
                      value={fields.message || ''}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="e.g. A little question from my heart to yours..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  {/* Wax-Sealed Love Letter Content */}
                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Wax-Sealed Love Letter Paragraph
                    </label>
                    <textarea
                      rows={4}
                      value={fields.letterMessage || 'From the very first moment you smiled at me, you brought a warmth into my world that I never knew I was missing.'}
                      onChange={(e) => handleFieldChange('letterMessage', e.target.value)}
                      placeholder="Write your personal love letter here..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  {/* Valentine Love Story Timeline & Dates */}
                  <div className="pt-3 border-t border-[#EFE7D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8F6E3B] uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-[#B51F3B]" />
                        <span>Our Love Story Timeline &amp; Dates</span>
                      </div>
                      <span className="text-[10px] text-[#B51F3B] font-semibold bg-[#FFF2ED] border border-[#F3D0C9] px-2 py-0.5 rounded-full">
                        5 Chapters
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A634E] leading-normal">
                      Customize every milestone date and memory in your journey together!
                    </p>

                    <div className="space-y-3">
                      {(fields.story && fields.story.length > 0 ? fields.story : [
                        { title: 'The Day We Met', date: '14 February 2024', description: 'A quiet café, an accidental glance across the room, and a conversation that felt so effortlessly natural.' },
                        { title: 'Our First Conversation', date: '20 February 2024', description: 'Three hours melted away in minutes as we shared our favorite songs, secret dreams, and laughed.' },
                        { title: 'Our First Road Trip', date: '18 June 2024', description: 'Driving up the misty hill roads with the windows down, your hand in mine, realizing you are my home.' },
                        { title: 'The Little Everyday Things', date: '12 November 2024', description: 'Midnight ice cream runs, cooking dinners together that never went according to recipe.' },
                        { title: 'Today & All Our Tomorrows', date: fields.date || '14 February 2026', description: 'Standing right here, asking you the simplest and most profound question of my life.' },
                      ]).map((st, idx) => (
                        <div key={idx} className="p-3 bg-[#FFFDFB] border border-[#F3D0C9] rounded-xl space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-[#F4E3DF]">
                            <span className="text-xs font-serif font-bold text-[#481321]">
                              Chapter {idx + 1}: {st.title}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-medium text-[#49341F] mb-0.5">Chapter Title</label>
                              <input
                                type="text"
                                value={st.title}
                                onChange={(e) => handleStoryChange(idx, 'title', e.target.value)}
                                className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#B51F3B] mb-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#B51F3B]" />
                                <span>Milestone Date</span>
                              </label>
                              <input
                                type="text"
                                value={st.date}
                                onChange={(e) => handleStoryChange(idx, 'date', e.target.value)}
                                placeholder="e.g. 14 February 2024"
                                className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none font-medium text-[#481321]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#49341F] mb-0.5">Memory Note</label>
                            <textarea
                              rows={2}
                              value={st.description || ''}
                              onChange={(e) => handleStoryChange(idx, 'description', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : templateKey === 'birthday' ? (
                <>
                  {/* Birthday: Recipient & Sender Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                        Birthday Star (Recipient Name)
                      </label>
                      <input
                        type="text"
                        value={fields.names ? fields.names.split('&')[0]?.trim() : 'Ananya'}
                        onChange={(e) => {
                          const other = fields.names ? fields.names.split('&')[1]?.trim() || 'Kabir' : 'Kabir';
                          handleFieldChange('names', `${e.target.value} & ${other}`);
                        }}
                        placeholder="e.g. Ananya"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                        From (Sender Name)
                      </label>
                      <input
                        type="text"
                        value={fields.names ? fields.names.split('&')[1]?.trim() || '' : 'Kabir'}
                        onChange={(e) => {
                          const first = fields.names ? fields.names.split('&')[0]?.trim() || 'Ananya' : 'Ananya';
                          handleFieldChange('names', `${first} & ${e.target.value}`);
                        }}
                        placeholder="e.g. Kabir"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  {/* Birthday Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#B62A42]" />
                        <span>Birthday Celebration Date</span>
                      </label>
                      <input
                        type="text"
                        value={fields.date || 'Saturday, 14 November 2026'}
                        onChange={(e) => handleFieldChange('date', e.target.value)}
                        placeholder="e.g. Saturday, 14 November 2026"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#B62A42]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B62A42]" />
                        <span>Party Time / Hour</span>
                      </label>
                      <input
                        type="text"
                        value={fields.time || '7:00 PM Onwards'}
                        onChange={(e) => handleFieldChange('time', e.target.value)}
                        placeholder="e.g. 7:00 PM Onwards"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#B62A42]"
                      />
                    </div>
                  </div>

                  {/* Birthday Venue & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B62A42]" />
                        <span>Celebration Venue</span>
                      </label>
                      <input
                        type="text"
                        value={fields.venue || 'The Grand Champagne Terrace'}
                        onChange={(e) => handleFieldChange('venue', e.target.value)}
                        placeholder="e.g. The Grand Champagne Terrace"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#B62A42]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={fields.city || 'Mumbai'}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#B62A42]"
                      />
                    </div>
                  </div>

                  {/* Birthday Hero Heading */}
                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Hero Script Heading
                    </label>
                    <input
                      type="text"
                      value={fields.headline || 'Birthday'}
                      onChange={(e) => handleFieldChange('headline', e.target.value)}
                      placeholder="e.g. Birthday"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  {/* Birthday Heartfelt Message */}
                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Hero Heartfelt Wish / Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={fields.message || 'To the one who makes life more special, may your day be as beautiful, kind and happy as you are.'}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="e.g. To the one who makes life more special..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  {/* Wax-Sealed Birthday Letter Content */}
                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Wax-Sealed Love Note / Birthday Letter
                    </label>
                    <textarea
                      rows={4}
                      value={fields.letterMessage || 'Today is all about celebrating you. I hope your life is always filled with laughter, beautiful memories, exciting adventures, and people who make you feel as special as you truly are. Never stop dreaming and smiling!'}
                      onChange={(e) => handleFieldChange('letterMessage', e.target.value)}
                      placeholder="Write your heartfelt birthday letter here..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  {/* Birthday Polaroid Memories & Dates */}
                  <div className="pt-3 border-t border-[#EFE7D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8F6E3B] uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-[#B62A42]" />
                        <span>Cherished Memories &amp; Dates</span>
                      </div>
                      <span className="text-[10px] text-[#B62A42] font-semibold bg-[#FFF3EE] border border-[#F4CFCA] px-2 py-0.5 rounded-full">
                        4 Memories
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A634E] leading-normal">
                      Customize the date and caption printed beneath each polaroid memory!
                    </p>

                    <div className="space-y-3">
                      {(fields.memories && fields.memories.length > 0 ? fields.memories : [
                        { caption: "That spontaneous sunset walk where we couldn't stop laughing.", date: 'Spring Evening' },
                        { caption: 'Coffee dates that turn into hours of heartfelt conversations.', date: 'Autumn Days' },
                        { caption: 'Under fairy lights, celebrating how magical life can be with you.', date: 'December Magic' },
                        { caption: "Here's to another year of dreams, joy, and unforgettable stories.", date: 'Golden Hour' },
                      ]).map((mem, idx) => (
                        <div key={idx} className="p-3 bg-[#FFFDFB] border border-[#F4CFCA] rounded-xl space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-[#F9E3DE]">
                            <span className="text-xs font-serif font-bold text-[#481321]">
                              Memory {idx + 1}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#B62A42] mb-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#B62A42]" />
                                <span>Memory Date / Season</span>
                              </label>
                              <input
                                type="text"
                                value={mem.date}
                                onChange={(e) => handleMemoryChange(idx, 'date', e.target.value)}
                                placeholder="e.g. Spring Evening"
                                className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none font-medium text-[#481321]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-[#49341F] mb-0.5">Polaroid Caption</label>
                              <input
                                type="text"
                                value={mem.caption || ''}
                                onChange={(e) => handleMemoryChange(idx, 'caption', e.target.value)}
                                className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : templateKey === 'date-planner' ? (
                <>
                  {/* Date Planner: Recipient & Sender Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                        Recipient (Their Name)
                      </label>
                      <input
                        type="text"
                        value={fields.names ? fields.names.split('&')[0]?.trim() : 'Riya'}
                        onChange={(e) => {
                          const other = fields.names ? fields.names.split('&')[1]?.trim() || 'Aarav' : 'Aarav';
                          handleFieldChange('names', `${e.target.value} & ${other}`);
                        }}
                        placeholder="e.g. Riya"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                        Sender (Your Name)
                      </label>
                      <input
                        type="text"
                        value={fields.names ? fields.names.split('&')[1]?.trim() || '' : 'Aarav'}
                        onChange={(e) => {
                          const first = fields.names ? fields.names.split('&')[0]?.trim() || 'Riya' : 'Riya';
                          handleFieldChange('names', `${first} & ${e.target.value}`);
                        }}
                        placeholder="e.g. Aarav"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  {/* Date Planner: Planned Date & Preferred Timing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#B51F3B]" />
                        <span>Planned Date</span>
                      </label>
                      <input
                        type="text"
                        value={fields.date || 'Saturday, 14 February 2026'}
                        onChange={(e) => handleFieldChange('date', e.target.value)}
                        placeholder="e.g. Saturday, 14 February 2026"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#B51F3B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B51F3B]" />
                        <span>Preferred Timing</span>
                      </label>
                      <input
                        type="text"
                        value={fields.time || 'Evening (6:30 PM – 8:30 PM)'}
                        onChange={(e) => handleFieldChange('time', e.target.value)}
                        placeholder="e.g. Evening (6:30 PM – 8:30 PM)"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#B51F3B]"
                      />
                    </div>
                  </div>

                  {/* Romantic Setting / Location */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B51F3B]" />
                      <span>Romantic Setting / Venue</span>
                    </label>
                    <input
                      type="text"
                      value={fields.venue || 'City Center & Romantic Dinner'}
                      onChange={(e) => handleFieldChange('venue', e.target.value)}
                      placeholder="e.g. City Center & Romantic Dinner"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#B51F3B]"
                    />
                  </div>

                  {/* Eyebrow Tag */}
                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={fields.eyebrow || "LET'S PLAN"}
                      onChange={(e) => handleFieldChange('eyebrow', e.target.value)}
                      placeholder="e.g. LET'S PLAN"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  {/* Planner Hero Heading */}
                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Main Heading
                    </label>
                    <input
                      type="text"
                      value={fields.headline || 'Our Perfect Date ♡'}
                      onChange={(e) => handleFieldChange('headline', e.target.value)}
                      placeholder="e.g. Our Perfect Date ♡"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  {/* Planner Description / Message */}
                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Invitation Subtitle &amp; Message
                    </label>
                    <textarea
                      rows={2}
                      value={fields.message || "Tell me what you'd love most, and I'll plan every detail for an unforgettable time together."}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="e.g. Tell me what you'd love most..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  {/* Opening Love Note */}
                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Love Note in Envelope
                    </label>
                    <textarea
                      rows={3}
                      value={fields.letterMessage || 'Every moment with you is special. Let\'s make another unforgettable memory together.'}
                      onChange={(e) => handleFieldChange('letterMessage', e.target.value)}
                      placeholder="Write your sweet message here..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>
                </>
              ) : templateKey === 'template-03' ? (
                <>
                  {/* Template 3: South Indian Temple Wedding */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                      Couple&apos;s Names (Groom &amp; Bride)
                    </label>
                    <input
                      type="text"
                      value={fields.names || 'Karthik & Meenakshi'}
                      onChange={(e) => handleFieldChange('names', e.target.value)}
                      placeholder="e.g. Karthik & Meenakshi"
                      className="w-full px-3.5 py-2.5 text-sm font-serif font-medium rounded-lg border border-[#A77B35]/50 bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#A77B35]" />
                        <span>Muhurtham Date</span>
                      </label>
                      <input
                        type="text"
                        value={fields.date || 'Sunday, 14 February 2027'}
                        onChange={(e) => handleFieldChange('date', e.target.value)}
                        placeholder="e.g. Sunday, 14 February 2027"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#A77B35]" />
                        <span>Muhurtham Time</span>
                      </label>
                      <input
                        type="text"
                        value={fields.time || '6:15 AM – 7:45 AM (Muhurtham)'}
                        onChange={(e) => handleFieldChange('time', e.target.value)}
                        placeholder="e.g. 6:15 AM – 7:45 AM"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#A77B35]" />
                        <span>Kalyana Mandapam Venue</span>
                      </label>
                      <input
                        type="text"
                        value={fields.venue || 'Sri Meenakshi Sundareswarar Kalyana Mandapam, Madurai'}
                        onChange={(e) => handleFieldChange('venue', e.target.value)}
                        placeholder="e.g. Sri Meenakshi Sundareswarar Kalyana Mandapam"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1">
                        Kalyana Mandapam City
                      </label>
                      <input
                        type="text"
                        value={fields.city || 'Madurai, Tamil Nadu'}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        placeholder="e.g. Madurai, Tamil Nadu"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  {/* Template 3: Celebration Functions / Auspicious Events */}
                  <div className="pt-3 border-t border-[#EFE7D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8F6E3B] uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-[#A77B35]" />
                        <span>Sacred Festivities &amp; Muhurtham</span>
                      </div>
                      <span className="text-[10px] text-[#A77B35] font-semibold bg-[#F5EEDB] border border-[#DFCDB0] px-2 py-0.5 rounded-full">
                        {(fields.events && fields.events.length) || 4} Events
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(fields.events && fields.events.length > 0 ? fields.events : [
                        { name: 'Nalangu', icon: 'nalangu', date: 'Friday, 12 February 2027', time: '10:00 AM', venue: 'Family ancestral home, Madurai' },
                        { name: 'Jaanavasam', icon: 'jaanavasam', date: 'Saturday, 13 February 2027', time: '5:30 PM', venue: 'Sri Meenakshi Kalyana Mandapam, Madurai' },
                        { name: 'Muhurtham', icon: 'muhurtham', date: 'Sunday, 14 February 2027', time: '6:00 AM – 7:30 AM', venue: 'Sri Meenakshi Sundareswarar Kalyana Mandapam, Madurai' },
                        { name: 'Reception', icon: 'reception', date: 'Sunday, 14 February 2027', time: '7:00 PM Onwards', venue: 'Heritage Royal Hall, Madurai' },
                      ]).map((ev, idx) => (
                        <div key={idx} className="p-3 bg-[#FAF7F0] border border-[#E4D8BA] rounded-xl space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-[#EFE7D5]">
                            <span className="text-xs font-serif font-bold text-[#2C2114]">
                              {idx + 1}. {ev.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-semibold text-[#8F6E3B]">
                                Ceremony {idx + 1}
                              </span>
                              {fields.events && fields.events.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEvent(idx)}
                                  className="text-red-500 hover:text-red-700 p-0.5 rounded"
                                  title="Remove function"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#49341F] mb-0.5">Function Name</label>
                            <input
                              type="text"
                              value={ev.name}
                              onChange={(e) => handleEventChange(idx, 'name', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#8F6E3B] mb-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#A77B35]" />
                                <span>Date</span>
                              </label>
                              <input
                                type="text"
                                value={ev.date || ev.when || ''}
                                onChange={(e) => handleEventChange(idx, 'date', e.target.value)}
                                className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#8F6E3B] mb-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#A77B35]" />
                                <span>Time</span>
                              </label>
                              <input
                                type="text"
                                value={ev.time || ''}
                                onChange={(e) => handleEventChange(idx, 'time', e.target.value)}
                                className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#49341F] mb-0.5">Temple / Mandapam Venue</label>
                            <input
                              type="text"
                              value={ev.venue || ev.where || ''}
                              onChange={(e) => handleEventChange(idx, 'venue', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddEvent}
                        className="w-full py-2 px-3 border border-dashed border-[#A77B35] rounded-xl text-xs font-medium text-[#8F6E3B] hover:bg-[#FAF7F0] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Celebration Function</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-medium text-[#49341F] mb-1">
                        Groom&apos;s Parents
                      </label>
                      <input
                        type="text"
                        value={fields.groomParents || 'Smt. Kalyani & Shri Sundaram'}
                        onChange={(e) => handleFieldChange('groomParents', e.target.value)}
                        placeholder="Smt. Kalyani & Shri Sundaram"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#49341F] mb-1">
                        Bride&apos;s Parents
                      </label>
                      <input
                        type="text"
                        value={fields.brideParents || 'Smt. Saraswathi & Shri Ramanathan'}
                        onChange={(e) => handleFieldChange('brideParents', e.target.value)}
                        placeholder="Smt. Saraswathi & Shri Ramanathan"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Family &amp; Host Lineages
                    </label>
                    <input
                      type="text"
                      value={fields.host || 'Sundaram & Kalyani / Ramanathan & Saraswathi Families'}
                      onChange={(e) => handleFieldChange('host', e.target.value)}
                      placeholder="e.g. Sundaram & Kalyani Families"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Invitation Blessings Message
                    </label>
                    <textarea
                      rows={3}
                      value={fields.message || ''}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="Invitation message..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>
                </>
              ) : templateKey === 'template-02' ? (
                <>
                  {/* Template 2: Arjun & Sia Royal Heritage */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                      Couple&apos;s Names
                    </label>
                    <input
                      type="text"
                      value={fields.names || 'Arjun & Sia'}
                      onChange={(e) => handleFieldChange('names', e.target.value)}
                      placeholder="e.g. Arjun & Sia"
                      className="w-full px-3.5 py-2.5 text-sm font-serif font-medium rounded-lg border border-[#A77B35]/50 bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#A77B35]" />
                        <span>Wedding Date</span>
                      </label>
                      <input
                        type="text"
                        value={fields.date || 'Saturday, 13 February 2027'}
                        onChange={(e) => handleFieldChange('date', e.target.value)}
                        placeholder="e.g. Saturday, 13 February 2027"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#A77B35]" />
                        <span>Muhurat / Time</span>
                      </label>
                      <input
                        type="text"
                        value={fields.time || '7:30 PM Onwards'}
                        onChange={(e) => handleFieldChange('time', e.target.value)}
                        placeholder="e.g. 7:30 PM Onwards"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#A77B35]" />
                        <span>Royal Palace Venue</span>
                      </label>
                      <input
                        type="text"
                        value={fields.venue || 'Rambagh Palace, Jaipur'}
                        onChange={(e) => handleFieldChange('venue', e.target.value)}
                        placeholder="e.g. Rambagh Palace, Jaipur"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1">
                        City &amp; State
                      </label>
                      <input
                        type="text"
                        value={fields.city || 'Jaipur, Rajasthan'}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        placeholder="e.g. Jaipur, Rajasthan"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* WEDDING FUNCTIONS & ITINERARY (Haldi, Mehendi, Sangeet, Wedding, Reception) */}
                  {/* ======================================================== */}
                  <div className="pt-3 border-t border-[#EFE7D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8F6E3B] uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-[#A77B35]" />
                        <span>Wedding Functions &amp; Itinerary</span>
                      </div>
                      <span className="text-[10px] text-[#A77B35] font-semibold bg-[#F5EEDB] border border-[#DFCDB0] px-2 py-0.5 rounded-full">
                        {(fields.events && fields.events.length) || 5} Celebrations
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A634E] leading-normal">
                      Customize dates, times, and venues for each ceremony. Changes update the event cards in the live preview immediately!
                    </p>

                    <div className="space-y-3">
                      {(fields.events && fields.events.length > 0 ? fields.events : [
                        { name: 'Haldi', icon: 'haldi', date: 'Friday, 12 February 2027', time: '10:00 AM', venue: 'Family home, Jaipur' },
                        { name: 'Mehendi', icon: 'mehendi', date: 'Friday, 12 February 2027', time: '4:00 PM', venue: 'The courtyard, Jaipur' },
                        { name: 'Sangeet', icon: 'sangeet', date: 'Friday, 12 February 2027', time: '8:00 PM', venue: 'Rooftop lawns, Jaipur' },
                        { name: 'Wedding', icon: 'wedding', date: 'Saturday, 13 February 2027', time: '7:30 PM', venue: 'Rambagh Palace, Jaipur' },
                        { name: 'Reception', icon: 'reception', date: 'Sunday, 14 February 2027', time: '8:00 PM', venue: 'Rambagh Palace, Jaipur' },
                      ]).map((ev, idx) => (
                        <div key={idx} className="p-3.5 bg-[#FAF7F0] border border-[#E4D8BA] rounded-xl space-y-2.5 transition-all hover:border-[#A77B35] shadow-xs">
                          <div className="flex items-center justify-between pb-1.5 border-b border-[#EFE7D5]">
                            <span className="text-xs font-serif font-bold text-[#2C2114] flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-[#8F6E3B] text-white text-[10px] flex items-center justify-center font-sans font-bold">
                                {idx + 1}
                              </span>
                              {ev.name || `Event ${idx + 1}`}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10.5px] uppercase font-semibold text-[#8F6E3B]">
                                Ceremony {idx + 1}
                              </span>
                              {fields.events && fields.events.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEvent(idx)}
                                  className="text-red-500 hover:text-red-700 p-0.5 rounded"
                                  title="Remove celebration"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-[#49341F] mb-1">
                              Function Name
                            </label>
                            <input
                              type="text"
                              value={ev.name}
                              onChange={(e) => handleEventChange(idx, 'name', e.target.value)}
                              placeholder="e.g. Haldi"
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DFCEAF] bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#A77B35]" />
                                <span>Date</span>
                              </label>
                              <input
                                type="text"
                                value={ev.date || ev.when || ''}
                                onChange={(e) => handleEventChange(idx, 'date', e.target.value)}
                                placeholder="e.g. Friday, 12 February 2027"
                                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DFCEAF] bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B35] font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#8F6E3B] mb-1 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#A77B35]" />
                                <span>Time</span>
                              </label>
                              <input
                                type="text"
                                value={ev.time || ''}
                                onChange={(e) => handleEventChange(idx, 'time', e.target.value)}
                                placeholder="e.g. 10:00 AM"
                                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DFCEAF] bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-[#49341F] mb-1">
                              Venue / Location &amp; Directions
                            </label>
                            <input
                              type="text"
                              value={ev.venue || ev.where || ''}
                              onChange={(e) => handleEventChange(idx, 'venue', e.target.value)}
                              placeholder="e.g. Family home, Jaipur"
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DFCEAF] bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddEvent}
                        className="w-full py-2 px-3 border border-dashed border-[#A77B35] rounded-xl text-xs font-medium text-[#8F6E3B] hover:bg-[#FAF7F0] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Celebration Function</span>
                      </button>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* FAMILY HOSTS & ELDERS */}
                  {/* ======================================================== */}
                  <div className="pt-3 border-t border-[#EFE7D5] space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8F6E3B] uppercase tracking-wider">
                      <Heart className="w-3.5 h-3.5 text-[#A77B35]" />
                      <span>Family Hosts &amp; Elders</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#49341F] mb-1">
                          Groom&apos;s Parents
                        </label>
                        <input
                          type="text"
                          value={fields.groomParents || 'Smt. Madhuri & Shri Prakash Joshi'}
                          onChange={(e) => handleFieldChange('groomParents', e.target.value)}
                          placeholder="Smt. Madhuri & Shri Prakash Joshi"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#49341F] mb-1">
                          Bride&apos;s Parents
                        </label>
                        <input
                          type="text"
                          value={fields.brideParents || 'Smt. Hema & Shri Kiran Vyas'}
                          onChange={(e) => handleFieldChange('brideParents', e.target.value)}
                          placeholder="Smt. Hema & Shri Kiran Vyas"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#49341F] mb-1">
                        Hosted By / Family Lineage
                      </label>
                      <input
                        type="text"
                        value={fields.host || 'The Joshi and Vyas families'}
                        onChange={(e) => handleFieldChange('host', e.target.value)}
                        placeholder="e.g. The Joshi and Vyas families"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      RSVP / WhatsApp Line
                    </label>
                    <input
                      type="text"
                      value={fields.rsvp || 'RSVP on WhatsApp (+91 919876543210)'}
                      onChange={(e) => handleFieldChange('rsvp', e.target.value)}
                      placeholder="RSVP details..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Personal Message
                    </label>
                    <textarea
                      rows={3}
                      value={fields.message || ''}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="Personal message..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Template 1: The Royal Navy Wedding */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                      Couple&apos;s Names
                    </label>
                    <input
                      type="text"
                      value={fields.names || 'Aarav & Riya'}
                      onChange={(e) => handleFieldChange('names', e.target.value)}
                      placeholder="e.g. Aarav & Riya"
                      className="w-full px-3.5 py-2.5 text-sm font-serif font-medium rounded-lg border border-[#A77B35]/50 bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1">
                        Wedding Date
                      </label>
                      <input
                        type="text"
                        value={fields.date || 'Friday, 18 December 2026'}
                        onChange={(e) => handleFieldChange('date', e.target.value)}
                        placeholder="e.g. Friday, 18 December 2026"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1">
                        Muhurat / Time
                      </label>
                      <input
                        type="text"
                        value={fields.time || '5:00 PM Onwards'}
                        onChange={(e) => handleFieldChange('time', e.target.value)}
                        placeholder="e.g. 5:00 PM Onwards"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1">
                        Royal Venue
                      </label>
                      <input
                        type="text"
                        value={fields.venue || 'The Heritage Palace & Gardens'}
                        onChange={(e) => handleFieldChange('venue', e.target.value)}
                        placeholder="e.g. The Heritage Palace"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1">
                        City &amp; State
                      </label>
                      <input
                        type="text"
                        value={fields.city || 'Jaipur, Rajasthan'}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        placeholder="e.g. Jaipur, Rajasthan"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1">
                        Bride&apos;s Parents
                      </label>
                      <input
                        type="text"
                        value={fields.brideParents || ''}
                        onChange={(e) => handleFieldChange('brideParents', e.target.value)}
                        placeholder="Mrs. Gayatri & Dr. Harshvardhan Kapoor"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#49341F] mb-1">
                        Groom&apos;s Parents
                      </label>
                      <input
                        type="text"
                        value={fields.groomParents || ''}
                        onChange={(e) => handleFieldChange('groomParents', e.target.value)}
                        placeholder="Mrs. Sunita & Mr. Vikramaditya Singhania"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                      />
                    </div>
                  </div>

                  {/* Template 1: Wedding Celebration Events */}
                  <div className="pt-3 border-t border-[#EFE7D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8F6E3B] uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-[#A77B35]" />
                        <span>Wedding Functions &amp; Itinerary</span>
                      </div>
                      <span className="text-[10px] text-[#A77B35] font-semibold bg-[#F5EEDB] border border-[#DFCDB0] px-2 py-0.5 rounded-full">
                        {(fields.events && fields.events.length) || 4} Functions
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(fields.events && fields.events.length > 0 ? fields.events : [
                        { name: 'Haldi Ceremony', icon: 'haldi', date: 'Thursday, 17 December 2026', time: '10:00 AM', venue: 'The Courtyard, Jaipur' },
                        { name: 'Mehendi & Sangeet', icon: 'mehendi', date: 'Thursday, 17 December 2026', time: '6:30 PM', venue: 'The Royal Lawns, Jaipur' },
                        { name: 'Wedding Ceremony', icon: 'wedding', date: 'Friday, 18 December 2026', time: '5:00 PM', venue: 'The Heritage Palace, Jaipur' },
                        { name: 'Grand Reception', icon: 'reception', date: 'Saturday, 19 December 2026', time: '8:00 PM', venue: 'Palace Ballroom, Jaipur' },
                      ]).map((ev, idx) => (
                        <div key={idx} className="p-3 bg-[#FAF7F0] border border-[#E4D8BA] rounded-xl space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-[#EFE7D5]">
                            <span className="text-xs font-serif font-bold text-[#2C2114]">
                              {idx + 1}. {ev.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-semibold text-[#8F6E3B]">
                                Function {idx + 1}
                              </span>
                              {fields.events && fields.events.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEvent(idx)}
                                  className="text-red-500 hover:text-red-700 p-0.5 rounded"
                                  title="Remove function"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#49341F] mb-0.5">Function Name</label>
                            <input
                              type="text"
                              value={ev.name}
                              onChange={(e) => handleEventChange(idx, 'name', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#8F6E3B] mb-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#A77B35]" />
                                <span>Date</span>
                              </label>
                              <input
                                type="text"
                                value={ev.date || ev.when || ''}
                                onChange={(e) => handleEventChange(idx, 'date', e.target.value)}
                                className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#8F6E3B] mb-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#A77B35]" />
                                <span>Time</span>
                              </label>
                              <input
                                type="text"
                                value={ev.time || ''}
                                onChange={(e) => handleEventChange(idx, 'time', e.target.value)}
                                className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#49341F] mb-0.5">Venue Location</label>
                            <input
                              type="text"
                              value={ev.venue || ev.where || ''}
                              onChange={(e) => handleEventChange(idx, 'venue', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-[#DFCEAF] bg-white focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddEvent}
                        className="w-full py-2 px-3 border border-dashed border-[#A77B35] rounded-xl text-xs font-medium text-[#8F6E3B] hover:bg-[#FAF7F0] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Celebration Function</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#49341F] mb-1">
                      Personal Invitation Message
                    </label>
                    <textarea
                      rows={3}
                      value={fields.message || ''}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="Invitation message..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                  </div>
                </>
              )}

              {/* ======================================================== */}
              {/* PHOTO & VISUAL FRAMING STUDIO (Fix cutting & reposition) */}
              {/* ======================================================== */}
              <div className="pt-5 border-t border-[#EFE7D5] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8F6E3B] uppercase tracking-wider">
                    <Camera className="w-3.5 h-3.5 text-[#A77B35]" />
                    <span>Photo &amp; Framing Studio</span>
                  </div>
                  <span className="text-[10px] text-[#A77B35] font-semibold bg-[#F5EEDB] border border-[#DFCDB0] px-2 py-0.5 rounded-full">
                    Visual Framing
                  </span>
                </div>
                <p className="text-[11px] text-[#7A634E] leading-normal">
                  Upload your photo and adjust framing sliders so faces, outfits, or celebration elements are never cut off.
                </p>

                {/* Status / Alert Messages */}
                {photoUploadSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{photoUploadSuccess}</span>
                  </div>
                )}
                {photoUploadError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[11px] font-medium flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{photoUploadError}</span>
                  </div>
                )}

                {/* Photo Upload & Preview Grid */}
                <div className="p-3.5 bg-[#FAF7F0] border border-[#E4D8BA] rounded-xl space-y-3">
                  <div className="flex items-start gap-3.5">
                    {/* Live Mini Preview with exact Framing applied */}
                    <div className="relative w-24 h-28 rounded-xl overflow-hidden border-2 border-[#A77B35] bg-black/10 shrink-0 shadow-inner">
                      <img
                        src={getEffectivePhoto()}
                        alt="Framed Photo Preview"
                        className="w-full h-full transition-all duration-150"
                        style={{
                          objectFit: fields.photoFit || 'cover',
                          objectPosition: `${fields.photoPositionX ?? 50}% ${fields.photoPositionY ?? 50}%`,
                          transform: `scale(${fields.photoScale ?? 1})`,
                        }}
                      />
                      <div className="absolute inset-0 border border-white/30 rounded-xl pointer-events-none" />
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded font-mono">
                        Preview
                      </span>
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-2">
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="w-full py-2 px-3 rounded-lg bg-[#A77B35] hover:bg-[#8F6E3B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        {isUploadingPhoto ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading Photo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New Photo</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          value={customPhotoUrlInput}
                          onChange={(e) => setCustomPhotoUrlInput(e.target.value)}
                          placeholder="Or paste photo URL..."
                          className="flex-1 px-2 py-1 text-[11px] rounded border border-[#DFCEAF] bg-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCustomPhotoUrl}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF5EA] hover:bg-[#F2ECE0] text-[#5C4523] border border-[#DFCDB0] rounded transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Framing Adjustments */}
                  <div className="pt-3 border-t border-[#EFE7D5] space-y-3">
                    {/* Fit Mode */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8F6E3B] mb-1">
                        Frame Fit Style
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoFit', 'cover')}
                          className={`py-1.5 px-2 text-xs rounded-lg border font-medium transition-all ${
                            (fields.photoFit || 'cover') === 'cover'
                              ? 'bg-[#8F6E3B] text-white border-[#8F6E3B]'
                              : 'bg-white text-[#49341F] border-[#DFCEAF] hover:bg-[#FAF7F0]'
                          }`}
                        >
                          Fill Frame (Cover)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoFit', 'contain')}
                          className={`py-1.5 px-2 text-xs rounded-lg border font-medium transition-all ${
                            fields.photoFit === 'contain'
                              ? 'bg-[#8F6E3B] text-white border-[#8F6E3B]'
                              : 'bg-white text-[#49341F] border-[#DFCEAF] hover:bg-[#FAF7F0]'
                          }`}
                        >
                          Show Full (No Cut)
                        </button>
                      </div>
                    </div>

                    {/* Vertical Position (Move Up / Down) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#49341F] mb-1">
                        <span className="flex items-center gap-1">
                          <MoveVertical className="w-3 h-3 text-[#A77B35]" />
                          <span>Vertical Position (Fix Top/Bottom Cutting)</span>
                        </span>
                        <span className="font-mono text-[#8F6E3B]">{fields.photoPositionY ?? 50}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={fields.photoPositionY ?? 50}
                        onChange={(e) => handleFieldChange('photoPositionY', Number(e.target.value))}
                        className="w-full accent-[#A77B35] cursor-pointer"
                      />
                      <div className="flex items-center justify-between text-[10px] text-[#8F6E3B] mt-1">
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoPositionY', 10)}
                          className="hover:underline"
                        >
                          Top (10%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoPositionY', 50)}
                          className="hover:underline font-semibold"
                        >
                          Center (50%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoPositionY', 85)}
                          className="hover:underline font-semibold text-[#B62A42]"
                          title="Pulls photo up so cupcakes, hands, or outfits at bottom aren't cut"
                        >
                          Show Bottom (85%)
                        </button>
                      </div>
                    </div>

                    {/* Horizontal Position (Move Left / Right) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#49341F] mb-1">
                        <span className="flex items-center gap-1">
                          <MoveHorizontal className="w-3 h-3 text-[#A77B35]" />
                          <span>Horizontal Position (Left / Right)</span>
                        </span>
                        <span className="font-mono text-[#8F6E3B]">{fields.photoPositionX ?? 50}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={fields.photoPositionX ?? 50}
                        onChange={(e) => handleFieldChange('photoPositionX', Number(e.target.value))}
                        className="w-full accent-[#A77B35] cursor-pointer"
                      />
                      <div className="flex items-center justify-between text-[10px] text-[#8F6E3B] mt-1">
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoPositionX', 15)}
                          className="hover:underline"
                        >
                          Left (15%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoPositionX', 50)}
                          className="hover:underline font-semibold"
                        >
                          Center (50%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoPositionX', 85)}
                          className="hover:underline"
                        >
                          Right (85%)
                        </button>
                      </div>
                    </div>

                    {/* Zoom / Scale */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#49341F] mb-1">
                        <span className="flex items-center gap-1">
                          <ZoomIn className="w-3 h-3 text-[#A77B35]" />
                          <span>Scale &amp; Zoom</span>
                        </span>
                        <span className="font-mono text-[#8F6E3B]">
                          {Math.round((fields.photoScale ?? 1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.7}
                        max={1.5}
                        step={0.05}
                        value={fields.photoScale ?? 1}
                        onChange={(e) => handleFieldChange('photoScale', Number(e.target.value))}
                        className="w-full accent-[#A77B35] cursor-pointer"
                      />
                      <div className="flex items-center justify-between text-[10px] text-[#8F6E3B] mt-1">
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoScale', 0.85)}
                          className="hover:underline"
                        >
                          Fit In (85%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoScale', 1)}
                          className="hover:underline font-semibold"
                        >
                          Original (100%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('photoScale', 1.2)}
                          className="hover:underline"
                        >
                          Zoom In (120%)
                        </button>
                      </div>
                    </div>

                    {/* Reset Framing Button */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          handleFieldChange('photoPositionY', 50);
                          handleFieldChange('photoPositionX', 50);
                          handleFieldChange('photoScale', 1);
                          handleFieldChange('photoFit', 'cover');
                        }}
                        className="text-[10.5px] text-[#7A634E] hover:text-[#2C2114] flex items-center gap-1 underline cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset to Default Framing</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* SAVE & APPLY CHANGES BUTTON (At the end of Details)     */}
              {/* ======================================================== */}
              <div className="pt-4 border-t border-[#DFCDB0] sticky bottom-0 bg-[#FFFDF9]/95 backdrop-blur-md p-4 -mx-6 -mb-6 shadow-[0_-8px_25px_rgba(73,52,31,0.08)] z-20 space-y-2">
                <button
                  type="button"
                  onClick={handleManualSave}
                  disabled={isDraftSaving}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#8F6E3B] via-[#A77B35] to-[#7A5722] hover:from-[#7A5722] hover:to-[#8F6E3B] text-white font-serif font-bold text-sm tracking-wide shadow-lg shadow-[#A77B35]/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] cursor-pointer"
                >
                  {saveBannerMessage ? (
                    <>
                      <Check className="w-4.5 h-4.5 text-emerald-300" />
                      <span>{saveBannerMessage}</span>
                    </>
                  ) : isDraftSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving &amp; Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#FFF2D4]" />
                      <span>Save &amp; Apply Changes</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[10.5px] text-[#8F6E3B]">
                  ✦ Saves all custom dates, names, venues &amp; photos to your invitation preview.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MUSIC FREEDOM ("USE WHATEVER SONG WE WANT") */}
          {activeTab === 'music' && (
            <div className="p-6 space-y-6">
              {/* Introduction Note */}
              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E8DFC8] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8F6E3B] uppercase tracking-wider">
                  <Music className="w-4 h-4" />
                  <span>Music Freedom Studio</span>
                </div>
                <p className="text-xs text-[#5C4523] leading-relaxed">
                  Choose from our curated iconic soundtracks, <strong>upload your own song</strong> from your device, or paste any audio URL. Crop the start time just like an Instagram Story!
                </p>
              </div>

              {/* Real-time Status / Alert Banners */}
              {isUploadingAudio && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2.5 text-xs font-semibold animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                  <span>Uploading your audio to You Are Mine cloud...</span>
                </div>
              )}

              {audioUploadMessage && (
                <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-900 flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{audioUploadMessage}</span>
                </div>
              )}

              {audioUploadError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{audioUploadError}</span>
                </div>
              )}

              {/* SECTION A: Upload Custom Song */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#2C2114] uppercase tracking-wider">
                  📁 Option 1: Upload Your Own Song (MP3 / Audio)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*,.mp3,.wav,.aac,.m4a,.ogg"
                  onChange={handleAudioUpload}
                  disabled={isUploadingAudio}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingAudio}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full p-4 rounded-xl border-2 border-dashed border-[#A77B35] bg-[#FFFDF9] hover:bg-[#FAF5EA] text-[#5C4523] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group ${isUploadingAudio ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                >
                  {isUploadingAudio ? (
                    <Loader2 className="w-6 h-6 text-[#A77B35] animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-[#A77B35] group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-xs font-bold text-[#2C2114]">
                    {isUploadingAudio ? 'Uploading Song...' : 'Choose Song From Your Device'}
                  </span>
                  <span className="text-[11px] text-[#7A634E]">
                    Supports MP3, WAV, AAC, M4A &bull; Plays instantly
                  </span>
                </button>
              </div>

              {/* SECTION B: Custom Web Audio URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#2C2114] uppercase tracking-wider">
                  🔗 Option 2: Paste Any Direct Audio Link
                </label>
                <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/your-song.mp3"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#8F6E3B] text-white text-xs font-semibold hover:bg-[#7D5F31] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              </div>

              {/* SECTION C: Curated Iconic Library */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#2C2114] uppercase tracking-wider">
                  ✨ Option 3: Curated Master Soundtracks
                </label>
                <div className="space-y-2">
                  {SONG_LIBRARY.map((song) => {
                    const isSelected = fields.audioSource === song.source;
                    return (
                      <button
                        key={song.id}
                        type="button"
                        onClick={() => handleSelectSong(song)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${isSelected
                          ? 'bg-[#FAF7F0] border-[#8F6E3B] ring-1 ring-[#8F6E3B] shadow-sm'
                          : 'bg-white border-[#E8DFC8] hover:bg-[#FAF7F2]'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isSelected
                              ? 'bg-[#8F6E3B] text-white'
                              : 'bg-[#F2ECE0] text-[#6B533E]'
                              }`}
                          >
                            <Music className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-[#2C2114]">
                              {song.title}
                            </span>
                            <span className="text-[10px] text-[#7A634E]">
                              {song.artist}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-[#8F6E3B]/10 text-[#8F6E3B] text-[10px] font-bold">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION D: Instagram Story-Style Live Trimmer & Scrubber */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#182338] to-[#0E1524] border border-[#D6B477]/40 text-[#FAF5ED] shadow-luxury space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#D6B477] text-[#091321] flex items-center justify-center font-bold text-sm shadow-md">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#FFFDF7] tracking-wide">
                          {fields.songTitle || 'Current Soundtrack'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-[#D6B477]/20 border border-[#D6B477]/40 text-[9px] font-semibold text-[#E7CEA0]">
                          Story Trimmer
                        </span>
                      </div>
                      <span className="text-[10px] text-[#A7B5CC]">
                        Live Audio Cropping &bull; Instant Preview
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleAudioPreview}
                    className="px-3.5 py-1.5 rounded-full bg-[#D6B477] hover:bg-[#E7CEA0] text-[#091321] text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Play</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Waveform graphic */}
                <div className="relative pt-2 pb-1">
                  <div className="h-9 flex items-center justify-between gap-[2px] px-1 pointer-events-none opacity-85">
                    {[
                      35, 45, 20, 60, 80, 50, 90, 40, 75, 95, 30, 85, 100, 70, 90,
                      60, 40, 80, 100, 85, 60, 95, 75, 50, 90, 100, 80, 65, 45, 30,
                      85, 95, 70, 90, 100, 60, 85, 40, 60, 35
                    ].map((height, i) => {
                      const barTime = (i / 40) * audioDuration;
                      const selectedStart = Number(fields.audioStartTime) || 0;
                      const isHighlighted = barTime >= selectedStart && barTime <= selectedStart + 35;
                      const isPlayed = barTime <= audioCurrentTime;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-150 ${isPlayed
                            ? 'bg-[#E5A842] shadow-[0_0_8px_rgba(229,168,66,0.8)]'
                            : isHighlighted
                              ? 'bg-[#D6B477]/70'
                              : 'bg-white/20'
                            }`}
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={Math.max(60, audioDuration - 15)}
                    step="1"
                    value={Number(fields.audioStartTime) || 0}
                    onChange={(e) => handleSeekAudio(Number(e.target.value))}
                    className="w-full h-2 bg-[#253552] rounded-lg appearance-none cursor-pointer accent-[#E5A842] mt-2"
                  />

                  <div className="flex items-center justify-between text-[10px] text-[#A7B5CC] font-mono mt-1">
                    <span>
                      Crop Start:{' '}
                      <strong className="text-[#E5A842]">
                        {formatSeconds(Number(fields.audioStartTime) || 0)}
                      </strong>
                    </span>
                    <span>
                      Playing:{' '}
                      <strong className="text-[#FFFDF7]">
                        {formatSeconds(audioCurrentTime)}
                      </strong>{' '}
                      / {formatSeconds(audioDuration)}
                    </span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="block text-[10px] font-semibold text-[#D6B477] uppercase tracking-wider mb-1.5">
                    ⚡ Quick Crop Moments:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { label: 'Start (0:00)', time: 0, note: 'Intro hook' },
                      { label: 'Vocals (0:15)', time: 15, note: 'Opening verse' },
                      { label: 'Chorus (0:45)', time: 45, note: 'Drop / Climax' },
                      { label: 'BGM (1:15)', time: 75, note: 'Orchestral' },
                    ].map((preset) => {
                      const isSelected = (Number(fields.audioStartTime) || 0) === preset.time;
                      return (
                        <button
                          key={preset.time}
                          type="button"
                          onClick={() => handleSeekAudio(preset.time)}
                          className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold text-center transition-all cursor-pointer border ${isSelected
                            ? 'bg-[#E5A842] text-[#0E1524] border-[#E5A842] shadow-sm font-bold scale-[1.02]'
                            : 'bg-[#152136] text-[#E2D5BE] border-[#2B3A59] hover:border-[#D6B477]/60 hover:bg-[#1E2E4A]'
                            }`}
                        >
                          <div>{preset.label}</div>
                          <div className={`text-[9px] ${isSelected ? 'text-[#0E1524]/80' : 'text-[#8A9DBA]'}`}>
                            {preset.note}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Try-Before-You-Publish Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        draftId={draftId || undefined}
        template={baseTemplate}
        customFields={fields}
        customDesign={design}
        onPublished={(slug, url) => {
          console.log('Successfully published invitation:', url);
        }}
      />
    </div>
  );
}
