import { persistedWritable } from '$lib/stores/utils/persist.js';
export const forecast = persistedWritable('fc', 6000);
