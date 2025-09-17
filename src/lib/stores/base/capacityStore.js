import { persistedWritable } from '$lib/stores/utils/persist.js';

export const line1Capacity = persistedWritable('cap1', 1400);
export const line2Capacity = persistedWritable('cap2', 1400);
