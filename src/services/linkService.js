import { supabase } from '../supabaseClient';

export const linkService = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('short_links')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching links:', error);
            return [];
        }
        return data;
    },

    getBySlug: async (slug) => {
        const { data, error } = await supabase
            .from('short_links')
            .select('*')
            .eq('origin', slug)
            .single();

        if (error) {
            // .single() returns error if no rows found, which is expected for non-existent links
            return null;
        }
        return data;
    },

    add: async (origin, destination) => {
        const { data, error } = await supabase
            .from('short_links')
            .insert([
                { origin, destination }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error adding link:', error);
            throw error;
        }
        return data;
    },

    delete: async (id) => {
        const { error } = await supabase
            .from('short_links')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting link:', error);
            throw error;
        }
    },

    incrementClicks: async (id, currentClicks) => {
        const { error } = await supabase
            .from('short_links')
            .update({ clicks: (currentClicks || 0) + 1 })
            .eq('id', id);

        if (error) {
            console.error('Error incrementing clicks:', error);
        }
    }
};
