const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API endpoint to fetch Free Fire player info
app.get('/api/player-info', async (req, res) => {
  const { uid, region } = req.query;

  if (!uid || isNaN(uid)) {
    return res.status(400).json({ 
      error: 'Please provide a valid UID',
      code: 'INVALID_UID'
    });
  }

  const normalizedRegion = (region || 'bd').toLowerCase();

  const api1 = `https://nodejs-info.vercel.app/info?uid=${uid}`;
  const api2 = `https://aditya-info-v9op.onrender.com/player-info?uid=${uid}&region=${normalizedRegion}`;
  const outfitApi = `https://profile-aimguard.vercel.app/generate-profile?uid=${uid}&region=${normalizedRegion}`;
  const bannerApi = `https://aditya-banner-v9op.onrender.com/banner-image?uid=${uid}&region=${normalizedRegion}`;

  try {
    const [res1, res2] = await Promise.all([
      axios.get(api1).catch(() => ({ data: {} })),
      axios.get(api2).catch(() => ({ data: {} }))
    ]);

    const data1 = res1.data?.data || {};
    const data2 = res2.data || {};

    if (!data1.player_info && !data2.player_info) {
      return res.status(404).json({ 
        error: 'No data found for that UID. Please check the UID and region.',
        code: 'PLAYER_NOT_FOUND'
      });
    }

    const tsToDate = (ts) =>
      ts ? new Date(ts * 1000).toLocaleString("en-US", { 
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false 
      }) : "-";

    const p1 = data1.player_info || {};
    const pet1 = data1.petInfo || {};
    const guild1 = data1.guildInfo || {};

    const p2 = data2.player_info?.basicInfo || {};
    const captain = data2.player_info?.captainBasicInfo || {};
    const clan = data2.player_info?.clanBasicInfo || {};
    const pet2 = data2.player_info?.petInfo || {};
    const social = data2.player_info?.socialInfo || {};
    const creditScore = data2.player_info?.creditScoreInfo?.creditScore || "-";
    const diamondCost = data2.player_info?.diamondCostRes?.diamondCost || "-";
    const weaponSkins = (p2.weaponSkinShows || []).join(", ") || "-";

    const playerData = {
      basic: {
        nickname: p1.nikname || p2.nickname || "Unknown",
        uid: uid,
        level: p1.level || p2.level || "-",
        exp: p1.exp || p2.exp || "-",
        likes: p1.likes || p2.liked || "-",
        region: p1.region || p2.region || normalizedRegion.toUpperCase(),
        accountCreated: p1.account_created || tsToDate(p2.createAt),
        lastLogin: p1.last_login || tsToDate(p2.lastLoginAt),
        signature: p1.signature || social.signature || "None"
      },
      appearance: {
        badgeCount: p2.badgeCnt || "-",
        badgeId: p2.badgeId || "-",
        bannerId: p1.banner_id || p2.bannerId || "-",
        avatarId: p1.avatar_id || p2.headPic || "-",
        titleId: p1.title_id || p2.title || "-"
      },
      battleStats: {
        brRankPoints: p1.br_rank_points || p2.rankingPoints || "-",
        csRankPoints: p1.cs_rank_points || p2.csRankingPoints || "-",
        bpLevel: p1.bp_level || p2.primeLevel?.level || "-",
        csMaxRank: p2.csMaxRank || "-",
        csRank: p2.csRank || "-",
        maxRank: p2.maxRank || "-",
        rank: p2.rank || "-",
        seasonId: p2.seasonId || "-",
        releaseVersion: p1.release_version || p2.releaseVersion || "-",
        diamondCost: diamondCost,
        creditScore: creditScore
      },
      pet: {
        name: pet1.name || pet2.name || "None",
        level: pet1.level || pet2.level || "-",
        exp: pet1.exp || pet2.exp || "-",
        selectedSkillId: pet1.selected_skill_id || pet2.selectedSkillId || "-",
        skinId: pet1.skin_id || pet2.skinId || "-"
      },
      guild: {
        name: guild1.name || clan.clanName || "None",
        level: guild1.level || clan.clanLevel || "-",
        capacity: guild1.capacity || clan.capacity || "-",
        members: guild1.members || clan.memberNum || "-",
        guildId: guild1.guild_id || clan.clanId || "-",
        ownerUid: guild1.owner || clan.captainId || "-",
        ownerNickname: guild1.owner_basic_info?.nickname || captain.nickname || "Unknown",
        ownerLevel: guild1.owner_basic_info?.level || captain.level || "-",
        ownerLikes: guild1.owner_basic_info?.likes || captain.liked || "-"
      },
      captain: {
        nickname: captain.nickname || "Unknown",
        level: captain.level || "-",
        likes: captain.liked || "-",
        brRankPoints: captain.brRankingPoints || captain.rankingPoints || "-",
        csRankPoints: captain.csRankingPoints || "-",
        lastLogin: tsToDate(captain.lastLoginAt)
      },
      social: {
        gender: social.gender || "-",
        language: social.language || "-",
        modePrefer: social.modePrefer || "-",
        rankShow: social.rankShow || "-",
        timeActive: social.timeActive || "-"
      },
      weapons: {
        skins: weaponSkins
      },
      images: {
        outfitUrl: outfitApi,
        bannerUrl: bannerApi
      },
      metadata: {
        fetchedAt: new Date().toISOString(),
        apiVersion: '2.0'
      }
    };

    res.json(playerData);

  } catch (error) {
    console.error('Error fetching player info:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch player info. Please try again later.',
      code: 'SERVER_ERROR'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Default port (for platforms like Render/Vercel)
const DEFAULT_PORT = process.env.PORT || 3000;
app.listen(DEFAULT_PORT, () => {
  console.log(`🔥 Main server running on port ${DEFAULT_PORT}`);
});

// Custom extra ports (locally only)
const extraPorts = [1126, 1269, 4299, 4330];
extraPorts.forEach(port => {
  app.listen(port, () => {
    console.log(`🚀 Also listening on port ${port}`);
  });
});
