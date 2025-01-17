import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk for fetching users content
export const getLeadsContent = createAsyncThunk('/leads/content', async () => {
    const response = await axios.get('https://wellbe-api.onrender.com/api/v1/users');
    return response.data;
});

export const leadsSlice = createSlice({
    name: 'leads',
    initialState: {
        isLoading: false,
        leads: [],
    },
    reducers: {
        addNewLead: (state, action) => {
            const { newLeadObj } = action.payload;
            state.leads = [...state.leads, newLeadObj];
        },

        deleteLead: (state, action) => {
            const { id } = action.payload;
            state.leads = state.leads.filter((lead) => lead.id !== id);
        },

        updateLead: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.leads.findIndex((lead) => lead.id === id);
            if (index !== -1) {
                state.leads[index] = { ...state.leads[index], ...updatedData };
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getLeadsContent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLeadsContent.fulfilled, (state, action) => {
                // Map API data to fit the expected structure
                state.leads = action.payload.map((user) => ({
                    id: user.user_uuid,
                    email: user.user_email,
                    name: `${user.user_first_name} ${user.user_name}`,
                    phone: user.user_phone,
                    active: user.user_active,
                    role: user.Role?.role_label || 'Unknown',
                }));
                state.isLoading = false;
            })
            .addCase(getLeadsContent.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { addNewLead, deleteLead, updateLead } = leadsSlice.actions;

export default leadsSlice.reducer;
