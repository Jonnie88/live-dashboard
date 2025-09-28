// ===========================
// $lib/stores/index.js
// Central export av alla stores & utils
// ===========================

// -------- utils --------
export * from './utils/persist.js';
export * from './utils/time-helpers.js';

// -------- base (grunddata) --------
// mål/forecast, kapacitet, tider, producerat
export * from './base/targetStore.js';
export * from './base/capacityStore.js';
export * from './base/timeStore.js';
export * from './base/productionStore.js';

// -------- derived (beräknade) --------
// tid/kalender-beräkningar: effectiveMinutes, effectiveEnd, elapsedEffectiveMinutes, now, m.m.
export * from './derived/timeCalcStore.js';

// krav-tempo från forecast + effektiv tid: speedPkth, speedPkthExact
export * from './derived/throughputStore.js';

// KPI: t.ex. percent (producerat/forecast)
export * from './derived/kpiStore.js';

// progress: planerat producerat hittills, m.m.
export * from './derived/progressStore.js';

// S2-planering (statisk, över hela passet): isS2Needed, pktNeededFromL2, s2RequiredMinutes, s2LatestStart
export * from './derived/s2StaticStore.js';

// S2-planering (live, beroende på nu-läge): remainingForecast, remainingEffectiveMinutes,
// pktNeededFromL2Live, s2RequiredMinutesLive, s2LatestStartLive, isS2NeededLive
export * from './derived/s2LiveStore.js';

// -------- planning (UI-stöd, snapshots etc.) --------
export * from './planning/planningStore.js';
export * from './planning/snapshotStore.js';

// -------- history (för grafer / logg) --------
// productionHistory, addSample, etc.
export * from './history/historyStore.js';
