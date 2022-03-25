import type { User } from '@supabase/supabase-js';
import { writable, type Writable } from 'svelte/store';

const user: Writable<User | boolean> = writable(false);

export default user;
