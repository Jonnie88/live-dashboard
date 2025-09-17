<script>
	import StatusHeader from '../components/StatusHeader.svelte';
	import ProductionProgress from '../components/ProductionProgress.svelte';
	import EffectiveTime from '../components/EffectiveTime.svelte';
	import LineCapacity from '../components/LineCapacity.svelte';
	import PlannedSpeed from '../components/PlannedSpeed.svelte';
	import BreaksToday from '../components/BreaksToday.svelte';
	import LastStart from '../components/LastStart.svelte';
	import ClearTime from '../components/ClearTime.svelte';
	import PointStylingChart from '../components/PointStylingChart.svelte';
	import ProductionHistoryList from '../components/productionHistoryList.svelte';

	import CollapsiblePlanner from '../components/CollapsiblePlanner.svelte';
</script>

<!-- 🆕 Formulär överst -->
<CollapsiblePlanner open={false} />

<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
	<div class="col-span-1 p-2 sm:col-span-2 lg:col-span-4">
		<StatusHeader />
	</div>

	<div class="col-span-1 p-2 sm:col-span-1 lg:col-span-2"><ProductionProgress /></div>
	<div class="p-2"><EffectiveTime /></div>
	<div class="p-2"><LineCapacity /></div>

	<div class="p-2"><PlannedSpeed /></div>
	<div class="p-2"><BreaksToday /></div>
	<div class="p-2"><LastStart /></div>

	<div class="p-2"><ClearTime /></div>
	<div class="p-2"><PointStylingChart /></div>

	<div class="col-span-1 p-2 sm:col-span-2 lg:col-span-2">
		<ProductionHistoryList />
	</div>
</div>
