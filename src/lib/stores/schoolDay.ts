import supabase from '$lib/service/supabase';
import type { SchoolDay } from '$lib/types';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export const schoolDays: Writable<Array<SchoolDay>> = writable([]);

export const loadSchoolDays = async () => {
	const { data, error } = await supabase.from<SchoolDay>('school_day').select();
	if (error) {
		return console.error(error);
	}
	schoolDays.set(data);
};
loadSchoolDays();

export const addSchoolDay = async (name: string, userId: string) => {
	const { data, error } = await supabase
		.from<SchoolDay>('school_day')
		.insert([{ name, user_id: userId }]);
	if (error) {
		return console.error(error);
	}
	schoolDays.update((current) => [...current, data[0]]);
};

export const getSchoolDay = (id: number) =>
	derived(schoolDays, ($schoolDays) => $schoolDays.find((schoolDay) => schoolDay.id === id));

export const deleteSchoolDay = async (id: number) => {
	const { error } = await supabase.from<SchoolDay>('school_day').delete().match({ id });
	if (error) {
		return console.error(error);
	}
	schoolDays.update((schoolDays) => schoolDays.filter((schoolDay) => schoolDay.id !== id));
};
