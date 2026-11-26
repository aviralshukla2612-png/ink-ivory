import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Sparkles,
  Phone,
  Send,
  Navigation,
  Music,
  Edit3,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MusicService } from '../../services/music.service';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

/**
 * Universal occasion & template helper
 */
function resolveTemplateCategory(template, draftData) {
  const id = String(template?.id || draftData?.templateId || '').toLowerCase();
  const occasion = String(template?.occasion || draftData?.occasion || 'Wedding').toLowerCase();

  const isBirthday = occasion.includes('birthday') || id.includes('birthday');
  const isValentine = occasion.includes('valentin') || id.includes('valentin') || id.includes('date-planner');
  const isTempleWedding = id.includes('thirumanam') || id.includes('south-indian') || id.includes('temple') || id.includes('garden-03') || id.includes('indian-05');
  const isLakePalace = id.includes('lake') || id.includes('anniversary-gold-02') || id.includes('arjun');
  const isUdaipurPalace = id.includes('udaipur') || id.includes('paper-palace') || id.includes('palace-04');
  const isNavyWedding = id.includes('navy') || id === 'tpl-wedding-navy-01';

  return {
    isBirthday,
    isValentine,
    isTempleWedding,
    isLakePalace,
    isUdaipurPalace,
    isNavyWedding,
    isWedding: !isBirthday && !isValentine,
  };
}

/**
 * RoyalMultiSlidePresentation
 * Universal Multi-Slide Presentation dynamically adapting to ALL 8 celebration templates:
 * - Wedding (Royal Navy, Lake Palace, Thirumanam Temple, Udaipur Palace, Traditional South Indian)
 * - Birthday (Golden Birthday Surprise with Cake, Memories & Festivity Itinerary)
 * - Valentine / Proposal (Will You Be My Valentine? & Our Date Planner with Love Letter & Say Yes)
 */
export function RoyalMultiSlidePresentation({
  template,
  draftData,
  onCustomize,
  isEditable = false,
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const initialFields = draftData?.fields || template?.defaultFields || {};
  const category = resolveTemplateCategory(template, draftData);

  const defaultNames =
    template?.title?.includes('—')
      ? template.title.split('—')[0].trim()
      : category.isBirthday
      ? 'Ananya'
      : category.isValentine
      ? 'Aarav & Riya'
      : 'Aarav & Riya';

  const [customFields, setCustomFields] = useState({
    names: initialFields.names || defaultNames,
    date: initialFields.date || initialFields.weddingDate || 'Friday, 18 December 2026',
    time: initialFields.time || (category.isBirthday ? '7:00 PM Onwards' : '5:00 PM Onwards'),
    venue: initialFields.venue || initialFields.venueName || (category.isBirthday ? 'The Grand Champagne Terrace' : 'The Heritage Palace & Gardens'),
    city: initialFields.city || (category.isBirthday ? 'Mumbai' : 'Jaipur, Rajasthan'),
    brideParents: initialFields.brideParents || (category.isTempleWedding ? 'Smt. Saraswathi & Shri Ramanathan' : 'Mrs. Gayatri & Dr. Harshvardhan Kapoor'),
    groomParents: initialFields.groomParents || (category.isTempleWedding ? 'Smt. Kalyani & Shri Sundaram' : 'Mrs. Sunita & Mr. Vikramaditya Singhania'),
    message: initialFields.message || (
      category.isBirthday
        ? 'To the one who makes life more special, may your day be as beautiful, kind and happy as you are.'
        : category.isValentine
        ? 'Someone has a very special question for you. A sealed digital love letter waiting to be opened with all my heart.'
        : 'Request the honour of your graceful presence and pious blessings to celebrate this eternal union.'
    ),
    letterMessage: initialFields.letterMessage || 'Today is all about celebrating you. I hope your life is always filled with laughter, beautiful memories, exciting adventures, and people who make you feel as special as you truly are. Never stop dreaming and smiling!',
    rsvpPhone: initialFields.rsvpPhone || initialFields.rsvp || '+91 98765 43210',
    host: initialFields.host || (category.isBirthday ? 'Planned with love by Kabir' : category.isValentine ? 'With all my love, Aarav' : 'Kapoor & Singhania Families'),
  });

  const scrollRef = useRef(null);

  // Background soundtrack resolution
  useEffect(() => {
    let mounted = true;
    const playAudio = async () => {
      try {
        let audioSrc = initialFields.audioSource;
        if (!audioSrc) {
          if (category.isBirthday) {
            audioSrc = 'https://assets.mixkit.co/music/preview/mixkit-happy-birthday-to-you-guitar-and-flute-495.mp3';
          } else if (category.isValentine) {
            audioSrc = 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-flute-and-guitar-634.mp3';
          } else if (category.isTempleWedding) {
            audioSrc = 'https://assets.mixkit.co/music/preview/mixkit-indian-traditional-sitar-and-tabla-celebration-605.mp3';
          } else {
            audioSrc = 'https://assets.mixkit.co/music/preview/mixkit-classical-sitar-indian-wedding-theme-604.mp3';
          }
        }

        if (typeof MusicService?.playSound === 'function') {
          await MusicService.playSound(audioSrc, {
            title: initialFields.songTitle || 'Celebration Melody',
            startTime: Number(initialFields.audioStartTime) || 0,
          });
          if (mounted) setIsPlayingMusic(true);
        }
      } catch (e) {
        // Safe audio catch
      }
    };
    playAudio();

    return () => {
      mounted = false;
      try {
        if (typeof MusicService?.stopPreview === 'function') {
          MusicService.stopPreview().catch(() => {});
        } else if (typeof MusicService?.stop === 'function') {
          MusicService.stop().catch(() => {});
        }
      } catch (e) {}
    };
  }, []);

  const toggleSound = async () => {
    try {
      if (isPlayingMusic) {
        if (typeof MusicService?.pauseSound === 'function') {
          await MusicService.pauseSound();
        } else if (typeof MusicService?.pause === 'function') {
          await MusicService.pause();
        }
        setIsPlayingMusic(false);
      } else {
        const audioSrc = initialFields.audioSource || 'https://assets.mixkit.co/music/preview/mixkit-classical-sitar-indian-wedding-theme-604.mp3';
        if (typeof MusicService?.playSound === 'function') {
          await MusicService.playSound(audioSrc);
        } else if (typeof MusicService?.play === 'function') {
          await MusicService.play(audioSrc);
        }
        setIsPlayingMusic(true);
      }
    } catch (e) {}
  };

  const totalSlides = 6;

  const goToSlide = (idx) => {
    const clamped = Math.max(0, Math.min(totalSlides - 1, idx));
    setActiveSlide(clamped);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: clamped * Math.min(WINDOW_WIDTH, 440), animated: true });
    }
  };

  const handleScroll = (event) => {
    const slideWidth = Math.min(WINDOW_WIDTH, 440);
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideWidth);
    if (index !== activeSlide) {
      setActiveSlide(index);
    }
  };

  const slideWidth = Math.min(WINDOW_WIDTH, 440);

  const openWhatsAppRSVP = () => {
    let msgText = '';
    if (category.isBirthday) {
      msgText = `Happy Birthday ${customFields.names}! 🎉 We will joyfully attend your celebration on ${customFields.date} at ${customFields.venue}.`;
    } else if (category.isValentine) {
      msgText = `Yes, with all my heart! ❤️ Happy Valentine's Day!`;
    } else {
      msgText = `Heartiest Congratulations ${customFields.names}! We joyfully confirm our attendance for your wedding on ${customFields.date} at ${customFields.venue}.`;
    }
    const encoded = encodeURIComponent(msgText);
    Linking.openURL(`https://wa.me/?text=${encoded}`).catch(() => {
      Alert.alert('RSVP Confirmation', 'Thank you for your blessings!');
    });
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${customFields.venue}, ${customFields.city}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => {});
  };

  // Dynamic itinerary events
  const rawEvents = initialFields.events;
  const eventsList = Array.isArray(rawEvents) && rawEvents.length > 0
    ? rawEvents.map((ev, idx) => ({
        id: `ev-${idx}`,
        name: ev.name || ev.title || 'Ceremony',
        date: ev.date || customFields.date,
        time: ev.time || customFields.time,
        venue: ev.venue || customFields.venue,
        icon:
          ev.icon === 'haldi' ? '✨' :
          ev.icon === 'mehendi' ? '🌿' :
          ev.icon === 'sangeet' ? '🪕' :
          ev.icon === 'wedding' ? '🔥' :
          ev.icon === 'reception' ? '👑' :
          ev.icon === 'nalangu' ? '🪔' :
          ev.icon === 'muhurtham' ? '🕉️' : '🌸',
        color: '#D7B875',
      }))
    : category.isBirthday
    ? [
        { id: 'b1', name: 'Welcome Drinks & Mocktails', date: customFields.date, time: '6:30 PM', venue: customFields.venue, icon: '🥂', color: '#EAB308' },
        { id: 'b2', name: 'Grand Cake Cutting Ceremony', date: customFields.date, time: '7:30 PM', venue: 'Center Stage', icon: '🎂', color: '#EC4899' },
        { id: 'b3', name: 'Live Band & DJ Night', date: customFields.date, time: '8:30 PM', venue: 'Dance Floor', icon: '🎸', color: '#8B5CF6' },
        { id: 'b4', name: 'Celebration Banquet Dinner', date: customFields.date, time: '9:30 PM', venue: 'Terrace Dining', icon: '🍽️', color: '#D97706' },
      ]
    : category.isValentine
    ? [
        { id: 'v1', name: 'The Day We Met', date: 'Spring Morning', time: '11:00 AM', venue: 'Our Little Café', icon: '☕', color: '#F43F5E' },
        { id: 'v2', name: 'First Unforgettable Trip', date: 'Misty Mountains', time: 'Sunset', venue: 'Hilltop Viewpoint', icon: '🚗', color: '#E11D48' },
        { id: 'v3', name: 'Special Candlelight Dinner', date: customFields.date, time: customFields.time, venue: customFields.venue, icon: '🕯️', color: '#BE123C' },
        { id: 'v4', name: 'A Question From The Heart', date: customFields.date, time: 'Under The Stars', venue: 'Forever & Always', icon: '💍', color: '#9F1239' },
      ]
    : [
        { id: 'ev-1', name: 'Haldi Ceremony', date: '16 December 2026', time: '10:00 AM', venue: 'Sunlit Courtyard', icon: '✨', color: '#EAB308' },
        { id: 'ev-2', name: 'Mehendi Ki Raat', date: '16 December 2026', time: '4:00 PM', venue: 'Royal Poolside Terrace', icon: '🌿', color: '#10B981' },
        { id: 'ev-3', name: 'Sangeet & Musical Night', date: '17 December 2026', time: '7:00 PM', venue: 'Grand Crystal Ballroom', icon: '🪕', color: '#8B5CF6' },
        { id: 'ev-4', name: 'Sacred Pheras & Wedding', date: customFields.date, time: customFields.time, venue: 'Lake Mandap', icon: '🔥', color: '#DC2626' },
        { id: 'ev-5', name: 'Royal Reception Dinner', date: '19 December 2026', time: '7:30 PM', venue: 'Maharani Lawn', icon: '👑', color: '#D97706' },
      ];

  // Resolve authentic slide backgrounds
  const slide1Bg = category.isNavyWedding
    ? require('../../assets/template01/04_welcome_intro.png')
    : category.isBirthday
    ? require('../../assets/showcase/birthday.jpg')
    : category.isValentine
    ? require('../../assets/showcase/valentine.jpg')
    : category.isTempleWedding
    ? require('../../assets/showcase/thirumanam.jpg')
    : category.isLakePalace
    ? require('../../assets/showcase/arjun-sia.jpg')
    : category.isUdaipurPalace
    ? require('../../assets/showcase/udaipur-palace.jpg')
    : require('../../assets/template01/04_welcome_intro.png');

  const slide2Bg = category.isNavyWedding
    ? require('../../assets/template01/06_save_the_date.png')
    : category.isBirthday
    ? require('../../assets/showcase/birthday.jpg')
    : category.isValentine
    ? require('../../assets/showcase/valentine.jpg')
    : category.isTempleWedding
    ? require('../../assets/showcase/thirumanam.jpg')
    : category.isLakePalace
    ? require('../../assets/showcase/arjun-sia.jpg')
    : category.isUdaipurPalace
    ? require('../../assets/showcase/udaipur-palace.jpg')
    : require('../../assets/template01/06_save_the_date.png');

  const slide3Bg = category.isNavyWedding
    ? require('../../assets/template01/07_wedding_events_overview.png')
    : category.isBirthday
    ? require('../../assets/showcase/birthday.jpg')
    : category.isValentine
    ? require('../../assets/showcase/valentine.jpg')
    : category.isTempleWedding
    ? require('../../assets/showcase/thirumanam.jpg')
    : category.isLakePalace
    ? require('../../assets/showcase/arjun-sia.jpg')
    : category.isUdaipurPalace
    ? require('../../assets/showcase/udaipur-palace.jpg')
    : require('../../assets/template01/07_wedding_events_overview.png');

  const slide4Bg = category.isNavyWedding
    ? require('../../assets/template01/13_family_blessings.png')
    : category.isBirthday
    ? require('../../assets/showcase/birthday.jpg')
    : category.isValentine
    ? require('../../assets/showcase/valentine.jpg')
    : category.isTempleWedding
    ? require('../../assets/showcase/thirumanam.jpg')
    : category.isLakePalace
    ? require('../../assets/showcase/arjun-sia.jpg')
    : category.isUdaipurPalace
    ? require('../../assets/showcase/udaipur-palace.jpg')
    : require('../../assets/template01/13_family_blessings.png');

  const slide5Bg = category.isNavyWedding
    ? require('../../assets/template01/14_venue_location.png')
    : category.isBirthday
    ? require('../../assets/showcase/birthday.jpg')
    : category.isValentine
    ? require('../../assets/showcase/valentine.jpg')
    : category.isTempleWedding
    ? require('../../assets/showcase/thirumanam.jpg')
    : category.isLakePalace
    ? require('../../assets/showcase/arjun-sia.jpg')
    : category.isUdaipurPalace
    ? require('../../assets/showcase/udaipur-palace.jpg')
    : require('../../assets/template01/14_venue_location.png');

  const slide6Bg = category.isNavyWedding
    ? require('../../assets/template01/15_closing_thank_you.png')
    : category.isBirthday
    ? require('../../assets/showcase/birthday.jpg')
    : category.isValentine
    ? require('../../assets/showcase/valentine.jpg')
    : category.isTempleWedding
    ? require('../../assets/showcase/thirumanam.jpg')
    : category.isLakePalace
    ? require('../../assets/showcase/arjun-sia.jpg')
    : category.isUdaipurPalace
    ? require('../../assets/showcase/udaipur-palace.jpg')
    : require('../../assets/template01/15_closing_thank_you.png');

  return (
    <View style={styles.container}>
      {/* Floating Top Bar (Controls: Slide Counter, Sound, Edit) */}
      <View style={styles.floatingTopBar}>
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => goToSlide(idx)}
              style={[
                styles.dot,
                activeSlide === idx && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.topRightControls}>
          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={toggleSound}
            activeOpacity={0.8}
            accessibilityLabel="Toggle Music"
          >
            {isPlayingMusic ? (
              <Volume2 size={16} color="#D7B875" />
            ) : (
              <VolumeX size={16} color="#A0988A" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editPillBtn}
            onPress={() => setIsEditModalOpen(true)}
            activeOpacity={0.8}
          >
            <Edit3 size={13} color="#0F1219" />
            <Text style={styles.editPillText}>Edit Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Horizontal Slide ScrollView */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.slidesScroll}
        contentContainerStyle={{ width: slideWidth * totalSlides }}
      >
        {/* =========================================================================
            SLIDE 1: Welcome & Invocation
           ========================================================================= */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <Image
            source={slide1Bg}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            priority="high"
          />
          <View style={styles.darkVignette} />

          <View style={styles.slideContentCenter}>
            <View style={styles.shlokBadge}>
              <Text style={styles.shlokText}>
                {category.isBirthday ? '🎂 SPECIAL BIRTHDAY SURPRISE' :
                 category.isValentine ? '💌 A SPECIAL QUESTION FOR YOU' :
                 category.isTempleWedding ? '🪔 ஸ்ரீ கணேசாய நமஹ' :
                 '॥ श्री गणेशाय नमः ॥'}
              </Text>
            </View>

            <Text style={styles.eyebrowLight}>
              {category.isBirthday ? '— A CELEBRATION OF DREAMS & JOY —' :
               category.isValentine ? '— A DIGITAL LOVE LETTER FROM THE HEART —' :
               category.isTempleWedding ? '— AUSPICIOUS THIRUMANAM INVITATION —' :
               '— AUSPICIOUS WEDDING INVITATION —'}
            </Text>

            <Text style={styles.serifHeadingGold}>
              {category.isBirthday ? (
                <>Happy Birthday{'\n'}<Text style={styles.serifHeadingGoldItalic}>Dearest {customFields.names}</Text></>
              ) : category.isValentine ? (
                <>Will You Be{'\n'}<Text style={styles.serifHeadingGoldItalic}>My Valentine?</Text></>
              ) : (
                <>You are{'\n'}<Text style={styles.serifHeadingGoldItalic}>Cordially Invited</Text></>
              )}
            </Text>

            <Text style={styles.subInviteText}>
              {category.isBirthday
                ? 'to celebrate another beautiful year filled with smiles & memories'
                : category.isValentine
                ? 'a little question waiting to be answered under the stars'
                : 'to celebrate the sacred union and celebration of'}
            </Text>

            <View style={styles.goldFleuron}>
              <View style={styles.fleuronLine} />
              <Text style={styles.fleuronSymbol}>✦</Text>
              <View style={styles.fleuronLine} />
            </View>

            <Text style={styles.grandCoupleNames} numberOfLines={2}>
              {customFields.names}
            </Text>

            <Text style={styles.dateLocationCaps}>
              {customFields.date.toUpperCase()}{customFields.city ? ` • ${customFields.city.toUpperCase()}` : ''}
            </Text>

            <TouchableOpacity
              style={styles.floatingNavPill}
              onPress={() => goToSlide(1)}
              activeOpacity={0.8}
            >
              <Text style={styles.floatingNavPillText}>
                {category.isBirthday ? 'Party Schedule' : category.isValentine ? 'Our Love Story' : 'Explore Invitation'}
              </Text>
              <ChevronRight size={15} color="#D7B875" />
            </TouchableOpacity>
          </View>
        </View>

        {/* =========================================================================
            SLIDE 2: Save The Date / Event Announcement
           ========================================================================= */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <Image
            source={slide2Bg}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            priority="high"
          />
          <View style={styles.darkVignette} />

          <View style={styles.slideContentCenter}>
            <View style={styles.shlokBadge}>
              <Sparkles size={13} color="#D7B875" />
              <Text style={[styles.shlokText, { marginLeft: 6 }]}>
                {category.isBirthday ? 'PARTY DETAILS' : category.isValentine ? 'FOREVER & ALWAYS' : 'SAVE THE DATE'}
              </Text>
            </View>

            <Text style={styles.serifHeadingGold}>
              {category.isBirthday ? 'Join The Celebration' : category.isValentine ? 'Two Hearts, One Journey' : 'An Eternal Union'}
            </Text>

            <View style={styles.glassInfoBox}>
              <Calendar size={22} color="#D7B875" style={{ marginBottom: 6 }} />
              <Text style={styles.boxMainDate}>{customFields.date}</Text>
              <View style={styles.inlineRow}>
                <Clock size={14} color="#D7B875" style={{ marginRight: 6 }} />
                <Text style={styles.boxTimeText}>{customFields.time}</Text>
              </View>
            </View>

            <View style={styles.quoteBubble}>
              <Text style={styles.quoteBodyText}>
                "{customFields.message}"
              </Text>
            </View>

            <View style={styles.venueCapsule}>
              <MapPin size={15} color="#D7B875" style={{ marginRight: 6 }} />
              <Text style={styles.venueCapsuleText} numberOfLines={1}>
                {customFields.venue}{customFields.city ? `, ${customFields.city}` : ''}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.floatingNavPill}
              onPress={() => goToSlide(2)}
              activeOpacity={0.8}
            >
              <Text style={styles.floatingNavPillText}>
                {category.isBirthday ? 'Festivity Highlights' : category.isValentine ? 'Story Chapters' : 'Ceremony Schedule'}
              </Text>
              <ChevronRight size={15} color="#D7B875" />
            </TouchableOpacity>
          </View>
        </View>

        {/* =========================================================================
            SLIDE 3: Ceremony Itinerary / Festivity Schedule / Love Chapters
           ========================================================================= */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <Image
            source={slide3Bg}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            priority="high"
          />
          <View style={styles.darkVignette} />

          <View style={styles.slideContentTop}>
            <View style={styles.shlokBadge}>
              <Sparkles size={13} color="#D7B875" />
              <Text style={[styles.shlokText, { marginLeft: 6 }]}>
                {category.isBirthday ? 'PARTY FESTIVITIES' : category.isValentine ? 'PRECIOUS CHAPTERS' : 'SACRED ITINERARY'}
              </Text>
            </View>

            <Text style={styles.serifHeadingGoldSm}>
              {category.isBirthday ? 'Party Schedule' : category.isValentine ? 'Our Love Story' : 'Ceremony Itinerary'}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width: '100%', maxHeight: Math.min(WINDOW_HEIGHT * 0.48, 380) }}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {eventsList.map((ev, idx) => (
                <View key={ev.id || idx} style={styles.eventRowCard}>
                  <View style={styles.eventEmojiBox}>
                    <Text style={{ fontSize: 18 }}>{ev.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventRowTitle}>{ev.name}</Text>
                    <View style={styles.eventRowSub}>
                      <Calendar size={11} color="#D7B875" style={{ marginRight: 4 }} />
                      <Text style={styles.eventRowSubText}>{ev.date}</Text>
                      <Text style={{ color: '#D7B875', marginHorizontal: 4 }}>•</Text>
                      <Clock size={11} color="#D7B875" style={{ marginRight: 4 }} />
                      <Text style={styles.eventRowSubText}>{ev.time}</Text>
                    </View>
                    <View style={styles.eventRowSub}>
                      <MapPin size={11} color="#EDE2CF" style={{ marginRight: 4 }} />
                      <Text style={styles.eventRowVenue} numberOfLines={1}>{ev.venue}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.floatingNavPill}
              onPress={() => goToSlide(3)}
              activeOpacity={0.8}
            >
              <Text style={styles.floatingNavPillText}>
                {category.isBirthday ? 'Special Memories' : category.isValentine ? 'A Letter To You' : 'Family Blessings'}
              </Text>
              <ChevronRight size={15} color="#D7B875" />
            </TouchableOpacity>
          </View>
        </View>

        {/* =========================================================================
            SLIDE 4: Family Blessings / Memories / Love Letter
           ========================================================================= */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <Image
            source={slide4Bg}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            priority="high"
          />
          <View style={styles.darkVignette} />

          <View style={styles.slideContentCenter}>
            <View style={styles.shlokBadge}>
              <Heart size={13} color="#D7B875" fill="#D7B875" />
              <Text style={[styles.shlokText, { marginLeft: 6 }]}>
                {category.isBirthday ? 'A NOTE FROM THE HEART' :
                 category.isValentine ? 'WRITTEN WITH LOVE' :
                 'WITH SACRED BLESSINGS'}
              </Text>
            </View>

            <Text style={styles.serifHeadingGold}>
              {category.isBirthday ? 'Celebrating You' :
               category.isValentine ? 'A Letter For You' :
               'Our Cherished Families'}
            </Text>

            {category.isBirthday || category.isValentine ? (
              <View style={styles.letterCard}>
                <Text style={styles.letterMessageText}>
                  "{category.isBirthday ? customFields.letterMessage : customFields.message}"
                </Text>
                <View style={styles.letterHostRow}>
                  <Text style={styles.letterHostText}>— {customFields.host}</Text>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.familyIntroText}>
                  Together with their loved ones, the families seek your warmest blessings and grace.
                </Text>

                <View style={styles.familyCard}>
                  <Text style={styles.familyRole}>Bride's Family</Text>
                  <Text style={styles.familyNames}>{customFields.brideParents}</Text>
                  <Text style={styles.familyHeritage}>Singhania Heritage House</Text>
                </View>

                <View style={styles.familyCard}>
                  <Text style={styles.familyRole}>Groom's Family</Text>
                  <Text style={styles.familyNames}>{customFields.groomParents}</Text>
                  <Text style={styles.familyHeritage}>Kapoor Royal Lineage</Text>
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.floatingNavPill}
              onPress={() => goToSlide(4)}
              activeOpacity={0.8}
            >
              <Text style={styles.floatingNavPillText}>Venue & Map</Text>
              <ChevronRight size={15} color="#D7B875" />
            </TouchableOpacity>
          </View>
        </View>

        {/* =========================================================================
            SLIDE 5: Palace / Party Venue & Navigation
           ========================================================================= */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <Image
            source={slide5Bg}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            priority="high"
          />
          <View style={styles.darkVignette} />

          <View style={styles.slideContentCenter}>
            <View style={styles.shlokBadge}>
              <MapPin size={13} color="#D7B875" />
              <Text style={[styles.shlokText, { marginLeft: 6 }]}>CELEBRATION VENUE</Text>
            </View>

            <Text style={styles.serifHeadingGold}>
              {category.isBirthday ? 'Party Destination' : 'Royal Venue & Map'}
            </Text>

            <View style={styles.glassInfoBox}>
              <Text style={styles.venueMainTitle}>{customFields.venue}</Text>
              <Text style={styles.venueFullAddress}>
                {customFields.venue}, Heritage Enclave,{'\n'}{customFields.city}
              </Text>

              <TouchableOpacity
                style={styles.mapsButton}
                onPress={openGoogleMaps}
                activeOpacity={0.85}
              >
                <Navigation size={16} color="#0F1219" style={{ marginRight: 6 }} />
                <Text style={styles.mapsButtonText}>Open in Google Maps</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.floatingNavPill}
              onPress={() => goToSlide(5)}
              activeOpacity={0.8}
            >
              <Text style={styles.floatingNavPillText}>
                {category.isValentine ? 'Say Yes ♡' : 'RSVP Confirmation'}
              </Text>
              <ChevronRight size={15} color="#D7B875" />
            </TouchableOpacity>
          </View>
        </View>

        {/* =========================================================================
            SLIDE 6: RSVP & WhatsApp Confirmation
           ========================================================================= */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <Image
            source={slide6Bg}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            priority="high"
          />
          <View style={styles.darkVignette} />

          <View style={styles.slideContentCenter}>
            <View style={styles.shlokBadge}>
              <Sparkles size={13} color="#D7B875" />
              <Text style={[styles.shlokText, { marginLeft: 6 }]}>
                {category.isBirthday ? 'JOIN THE PARTY' : category.isValentine ? 'THE QUESTION' : 'HONOUR OF YOUR PRESENCE'}
              </Text>
            </View>

            <Text style={styles.serifHeadingGold}>
              {category.isBirthday ? (
                <>Celebrate Together{'\n'}<Text style={styles.serifHeadingGoldItalic}>with love & laughter</Text></>
              ) : category.isValentine ? (
                <>Say Yes ♡{'\n'}<Text style={styles.serifHeadingGoldItalic}>forever & always</Text></>
              ) : (
                <>Thank You{'\n'}<Text style={styles.serifHeadingGoldItalic}>for your warm blessings</Text></>
              )}
            </Text>

            <View style={styles.lotusIconBox}>
              <Text style={{ fontSize: 32 }}>
                {category.isBirthday ? '🎂' : category.isValentine ? '💖' : '🪷'}
              </Text>
            </View>

            <Text style={styles.closingNames}>{customFields.names}</Text>

            <View style={styles.rsvpCardBox}>
              <Text style={styles.rsvpHeading}>
                {category.isBirthday ? 'CONFIRM YOUR PRESENCE' : category.isValentine ? 'WILL YOU SAY YES?' : 'CONFIRM ATTENDANCE'}
              </Text>
              <Text style={styles.rsvpSub}>
                {category.isBirthday
                  ? 'Kindly RSVP to help us prepare wonderful party hospitality and celebration.'
                  : category.isValentine
                  ? 'Send a sweet message on WhatsApp to make this moment unforgettable.'
                  : 'Kindly RSVP by 10th December 2026 to help us prepare royal hospitality.'}
              </Text>

              <TouchableOpacity
                style={styles.whatsAppRSVPBtn}
                onPress={openWhatsAppRSVP}
                activeOpacity={0.85}
              >
                <Send size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.whatsAppRSVPText}>
                  {category.isBirthday ? 'Send Birthday Wishes on WhatsApp' : category.isValentine ? 'Say Yes on WhatsApp ♡' : 'Send RSVP on WhatsApp'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.floatingNavPill}
              onPress={() => goToSlide(0)}
              activeOpacity={0.8}
            >
              <ChevronLeft size={15} color="#D7B875" />
              <Text style={styles.floatingNavPillText}>Back to Beginning</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Left & Right Navigation Arrows */}
      {activeSlide > 0 && (
        <TouchableOpacity
          style={styles.floatingArrowLeft}
          onPress={() => goToSlide(activeSlide - 1)}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#D7B875" />
        </TouchableOpacity>
      )}

      {activeSlide < totalSlides - 1 && (
        <TouchableOpacity
          style={styles.floatingArrowRight}
          onPress={() => goToSlide(activeSlide + 1)}
          activeOpacity={0.7}
        >
          <ChevronRight size={22} color="#D7B875" />
        </TouchableOpacity>
      )}

      {/* Modal Sheet for Instant Live Customization */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Personalize Details</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#0F1219" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: WINDOW_HEIGHT * 0.7 }}>
              <Text style={styles.inputLabel}>
                {category.isBirthday ? 'Birthday Celebrant' : category.isValentine ? 'Special Names' : 'Couple Names'}
              </Text>
              <TextInput
                style={styles.inputBox}
                value={customFields.names}
                onChangeText={(val) => setCustomFields((p) => ({ ...p, names: val }))}
                placeholder="Names"
                placeholderTextColor="#A0988A"
              />

              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.inputBox}
                value={customFields.date}
                onChangeText={(val) => setCustomFields((p) => ({ ...p, date: val }))}
                placeholder="Celebration Date"
                placeholderTextColor="#A0988A"
              />

              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.inputBox}
                value={customFields.time}
                onChangeText={(val) => setCustomFields((p) => ({ ...p, time: val }))}
                placeholder="Time"
                placeholderTextColor="#A0988A"
              />

              <Text style={styles.inputLabel}>Venue Name</Text>
              <TextInput
                style={styles.inputBox}
                value={customFields.venue}
                onChangeText={(val) => setCustomFields((p) => ({ ...p, venue: val }))}
                placeholder="Venue"
                placeholderTextColor="#A0988A"
              />

              <Text style={styles.inputLabel}>City & State</Text>
              <TextInput
                style={styles.inputBox}
                value={customFields.city}
                onChangeText={(val) => setCustomFields((p) => ({ ...p, city: val }))}
                placeholder="City"
                placeholderTextColor="#A0988A"
              />

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={() => {
                  setIsEditModalOpen(false);
                  Alert.alert('Updated', 'Your celebration details have been updated!');
                }}
              >
                <Text style={styles.modalSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#091321',
    position: 'relative',
  },
  floatingTopBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 12,
    left: 14,
    right: 14,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(9, 19, 33, 0.75)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.3)',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    width: 18,
    backgroundColor: '#D7B875',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 18, 25, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D7B875',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
  },
  editPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F1219',
  },
  slidesScroll: {
    flex: 1,
  },
  slideCard: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 19, 33, 0.45)',
  },
  slideContentCenter: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingTop: 65,
    paddingBottom: 35,
    width: '100%',
  },
  slideContentTop: {
    zIndex: 10,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 70,
    width: '100%',
  },
  shlokBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 18, 25, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.4)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  shlokText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: '#D7B875',
  },
  eyebrowLight: {
    fontSize: 9.5,
    letterSpacing: 2.2,
    color: '#EDE2CF',
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  serifHeadingGold: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFDF7',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  serifHeadingGoldSm: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFDF7',
    textAlign: 'center',
    marginBottom: 12,
  },
  serifHeadingGoldItalic: {
    fontStyle: 'italic',
    color: '#D7B875',
  },
  subInviteText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 12,
    fontStyle: 'italic',
    color: '#D7B875',
    textAlign: 'center',
    marginBottom: 8,
  },
  goldFleuron: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  fleuronLine: {
    width: 28,
    height: 1,
    backgroundColor: '#D7B875',
  },
  fleuronSymbol: {
    color: '#D7B875',
    fontSize: 11,
  },
  grandCoupleNames: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFDF7',
    textAlign: 'center',
    marginVertical: 6,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  dateLocationCaps: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#EDE2CF',
    marginTop: 4,
    textAlign: 'center',
  },
  floatingNavPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 18, 25, 0.85)',
    borderWidth: 1,
    borderColor: '#D7B875',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
    marginTop: 20,
  },
  floatingNavPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#D7B875',
    letterSpacing: 0.5,
  },
  glassInfoBox: {
    backgroundColor: 'rgba(15, 18, 25, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.4)',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  boxMainDate: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFDF7',
    marginBottom: 4,
    textAlign: 'center',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxTimeText: {
    fontSize: 12.5,
    color: '#EDE2CF',
    fontWeight: '600',
  },
  quoteBubble: {
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  quoteBodyText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#EDE2CF',
    textAlign: 'center',
    lineHeight: 18,
  },
  letterCard: {
    backgroundColor: 'rgba(15, 18, 25, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.35)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginVertical: 12,
  },
  letterMessageText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 13,
    fontStyle: 'italic',
    color: '#FFFDF7',
    textAlign: 'center',
    lineHeight: 20,
  },
  letterHostRow: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  letterHostText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D7B875',
  },
  venueCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 19, 33, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.3)',
    marginTop: 6,
  },
  venueCapsuleText: {
    fontSize: 11.5,
    color: '#D7B875',
    fontWeight: '600',
  },
  eventRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 18, 25, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.25)',
    borderRadius: 14,
    padding: 11,
    marginBottom: 8,
    gap: 10,
  },
  eventEmojiBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(215, 184, 117, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventRowTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFDF7',
    marginBottom: 2,
  },
  eventRowSub: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  eventRowSubText: {
    fontSize: 10.5,
    color: '#D7B875',
  },
  eventRowVenue: {
    fontSize: 10.5,
    color: '#EDE2CF',
  },
  familyIntroText: {
    fontSize: 11.5,
    color: '#EDE2CF',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 16,
  },
  familyCard: {
    backgroundColor: 'rgba(15, 18, 25, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.3)',
    borderRadius: 15,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  familyRole: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#D7B875',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  familyNames: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFDF7',
    textAlign: 'center',
    marginBottom: 2,
  },
  familyHeritage: {
    fontSize: 10.5,
    color: '#A0988A',
    fontStyle: 'italic',
  },
  venueMainTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFDF7',
    marginBottom: 4,
    textAlign: 'center',
  },
  venueFullAddress: {
    fontSize: 11.5,
    color: '#EDE2CF',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D7B875',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 24,
  },
  mapsButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F1219',
  },
  lotusIconBox: {
    marginVertical: 8,
  },
  closingNames: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFDF7',
    marginBottom: 12,
    textAlign: 'center',
  },
  rsvpCardBox: {
    backgroundColor: 'rgba(15, 18, 25, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.35)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  rsvpHeading: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#D7B875',
    marginBottom: 5,
  },
  rsvpSub: {
    fontSize: 11.5,
    color: '#EDE2CF',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 10,
  },
  whatsAppRSVPBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  whatsAppRSVPText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  floatingArrowLeft: {
    position: 'absolute',
    left: 10,
    top: '50%',
    marginTop: -20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(9, 19, 33, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  floatingArrowRight: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(9, 19, 33, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(215, 184, 117, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1219',
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 4,
    marginTop: 8,
  },
  inputBox: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F1219',
  },
  modalSaveBtn: {
    backgroundColor: '#0F1219',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  modalSaveText: {
    color: '#D7B875',
    fontSize: 15,
    fontWeight: '700',
  },
});
