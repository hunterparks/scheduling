export type NavigationItem = {
	name: string;
	href: string;
	guard?: boolean;
};

export type ScheduleItem = {
	id: number;
	name: string;
	user_id: string;
	created_at: Date;
};

// OLDER STUFF

export type SchoolDay = {
	id: number;
	name: string;
	user_id: string;
	created_at: Date;
};

export type Period = {
	id: number;
	name: string;
	start_time: string;
	end_time: string;
	school_day_id: number;
	user_id: string;
	created_at: Date;
};

export type SpinnerColors =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info'
	| 'light'
	| 'dark';
