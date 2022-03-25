import supabase from '$lib/service/supabase';
import type { Period } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

export const periods: Writable<Array<Array<Period>>> = writable([]);

export const loadPeriods = async () => {
	const { data, error } = await supabase
		.from<Period>('period')
		.select()
		.order('start_time', { ascending: true });
	if (error) {
		return console.error(error);
	}
	data.forEach((datum) => {
		periods.update((current) => {
			if (!current[datum.school_day_id]) {
				current[datum.school_day_id] = [];
			}
			current[datum.school_day_id] = [...current[datum.school_day_id], datum];
			return current;
		});
	});
};
loadPeriods();

export const addPeriod = async (
	name: string,
	startTime: string,
	endTime: string,
	schoolDayId: number,
	userId: string
) => {
	const { data, error } = await supabase.from<Period>('period').insert([
		{
			name,
			start_time: startTime,
			end_time: endTime,
			school_day_id: schoolDayId,
			user_id: userId
		}
	]);
	if (error) {
		return console.error(error);
	}
	periods.update((current) => {
		if (!current[schoolDayId]) {
			current[schoolDayId] = [];
		}
		current[schoolDayId] = [...current[schoolDayId], data[0]];
		return current;
	});
};

// export const deleteSchoolDay = async (schoolDayId: number) => {
// 	const { error } = await supabase
// 		.from<SchoolDay>('school_day')
// 		.delete()
// 		.match({ id: schoolDayId });
// 	if (error) {
// 		// TODO: Handle
// 	}
// 	schoolDays.update((schoolDays) => schoolDays.filter((schoolDay) => schoolDay.id !== schoolDayId));
// };
