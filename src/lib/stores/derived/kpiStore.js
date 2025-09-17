import { derived } from 'svelte/store';
import { totalProduced } from '../base/productionStore.js';
import { forecast } from '../base/targetStore.js';

export const percent = derived([totalProduced, forecast], ([$prod, $fc]) =>
	$fc > 0 ? Math.round(($prod / $fc) * 100) : 0
);
