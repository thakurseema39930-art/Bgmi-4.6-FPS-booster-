export interface BgmiFeature {
  id: string;
  title: string;
  category: 'Themed Mode' | '120 FPS & Graphics' | '165 FPS Ultra' | 'Weapons & Balance' | 'Vehicles' | 'Tactical & Audio' | 'Royale Pass & Events';
  badge: string;
  summary: string;
  details: string[];
  proTips: string;
  impactScore: number; // 1-10
}

export const BGMI_4_6_FEATURES: BgmiFeature[] = [
  {
    id: 'fps-165-ultra',
    title: 'Ultra 165 FPS Engine & 6.06ms Frame Latency Lock',
    category: '165 FPS Ultra',
    badge: '165Hz Display Mode',
    summary: 'Unlocked ultra-high refresh rate support for dedicated 165Hz gaming smartphones and external esports monitors, delivering an unprecedented 6.06ms frame latency pipeline.',
    details: [
      'Official compatibility for 165Hz flagships: ROG Phone 7/8/9 Ultimate, RedMagic 8/9/10S Pro, Legion Phone, and high-refresh emulators.',
      'Frame delivery budget dropped from 8.33ms (120 FPS) down to 6.06ms per frame, yielding maximum visual fluidity.',
      'Supercharged 720Hz/960Hz Touch Sampling Synchronization: Instantaneous flick-aim registering without frame pacing hitches.',
      'Bypass thermal governor profiles when active cooling fans or Peltier phone coolers are detected.',
    ],
    proTips: 'For 165Hz, set your device screen refresh rate to fixed 165Hz in phone Display Settings, disable Dynamic LTPO switching, and select Smooth + 165 FPS.',
    impactScore: 10,
  },
  {
    id: 'suzuki-collaboration',
    title: 'Official Suzuki Superbike Collaboration (Hayabusa & Katana)',
    category: 'Vehicles',
    badge: 'Suzuki Collaboration',
    summary: 'The iconic high-performance Suzuki superbike partnership brings the legendary Hayabusa GSX1300R and Suzuki Katana into BGMI with high-revving acoustics and precision lean handling.',
    details: [
      'Suzuki Hayabusa GSX1300R Skin: Replaces standard 2-seater motorcycle with aerodynamic aerodynamic bodywork and dual twin-exhaust.',
      'Suzuki Katana Racing Variant: Aggressive naked streetfighter aesthetics with high-torque low-end acceleration.',
      'High-Speed Aerodynamic Downforce: Reduced mid-air flipping when jumping hills at 150+ km/h, preventing accidental squad knockouts.',
      'Authentic 1340cc 4-Cylinder Exhaust Note: High-fidelity engine audio recorded directly from real-life Suzuki superbikes with pitch-accurate Doppler effect.',
      'Nitrous Burner Boost Effect: Blue flame exhaust sparks when holding the shift/boost button on straight Erangel highways.',
    ],
    proTips: 'The Suzuki Hayabusa has a 12% narrower collision hitbox than standard bikes, making it much harder for sniper squads on bridge towers to headshot you at full throttle.',
    impactScore: 10,
  },
  {
    id: 'fps-120-expansion',
    title: 'Native 120 FPS Mode & Refresh Rate Engine',
    category: '120 FPS & Graphics',
    badge: 'Hardware Upgrade',
    summary: 'BGMI 4.6 expands native 120 frames per second support to all modern flagship chipsets with ultra-smooth touch response and zero motion blur.',
    details: [
      'Added official 120 FPS support for Snapdragon 8 Gen 2, Gen 3, Dimensity 9200/9300, and Apple A17 Pro/M-series.',
      'Reduced frame pacing variance by 34% during heavy smoke grenades and close-quarters Pochinki squad fights.',
      'New "Dynamic Resolution Scaling" toggle prevents thermal throttling when phone temperature crosses 42°C.',
      'Enhanced touch response pipeline: Touch sampling latency reduced down to sub-8ms on 240Hz/360Hz touch screens.',
    ],
    proTips: 'Always pair 120 FPS with "Smooth" graphic quality and disable "Auto-adjust graphics" in settings to lock framerates without sudden drops.',
    impactScore: 10,
  },
  {
    id: 'cyber-mech-mode',
    title: 'Cyber Mecha & Titan Battleground Themed Mode',
    category: 'Themed Mode',
    badge: 'New Themed Mode',
    summary: 'A futuristic warfare themed mode introducing deployable combat mechas, hover thrusters, and air-drop beacon summons on Erangel and Livik.',
    details: [
      'Dual-Form Mecha Units: Transition between high-speed wheeled reconnaissance mode and heavy combat bipedal assault mode.',
      'Pilot & Co-Pilot System: One player navigates while the second operates the dual-missile pods and electromagnetic cannon.',
      'Assembly Stations: Located at Military Base, Georgopol, School, and Yasnaya Polyana where broken mecha parts can be repaired.',
      'Self-Emergency AED & Respawn Stations: Carry up to 1 Self-Revive Kit in the themed zone to revive without teammate assistance.',
    ],
    proTips: 'Mecha shields have high resistance to 5.56mm bullets but take heavy critical damage from AMR, AWM, and RPG rockets. Aim for the rear cooling radiator.',
    impactScore: 9,
  },
  {
    id: 'weapon-rebalance',
    title: 'Weapon Overhaul: 5.56mm Buff & Shotgun Spread Tuning',
    category: 'Weapons & Balance',
    badge: 'Gunplay Rebalance',
    summary: 'Comprehensive weapon balance fine-tuning close-range TTK (time-to-kill), DMR bullet drop, and assault rifle recoil control.',
    details: [
      'M416 & SCAR-L: First 5-bullet horizontal kick reduced by 8%, making 4x and 6x spray transfers more consistent.',
      'DBS & S12K Shotguns: Pellet spread increased slightly at 15m+ range, reducing one-shot knockdown instances at medium distances.',
      'SLR & SKS DMRs: Bullet velocity boosted from 840 m/s to 890 m/s with reduced vertical camera bounce for long-range tapping.',
      'P90 SMG (Crate Only): Integrated laser sight + holographic scope with 50-round spiral magazine, offering unrivaled hip-fire accuracy.',
    ],
    proTips: 'With the 4.6 DMR bullet velocity buff, the SLR now requires less leading on running targets at 200m+. Use Compensator + Cheek Pad.',
    impactScore: 8,
  },
  {
    id: 'vehicle-allterrain',
    title: 'Armored Amphibious Hovercraft & Vehicle Health HUD',
    category: 'Vehicles',
    badge: 'Mobility Upgrade',
    summary: 'New all-terrain armored hovercraft that glides across both water and land without slowdown, plus real-time tire and armor health meters.',
    details: [
      'Amphibious Hovercraft: Glides over river water and swamps seamlessly at 85 km/h, preventing bridge camp ambushes.',
      'Vehicle Component HUD: Teammates can now see precise engine health, remaining fuel, and individual tire integrity percentages.',
      'Vehicle Repair Toolkit: 5-second deployable field repair consumable that restores 45% vehicle health and replaces blown tires.',
      'Glider & Buggy Handling: Drift physics tuned for higher traction on Erangel grassy hills and Miramar desert dunes.',
    ],
    proTips: 'Use the Hovercraft to cross from Georgopol river directly into Rozhok without needing to pass through the heavily camped bridges.',
    impactScore: 8,
  },
  {
    id: 'audio-spatial-3d',
    title: 'Dolby Atmos Spatial Audio & Vertical Footstep Separation',
    category: 'Tactical & Audio',
    badge: 'Tactical Audio',
    summary: 'Revamped sound engine with true 3D spatial height audio, allowing players to clearly distinguish between footsteps above, below, or on the same floor.',
    details: [
      'Vertical Pinpointing: Crystal-clear distinction when enemies are walking on the roof, 2nd floor, or ground floor in apartment buildings.',
      'Low-Latency Audio Mode: Direct hardware bypass reducing Bluetooth earphone audio delay by up to 40ms.',
      'Gunshot Distance Echo: Realistic sound decay curve lets you gauge exact sniper distance (100m vs 300m vs 500m) by acoustic reverb.',
      'Quick Marker 2.0: Instant enemy location pinging now displays exact calculated distance in meters above the marker.',
    ],
    proTips: 'Switch Audio Quality in BGMI Settings to "Ultra" and download the SFX resource pack. Keep Master Volume at 100% and UI Sound at 40% for pure footstep clarity.',
    impactScore: 9,
  },
  {
    id: 'revive-recall-upgrade',
    title: 'Fast Recall Towers & Blue Zone Pacing Update',
    category: 'Themed Mode',
    badge: 'Competitive Meta',
    summary: 'Recall towers now feature accelerated countdowns and parachute deployment speed, keeping eliminated squadmates active in the match.',
    details: [
      'Recall Tower activation time reduced from 6 seconds to 3.8 seconds.',
      'Recalled players now spawn with a Level 1 helmet, vest, and a Tommy Gun with 60 rounds to defend against drop campers.',
      'Zone 4 & Zone 5 shrinkage delay reduced by 20 seconds, preventing passive edge-camping in competitive lobby ranks.',
      'Emergency Pickup Flight Path: Aircraft flies at higher altitude with faster zipline ascension.',
    ],
    proTips: 'When recalling a teammate in final circles, throw a smoke directly on the recall terminal—the shorter 3.8s timer fits perfectly within one smoke duration.',
    impactScore: 8,
  },
  {
    id: 'royale-pass-a-series',
    title: 'Royale Pass A-Series & India Exclusive Cultural Events',
    category: 'Royale Pass & Events',
    badge: 'Cosmetics & Events',
    summary: 'All-new 100-tier Royale Pass featuring mythic upgradable weapon finishes, exclusive Indian voice packs, and festival themed events.',
    details: [
      'Customizable Mythic Outfits with selectable color swatches and synchronized squad victory emotes.',
      'Upgradable Gun Skin with custom elimination broadcast, loot crate effect, and on-hit sparks.',
      'Exclusive Indian Hindi, Tamil, and Telugu Voice Packs with tactical quick-chat callouts ("Enemy aage hai", "Cover do").',
      'Daily Login and Clan Battle events with guaranteed classic and premium crate coupons.',
    ],
    proTips: 'Complete elite missions in Team Deathmatch (TDM) or Livik for the fastest RP tier point farming.',
    impactScore: 7,
  },
];
