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
  Animated,
  Easing,
} from 'react-native';
import { Image } from 'expo-image';
import {
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Sparkles,
  Phone,
  Send,
  Navigation,
  Edit3,
  X,
  Volume2,
  VolumeX,
  Check,
} from 'lucide-react-native';
import { TemplateThemes } from '../../../constants/templateThemes';
import { MusicService } from '../../../services/music.service';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

/**
 * UdaipurPaperPalaceEngine
 * Dedicated Native React Native Renderer for Template 04:
 * Tara & Kabir — The Grand Udaipur Palace Wedding
 * 
 * Recreates 1:1 the website's handcrafted blush-peach paper aesthetic:
 * - 3D rotating double doors with brass rings & perspective
 * - Triple concentric paper arches (#f4cba9, #eaa9b8, #fff6e3)
 * - Great Vibes cursive calligraphy and Baloo 2 Indian royal sans
 * - 6 authentic presentation slides (Zero Template 01 Navy fallbacks)
 */
export function UdaipurPaperPalaceEngine({
  template,
  draftData,
  onCustomize,
  isEditable = false,
  initialGateOpen = false,
  initialSlide = 0,
}) {
  const theme = TemplateThemes['tpl-wedding-paper-palace-04'];
  const colors = theme.colors;
  const fonts = theme.fonts;

  const [activeSlide, setActiveSlide] = useState(initialSlide || 0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGateOpen, setIsGateOpen] = useState(isEditable || initialGateOpen);

  // 3D Door Animation States
  const doorAnim = useRef(new Animated.Value(0)).current;
  const gateFadeAnim = useRef(new Animated.Value(1)).current;

  const initialFields = draftData?.fields || template?.defaultFields || {};
  const defaultNames =
    template?.title?.includes('—')
      ? template.title.split('—')[0].trim()
      : 'Tara & Kabir';

  const [customFields, setCustomFields] = useState({
    names: initialFields.names || defaultNames,
    eyebrow: initialFields.eyebrow || 'AUSPICIOUS WEDDING INVITATION',
    headline: initialFields.headline || 'The Wedding Of',
    subInvite: initialFields.subInvite || 'You are Cordially Invited',
    date: initialFields.date || 'Saturday, 13 March 2027',
    time: initialFields.time || '5:00 PM Onwards',
    venue: initialFields.venue || 'The Oberoi Udaivilas, Udaipur',
    city: initialFields.city || 'Udaipur, Rajasthan',
    brideParents: initialFields.brideParents || 'Mrs. Sunita & Mr. Rajendra Sharma',
    groomParents: initialFields.groomParents || 'Mrs. Anita & Mr. Vikramaditya Singhania',
    message: initialFields.message || 'Request the honour of your graceful presence and pious blessings to celebrate this eternal union.',
    rsvpPhone: initialFields.rsvpPhone || initialFields.rsvp || '+91 98765 43210',
    host: initialFields.host || 'Sharma & Singhania Families',
    songTitle: initialFields.songTitle || 'Mangal Rang (Ramayana)',
    audioSource: initialFields.audioSource || '/audio/mangal-rang.mp3',
  });

  const scrollRef = useRef(null);

  // Background soundtrack resolution
  useEffect(() => {
    let mounted = true;
    const playAudio = async () => {
      try {
        const audioSrc = customFields.audioSource || '/audio/mangal-rang.mp3';
        await MusicService.loadTrack({
          id: 'udaipur-mangal-rang',
          title: customFields.songTitle,
          artist: 'You Are Mine Atelier',
          url: audioSrc,
        });
        if (mounted) {
          setIsPlayingMusic(true);
        }
      } catch (e) {
        // Audio auto-play gracefully deferred
      }
    };

    playAudio();

    return () => {
      mounted = false;
      MusicService.stop().catch(() => {});
    };
  }, []);

  const toggleSound = async () => {
    try {
      if (isPlayingMusic) {
        await MusicService.pause();
        setIsPlayingMusic(false);
      } else {
        await MusicService.play();
        setIsPlayingMusic(true);
      }
    } catch (e) {
      setIsPlayingMusic(!isPlayingMusic);
    }
  };

  const handleOpenDoors = () => {
    Animated.parallel([
      Animated.timing(doorAnim, {
        toValue: 1,
        duration: 1600,
        easing: Easing.bezier(0.6, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(gateFadeAnim, {
        toValue: 0,
        delay: 1200,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsGateOpen(true);
    });
  };

  const totalSlides = 6;
  const slideWidth = Math.min(WINDOW_WIDTH, 440);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / slideWidth);
    if (page !== activeSlide && page >= 0 && page < totalSlides) {
      setActiveSlide(page);
    }
  };

  const goToSlide = (idx) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: idx * slideWidth, animated: true });
      setActiveSlide(idx);
    }
  };

  const openWhatsAppRSVP = () => {
    const msgText = `Warmest Blessings to ${customFields.names}! Wishing you both a lifetime of love and joy on your wedding.`;
    const encoded = encodeURIComponent(msgText);
    Linking.openURL(`https://wa.me/?text=${encoded}`).catch(() => {
      Alert.alert('Blessings Sent', 'Thank you for your gracious blessings!');
    });
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${customFields.venue}, ${customFields.city}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => {});
  };

  // 3D Door Rotations
  const leftDoorRotate = doorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-115deg'],
  });

  const rightDoorRotate = doorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '115deg'],
  });

  // Authentic 5 Ceremonies for Udaipur Palace
  const rawEvents = initialFields.events;
  const eventsList = Array.isArray(rawEvents) && rawEvents.length > 0
    ? rawEvents.map((ev, idx) => ({
        id: `ev-${idx}`,
        name: ev.name || ev.title || 'Ceremony',
        date: ev.date || customFields.date,
        time: ev.time || '10:00 AM',
        venue: ev.venue || customFields.venue,
        icon: ev.icon === 'haldi' ? '✨' : ev.icon === 'mehendi' ? '🌿' : ev.icon === 'sangeet' ? '🪕' : ev.icon === 'wedding' ? '🔥' : '👑',
      }))
    : [
        { id: 'ev-1', name: 'Haldi Ceremony', date: 'Thursday, 11 March 2027', time: '10:00 AM', venue: 'Sunlit Palace Courtyard', icon: '✨' },
        { id: 'ev-2', name: 'Mehendi Ki Raat', date: 'Thursday, 11 March 2027', time: '4:00 PM', venue: 'Lakeside Promenade', icon: '🌿' },
        { id: 'ev-3', name: 'Sangeet & Musical Night', date: 'Friday, 12 March 2027', time: '7:00 PM', venue: 'Grand Chandni Lawns', icon: '🪕' },
        { id: 'ev-4', name: 'Sacred Pheras & Wedding', date: customFields.date, time: customFields.time, venue: 'Lake Mandap', icon: '🔥' },
        { id: 'ev-5', name: 'Royal Reception Dinner', date: 'Sunday, 14 March 2027', time: '8:00 PM', venue: 'Palace Ballroom', icon: '👑' },
      ];

  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.desk }]}>
      {/* =========================================================================
          TOP FLOATING BAR (Controls: Indicator, Music Mute, Edit)
         ========================================================================= */}
      <View style={styles.floatingTopBar}>
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => goToSlide(idx)}
              style={[
                styles.dot,
                activeSlide === idx && [styles.activeDot, { backgroundColor: colors.plum }],
              ]}
            />
          ))}
        </View>

        <View style={styles.topRightControls}>
          <TouchableOpacity
            style={[styles.iconCircleBtn, { borderColor: colors.line }]}
            onPress={toggleSound}
            activeOpacity={0.8}
            accessibilityLabel="Toggle Music"
          >
            {isPlayingMusic ? (
              <Volume2 size={16} color={colors.plum} />
            ) : (
              <VolumeX size={16} color="#A0988A" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.editPillBtn, { backgroundColor: colors.paper, borderColor: colors.goldBorder }]}
            onPress={() => {
              if (onCustomize) {
                onCustomize(customFields);
              } else {
                setIsEditModalOpen(true);
              }
            }}
            activeOpacity={0.8}
          >
            <Edit3 size={13} color={colors.plum} />
            <Text style={[styles.editPillText, { color: colors.plum, fontFamily: fonts.heading }]}>
              Edit Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* =========================================================================
          MAIN HORIZONTAL SLIDE SCROLLVIEW (6 AUTHENTIC SLIDES)
         ========================================================================= */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.slidesScroll}
        contentContainerStyle={{ width: slideWidth * totalSlides }}
      >
        {/* =====================================================================
            SLIDE 1: Welcome & Concentric Paper Arches
           ===================================================================== */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <View style={[styles.paperDeskCanvas, { backgroundColor: colors.bg }]}>
            {/* Outer Arch Layer 1 (.a1) */}
            <View style={[styles.archOuterLayer, { backgroundColor: colors.peach }]}>
              {/* Middle Arch Layer 2 (.a2) */}
              <View style={[styles.archMiddleLayer, { backgroundColor: colors.pink }]}>
                {/* Inner Arch Layer 3 (.a3) */}
                <View style={[styles.archInnerLayer, { backgroundColor: colors.paper, borderColor: colors.goldBorder }]}>
                  {/* Auspicious Badge */}
                  <View style={[styles.ribbonBadge, { backgroundColor: colors.pink }]}>
                    <Text style={[styles.ribbonText, { color: colors.plum, fontFamily: fonts.heading }]}>
                      ✦ BESPOKE ROYAL EDITION ✦
                    </Text>
                  </View>

                  <Text style={[styles.eyebrowCaps, { color: colors.plum, fontFamily: fonts.heading }]}>
                    {customFields.eyebrow}
                  </Text>

                  <Text style={[styles.cursiveHeadline, { color: colors.plum, fontFamily: fonts.script }]}>
                    You are Cordially Invited
                  </Text>

                  <Text style={[styles.subInviteBody, { color: colors.ink, fontFamily: fonts.serifBody }]}>
                    to celebrate the sacred wedding & union of
                  </Text>

                  <View style={styles.fleuronDivider}>
                    <View style={[styles.fleuronLine, { backgroundColor: colors.goldBorder }]} />
                    <Text style={[styles.fleuronSymbol, { color: colors.gold }]}>✦ ❖ ✦</Text>
                    <View style={[styles.fleuronLine, { backgroundColor: colors.goldBorder }]} />
                  </View>

                  {/* Grand Couple Names in Great Vibes Cursive Calligraphy */}
                  <Text style={[styles.grandCalligraphyNames, { color: colors.plum, fontFamily: fonts.script }]} numberOfLines={2}>
                    {customFields.names}
                  </Text>

                  <Text style={[styles.dateVenueLine, { color: colors.ink, fontFamily: fonts.heading }]}>
                    {customFields.date.toUpperCase()}{customFields.city ? ` • ${customFields.city.toUpperCase()}` : ''}
                  </Text>

                  <TouchableOpacity
                    style={[styles.actionPillButton, { backgroundColor: colors.plum }]}
                    onPress={() => goToSlide(1)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.actionPillText, { fontFamily: fonts.heading }]}>
                      Explore Invitation
                    </Text>
                    <ChevronRight size={15} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* =====================================================================
            SLIDE 2: Save The Date / Royal Announcement
           ===================================================================== */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <View style={[styles.paperDeskCanvas, { backgroundColor: colors.bg }]}>
            <View style={[styles.contentCard, { backgroundColor: colors.paper, borderColor: colors.line }]}>
              <View style={[styles.ribbonBadge, { backgroundColor: colors.peach }]}>
                <Sparkles size={12} color={colors.plum} />
                <Text style={[styles.ribbonText, { color: colors.plum, fontFamily: fonts.heading, marginLeft: 4 }]}>
                  SAVE THE DATE
                </Text>
              </View>

              <Text style={[styles.cursiveSectionTitle, { color: colors.plum, fontFamily: fonts.script }]}>
                An Eternal Union
              </Text>

              {/* Date Box */}
              <View style={[styles.calendarBox, { backgroundColor: colors.bg, borderColor: colors.goldBorder }]}>
                <Calendar size={24} color={colors.plum} style={{ marginBottom: 6 }} />
                <Text style={[styles.calendarMainDate, { color: colors.ink, fontFamily: fonts.serifHeading }]}>
                  {customFields.date}
                </Text>
                <View style={styles.inlineRow}>
                  <Clock size={14} color={colors.plum} style={{ marginRight: 6 }} />
                  <Text style={[styles.calendarTime, { color: colors.ink, fontFamily: fonts.heading }]}>
                    {customFields.time}
                  </Text>
                </View>
              </View>

              <View style={[styles.quoteBox, { borderColor: colors.peach }]}>
                <Text style={[styles.quoteText, { color: colors.ink, fontFamily: fonts.serifItalic }]}>
                  "{customFields.message}"
                </Text>
              </View>

              <View style={[styles.venuePill, { backgroundColor: colors.mint, borderColor: colors.line }]}>
                <MapPin size={15} color={colors.plum} style={{ marginRight: 6 }} />
                <Text style={[styles.venuePillText, { color: colors.ink, fontFamily: fonts.heading }]} numberOfLines={1}>
                  {customFields.venue}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.actionPillButton, { backgroundColor: colors.plum }]}
                onPress={() => goToSlide(2)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionPillText, { fontFamily: fonts.heading }]}>
                  Ceremony Schedule
                </Text>
                <ChevronRight size={15} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* =====================================================================
            SLIDE 3: 5 Ceremonial Events Itinerary
           ===================================================================== */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <View style={[styles.paperDeskCanvas, { backgroundColor: colors.bg }]}>
            <View style={[styles.contentCard, { backgroundColor: colors.paper, borderColor: colors.line, paddingVertical: 18 }]}>
              <Text style={[styles.eyebrowCaps, { color: colors.plum, fontFamily: fonts.heading }]}>
                SACRED CELEBRATIONS
              </Text>

              <Text style={[styles.cursiveSectionTitle, { color: colors.plum, fontFamily: fonts.script, fontSize: 34, marginVertical: 2 }]}>
                Wedding Festivities
              </Text>

              <ScrollView style={styles.itineraryScroll} showsVerticalScrollIndicator={false}>
                {eventsList.map((ev, idx) => (
                  <View key={ev.id || idx} style={[styles.eventRowCard, { backgroundColor: colors.bg, borderColor: colors.line }]}>
                    <View style={[styles.eventIconBadge, { backgroundColor: colors.peach }]}>
                      <Text style={styles.eventIconEmoji}>{ev.icon}</Text>
                    </View>
                    <View style={styles.eventDetailsCol}>
                      <Text style={[styles.eventName, { color: colors.plum, fontFamily: fonts.heading }]}>
                        {ev.name}
                      </Text>
                      <Text style={[styles.eventDate, { color: colors.ink, fontFamily: fonts.serifBody }]}>
                        {ev.date} • {ev.time}
                      </Text>
                      <Text style={[styles.eventVenue, { color: '#7a5a5a', fontFamily: fonts.serifItalic }]}>
                        {ev.venue}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[styles.actionPillButton, { backgroundColor: colors.plum, marginTop: 8 }]}
                onPress={() => goToSlide(3)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionPillText, { fontFamily: fonts.heading }]}>
                  Family Blessings
                </Text>
                <ChevronRight size={15} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* =====================================================================
            SLIDE 4: Family Blessings & Hosts
           ===================================================================== */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <View style={[styles.paperDeskCanvas, { backgroundColor: colors.bg }]}>
            <View style={[styles.contentCard, { backgroundColor: colors.paper, borderColor: colors.line }]}>
              <View style={[styles.ribbonBadge, { backgroundColor: colors.pink }]}>
                <Heart size={12} color={colors.plum} />
                <Text style={[styles.ribbonText, { color: colors.plum, fontFamily: fonts.heading, marginLeft: 4 }]}>
                  WITH ELDERS' BLESSINGS
                </Text>
              </View>

              <Text style={[styles.cursiveSectionTitle, { color: colors.plum, fontFamily: fonts.script }]}>
                Family & Heritage
              </Text>

              <View style={[styles.familyParentBox, { backgroundColor: colors.bg, borderColor: colors.goldBorder }]}>
                <Text style={[styles.parentHeaderRole, { color: colors.plum, fontFamily: fonts.heading }]}>
                  BRIDE'S PARENTS
                </Text>
                <Text style={[styles.parentNames, { color: colors.ink, fontFamily: fonts.serifHeading }]}>
                  {customFields.brideParents}
                </Text>
              </View>

              <View style={[styles.familyParentBox, { backgroundColor: colors.bg, borderColor: colors.goldBorder }]}>
                <Text style={[styles.parentHeaderRole, { color: colors.plum, fontFamily: fonts.heading }]}>
                  GROOM'S PARENTS
                </Text>
                <Text style={[styles.parentNames, { color: colors.ink, fontFamily: fonts.serifHeading }]}>
                  {customFields.groomParents}
                </Text>
              </View>

              <View style={[styles.hostBanner, { backgroundColor: colors.mint }]}>
                <Text style={[styles.hostLabel, { color: colors.plum, fontFamily: fonts.heading }]}>
                  CORDIALLY HOSTED BY
                </Text>
                <Text style={[styles.hostNames, { color: colors.ink, fontFamily: fonts.serifHeading }]}>
                  {customFields.host}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.actionPillButton, { backgroundColor: colors.plum }]}
                onPress={() => goToSlide(4)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionPillText, { fontFamily: fonts.heading }]}>
                  Palace Venue
                </Text>
                <ChevronRight size={15} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* =====================================================================
            SLIDE 5: Venue Location & Maps
           ===================================================================== */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <View style={[styles.paperDeskCanvas, { backgroundColor: colors.bg }]}>
            <View style={[styles.contentCard, { backgroundColor: colors.paper, borderColor: colors.line }]}>
              <View style={[styles.ribbonBadge, { backgroundColor: colors.peach }]}>
                <Navigation size={12} color={colors.plum} />
                <Text style={[styles.ribbonText, { color: colors.plum, fontFamily: fonts.heading, marginLeft: 4 }]}>
                  DESTINATION PALACE
                </Text>
              </View>

              <Text style={[styles.cursiveSectionTitle, { color: colors.plum, fontFamily: fonts.script }]}>
                The Venue
              </Text>

              <View style={[styles.venueDetailsBox, { backgroundColor: colors.bg, borderColor: colors.goldBorder }]}>
                <MapPin size={32} color={colors.plum} style={{ marginBottom: 10 }} />
                <Text style={[styles.venueNameHeading, { color: colors.ink, fontFamily: fonts.serifHeading }]}>
                  {customFields.venue}
                </Text>
                <Text style={[styles.venueCitySubtitle, { color: colors.plum, fontFamily: fonts.heading }]}>
                  {customFields.city}
                </Text>
                <Text style={[styles.venueNoteText, { color: '#7a5a5a', fontFamily: fonts.serifBody }]}>
                  Lake Pichola, Haridas Ji Ki Magri, Udaipur
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.actionPillButton, { backgroundColor: colors.plum }]}
                onPress={openGoogleMaps}
                activeOpacity={0.8}
              >
                <Navigation size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={[styles.actionPillText, { fontFamily: fonts.heading }]}>
                  Get Directions (Maps)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionPillButton, { backgroundColor: colors.paper, borderColor: colors.plum, borderWidth: 1.5, marginTop: 10 }]}
                onPress={() => goToSlide(5)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionPillText, { color: colors.plum, fontFamily: fonts.heading }]}>
                  RSVP & Wishes
                </Text>
                <ChevronRight size={15} color={colors.plum} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* =====================================================================
            SLIDE 6: Closing Blessings & Warm Wishes (No RSVP Management)
           ===================================================================== */}
        <View style={[styles.slideCard, { width: slideWidth }]}>
          <View style={[styles.paperDeskCanvas, { backgroundColor: colors.bg }]}>
            <View style={[styles.contentCard, { backgroundColor: colors.paper, borderColor: colors.line }]}>
              <View style={[styles.ribbonBadge, { backgroundColor: colors.pink }]}>
                <Sparkles size={12} color={colors.plum} />
                <Text style={[styles.ribbonText, { color: colors.plum, fontFamily: fonts.heading, marginLeft: 4 }]}>
                  GRACIOUS BLESSINGS
                </Text>
              </View>

              <Text style={[styles.cursiveSectionTitle, { color: colors.plum, fontFamily: fonts.script }]}>
                Warm Blessings
              </Text>

              <Text style={[styles.closingThankYouText, { color: colors.ink, fontFamily: fonts.serifBody }]}>
                Your gracious presence and heartfelt prayers will make our celebrations complete as we begin our sacred journey together.
              </Text>

              {/* Direct WhatsApp Wishes (Matches Website template-04.html) */}
              <TouchableOpacity
                style={[styles.rsvpWhatsappBtn, { backgroundColor: '#25D366' }]}
                onPress={openWhatsAppRSVP}
                activeOpacity={0.85}
              >
                <Send size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={[styles.rsvpBtnText, { fontFamily: fonts.heading }]}>
                  Send Blessings on WhatsApp
                </Text>
              </TouchableOpacity>

              {/* Soundtrack Capsule */}
              <View style={[styles.soundtrackCapsule, { backgroundColor: colors.bg, borderColor: colors.line }]}>
                <Volume2 size={16} color={colors.plum} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.soundtrackLabel, { color: colors.plum, fontFamily: fonts.heading }]}>
                    CEREMONIAL SOUNDTRACK
                  </Text>
                  <Text style={[styles.soundtrackTitle, { color: colors.ink, fontFamily: fonts.serifHeading }]} numberOfLines={1}>
                    {customFields.songTitle}
                  </Text>
                </View>
              </View>

              <Text style={[styles.signatureBlessing, { color: colors.plum, fontFamily: fonts.script }]}>
                {customFields.names}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* =========================================================================
          NATIVE 3D PERSPECTIVE DOUBLE DOORS (GATE OVERLAY)
         ========================================================================= */}
      {!isGateOpen && (
        <Animated.View style={[styles.gateOverlay, { opacity: gateFadeAnim }]}>
          <View style={[styles.gateDeskBackdrop, { backgroundColor: colors.desk }]}>
            {/* Header Royal Plate */}
            <View style={[styles.gateHeaderPlate, { backgroundColor: colors.paper, borderColor: colors.goldBorder }]}>
              <Text style={[styles.gatePlateTitle, { color: colors.plum, fontFamily: fonts.script }]}>
                Tara & Kabir
              </Text>
            </View>

            <View style={[styles.ribbonBadge, { backgroundColor: colors.pink, marginVertical: 8 }]}>
              <Text style={[styles.ribbonText, { color: colors.plum, fontFamily: fonts.heading }]}>
                THE GRAND UDAIPUR PALACE
              </Text>
            </View>

            {/* 3D Door Perspective Stage */}
            <View style={[styles.door3DStage, { backgroundColor: colors.bg, borderColor: colors.goldBorder }]}>
              {/* Inner Arch Preview behind doors */}
              <View style={[styles.doorInnerArch, { backgroundColor: colors.paper }]}>
                <Text style={[styles.previewInnerKicker, { color: colors.plum, fontFamily: fonts.heading }]}>
                  AUSPICIOUS WEDDING INVITATION
                </Text>
                <Text style={[styles.previewInnerScript, { color: colors.plum, fontFamily: fonts.script }]}>
                  You are Invited
                </Text>
                <Text style={[styles.previewInnerDate, { color: colors.ink, fontFamily: fonts.heading }]}>
                  {customFields.date.toUpperCase()}
                </Text>
              </View>

              {/* Left Door swinging out -115 deg */}
              <Animated.View
                style={[
                  styles.doorLeaf,
                  styles.leftDoorLeaf,
                  {
                    backgroundColor: colors.doorGreen,
                    borderColor: colors.doorDark,
                    transform: [
                      { perspective: 1000 },
                      { rotateY: leftDoorRotate },
                    ],
                  },
                ]}
              >
                <View style={[styles.doorKnockerRing, { borderColor: colors.goldBorder, right: 12 }]} />
              </Animated.View>

              {/* Right Door swinging out 115 deg */}
              <Animated.View
                style={[
                  styles.doorLeaf,
                  styles.rightDoorLeaf,
                  {
                    backgroundColor: colors.doorGreen,
                    borderColor: colors.doorDark,
                    transform: [
                      { perspective: 1000 },
                      { rotateY: rightDoorRotate },
                    ],
                  },
                ]}
              >
                <View style={[styles.doorKnockerRing, { borderColor: colors.goldBorder, left: 12 }]} />
              </Animated.View>
            </View>

            {/* Open Door Trigger Button */}
            <TouchableOpacity
              style={[styles.openDoorButton, { backgroundColor: colors.paper, borderColor: colors.goldBorder }]}
              onPress={handleOpenDoors}
              activeOpacity={0.85}
            >
              <Sparkles size={18} color={colors.plum} />
              <Text style={[styles.openDoorBtnText, { color: colors.plum, fontFamily: fonts.heading }]}>
                OPEN INVITATION
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* =========================================================================
          EDIT DETAILS MODAL
         ========================================================================= */}
      <Modal visible={isEditModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContentCard, { backgroundColor: colors.paper, borderColor: colors.line }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalHeaderTitle, { color: colors.plum, fontFamily: fonts.heading }]}>
                Edit Invitation Details
              </Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <X size={20} color={colors.ink} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalInputScroll}>
              <Text style={[styles.inputLabel, { color: colors.plum, fontFamily: fonts.heading }]}>
                Couple Names
              </Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={customFields.names}
                onChangeText={(val) => setCustomFields((prev) => ({ ...prev, names: val }))}
              />

              <Text style={[styles.inputLabel, { color: colors.plum, fontFamily: fonts.heading }]}>
                Wedding Date
              </Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={customFields.date}
                onChangeText={(val) => setCustomFields((prev) => ({ ...prev, date: val }))}
              />

              <Text style={[styles.inputLabel, { color: colors.plum, fontFamily: fonts.heading }]}>
                Time
              </Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={customFields.time}
                onChangeText={(val) => setCustomFields((prev) => ({ ...prev, time: val }))}
              />

              <Text style={[styles.inputLabel, { color: colors.plum, fontFamily: fonts.heading }]}>
                Palace Venue
              </Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={customFields.venue}
                onChangeText={(val) => setCustomFields((prev) => ({ ...prev, venue: val }))}
              />

              <Text style={[styles.inputLabel, { color: colors.plum, fontFamily: fonts.heading }]}>
                City & State
              </Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={customFields.city}
                onChangeText={(val) => setCustomFields((prev) => ({ ...prev, city: val }))}
              />

              <Text style={[styles.inputLabel, { color: colors.plum, fontFamily: fonts.heading }]}>
                Personal Welcome Message
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={customFields.message}
                multiline
                numberOfLines={3}
                onChangeText={(val) => setCustomFields((prev) => ({ ...prev, message: val }))}
              />
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveModalButton, { backgroundColor: colors.plum }]}
              onPress={() => {
                setIsEditModalOpen(false);
                if (onCustomize) onCustomize(customFields);
              }}
            >
              <Check size={18} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={[styles.saveModalBtnText, { fontFamily: fonts.heading }]}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTopBar: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 14 : 48,
    left: 16,
    right: 16,
    zIndex: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1C2B4',
  },
  activeDot: {
    width: 18,
    height: 6,
    borderRadius: 3,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  slidesScroll: {
    flex: 1,
    width: '100%',
  },
  slideCard: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'web' ? 56 : 90,
    paddingBottom: 20,
  },
  paperDeskCanvas: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(162, 74, 106, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  archOuterLayer: {
    width: '100%',
    height: '100%',
    borderRadius: 240,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  archMiddleLayer: {
    width: '100%',
    height: '100%',
    borderRadius: 230,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archInnerLayer: {
    width: '100%',
    height: '100%',
    borderRadius: 220,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    textAlign: 'center',
  },
  ribbonBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ribbonText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  eyebrowCaps: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  cursiveHeadline: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
  },
  subInviteBody: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 4,
  },
  fleuronDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    width: '80%',
  },
  fleuronLine: {
    flex: 1,
    height: 1,
  },
  fleuronSymbol: {
    marginHorizontal: 8,
    fontSize: 10,
  },
  grandCalligraphyNames: {
    fontSize: 48,
    lineHeight: 52,
    textAlign: 'center',
    marginVertical: 4,
  },
  dateVenueLine: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginVertical: 6,
  },
  actionPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 30,
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionPillText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginRight: 4,
  },
  contentCard: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cursiveSectionTitle: {
    fontSize: 40,
    lineHeight: 46,
    textAlign: 'center',
    marginVertical: 6,
  },
  calendarBox: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  calendarMainDate: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  calendarTime: {
    fontSize: 13,
    fontWeight: '600',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderLeftWidth: 3,
    marginVertical: 8,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
  },
  venuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 6,
  },
  venuePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itineraryScroll: {
    width: '100%',
    maxHeight: 270,
    marginVertical: 6,
  },
  eventRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  eventIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  eventIconEmoji: {
    fontSize: 18,
  },
  eventDetailsCol: {
    flex: 1,
  },
  eventName: {
    fontSize: 14,
    fontWeight: '700',
  },
  eventDate: {
    fontSize: 12,
  },
  eventVenue: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  familyParentBox: {
    width: '100%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    marginVertical: 6,
    alignItems: 'center',
  },
  parentHeaderRole: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  parentNames: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  hostBanner: {
    width: '100%',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  hostLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  hostNames: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  venueDetailsBox: {
    width: '100%',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    marginVertical: 12,
  },
  venueNameHeading: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  venueCitySubtitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  venueNoteText: {
    fontSize: 12,
    textAlign: 'center',
  },
  closingThankYouText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  rsvpWhatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 30,
    marginVertical: 10,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  rsvpBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  soundtrackCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: 8,
  },
  soundtrackLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  soundtrackTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  signatureBlessing: {
    fontSize: 34,
    textAlign: 'center',
    marginTop: 8,
  },

  /* 3D Gate Overlay Styles */
  gateOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
  },
  gateDeskBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  gateHeaderPlate: {
    paddingHorizontal: 28,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 4,
  },
  gatePlateTitle: {
    fontSize: 42,
    lineHeight: 46,
    textAlign: 'center',
  },
  door3DStage: {
    width: Math.min(WINDOW_WIDTH - 40, 360),
    height: 380,
    borderRadius: 24,
    borderWidth: 4,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  doorInnerArch: {
    position: 'absolute',
    inset: 12,
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  previewInnerKicker: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  previewInnerScript: {
    fontSize: 34,
    textAlign: 'center',
    marginVertical: 4,
  },
  previewInnerDate: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  doorLeaf: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50.5%',
    borderWidth: 2,
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftDoorLeaf: {
    left: 0,
    transformOrigin: 'left',
  },
  rightDoorLeaf: {
    right: 0,
    transformOrigin: 'right',
  },
  doorKnockerRing: {
    position: 'absolute',
    top: '48%',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 5,
  },
  openDoorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 30,
    borderWidth: 2.5,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  openDoorBtnText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  /* Modal Styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalContentCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 20,
    borderWidth: 2,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalInputScroll: {
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 4,
  },
  textInput: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    fontSize: 14,
  },
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  saveModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  saveModalBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
