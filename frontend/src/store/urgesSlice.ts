import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { urgesAPI } from '@/lib/api';
import type {
  Urge,
  UrgeStats,
  CreateUrgeRequest,
  PaginatedUrges,
} from '@/types/api';

// Parameters accepted when logging an urge from UI
export interface LogUrgeParams {
  outcome: 'resisted' | 'gave_in' | 'delayed';
  habitId: string; // required - reference to habit
  trigger?: string;
  notes?: string;
  // optional client-provided timestamp (string or Date). Backend may auto-fill.
  timestamp?: string | Date;
}

interface LoadingState {
  logging: boolean;
  fetchingUrges: boolean;
  fetchingStats: boolean;
}

interface UrgesState {
  urges: Urge[]; // full list (paginated)
  recentUrges: Urge[]; // last 10 urges for quick display
  stats: UrgeStats | null;
  loading: LoadingState;
  error: string | null;
  // map of requestId -> tempId for optimistic logs
  optimisticMap: Record<string, string>;
}

const initialState: UrgesState = {
  urges: [],
  recentUrges: [],
  stats: null,
  loading: { logging: false, fetchingUrges: false, fetchingStats: false },
  error: null,
  optimisticMap: {},
};

// Async thunks
export const logUrge = createAsyncThunk<
  Urge,
  LogUrgeParams,
  { rejectValue: string }
>('urges/logUrge', async (params: LogUrgeParams, { rejectWithValue }) => {
  try {
    // create API payload matching CreateUrgeRequest
    const payload: CreateUrgeRequest = {
      outcome: params.outcome,
      habitId: params.habitId,
      trigger: params.trigger,
      notes: params.notes,
      timestamp: params.timestamp,
    };
    const response = await urgesAPI.logUrge(payload);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to log urge'
    );
  }
});

export const fetchUrges = createAsyncThunk<
  PaginatedUrges,
  { limit?: number; offset?: number },
  { rejectValue: string }
>(
  'urges/fetchUrges',
  async ({ limit = 20, offset = 0 } = {}, { rejectWithValue }) => {
    try {
      const response = await urgesAPI.getUrges(limit, offset);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch urges'
      );
    }
  }
);

export const fetchStats = createAsyncThunk<
  UrgeStats,
  void,
  { rejectValue: string }
>('urges/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const response = await urgesAPI.getStats();
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch stats'
    );
  }
});

const urgesSlice = createSlice({
  name: 'urges',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUrges: (state) => {
      state.urges = [];
      state.recentUrges = [];
      state.stats = null;
      state.optimisticMap = {};
    },
  },
  extraReducers: (builder) => {
    // Log Urge
    builder
      .addCase(logUrge.pending, (state, action) => {
        state.loading.logging = true;
        state.error = null;

        // Create a temporary urge for optimistic UI using requestId
        const reqId = action.meta.requestId;
        const tempId = `temp-${reqId}`;
        const args = action.meta.arg as LogUrgeParams;
        const tempUrge: Urge = {
          id: tempId,
          userId: 'local',
          habitId: args.habitId,
          outcome: args.outcome,
          trigger: args.trigger,
          notes: args.notes,
          createdAt: new Date().toISOString(),
        } as Urge;

        // insert into front of arrays
        state.urges.unshift(tempUrge);
        state.recentUrges = [tempUrge, ...state.recentUrges].slice(0, 10);

        // optimistic stats increment
        if (state.stats) {
          state.stats.totalUrges += 1;
          if (args.outcome === 'resisted') state.stats.totalResisted += 1;
          else if (args.outcome === 'gave_in') state.stats.totalGaveIn += 1;
          else if (args.outcome === 'delayed') state.stats.totalDelayed += 1;
        }

        state.optimisticMap[reqId] = tempId;
      })
      .addCase(logUrge.fulfilled, (state, action) => {
        state.loading.logging = false;

        const reqId = action.meta.requestId;
        const tempId = state.optimisticMap[reqId];

        if (tempId) {
          const idx = state.urges.findIndex((u) => u.id === tempId);
          if (idx >= 0) {
            // replace temp with server-provided urge
            state.urges[idx] = action.payload;
          } else {
            state.urges.unshift(action.payload);
          }

          // update recentUrges as well (replace or add)
          const rIdx = state.recentUrges.findIndex((u) => u.id === tempId);
          if (rIdx >= 0) state.recentUrges[rIdx] = action.payload;
          else
            state.recentUrges = [action.payload, ...state.recentUrges].slice(
              0,
              10
            );

          delete state.optimisticMap[reqId];
        } else {
          // no temp - just add to the front
          state.urges.unshift(action.payload);
          state.recentUrges = [action.payload, ...state.recentUrges].slice(
            0,
            10
          );
        }

        // Ensure stats exist and reflect server data (optionally, we could merge)
        // For now we leave stats as-is; caller should refresh stats via fetchStats when needed
      })
      .addCase(logUrge.rejected, (state, action) => {
        state.loading.logging = false;
        state.error = action.payload as string;

        const reqId = action.meta.requestId;
        const tempId = state.optimisticMap[reqId];
        if (tempId) {
          // remove the optimistic temp urge
          const idx = state.urges.findIndex((u) => u.id === tempId);
          const removed = idx >= 0 ? state.urges.splice(idx, 1)[0] : null;

          // remove from recentUrges
          state.recentUrges = state.recentUrges
            .filter((u) => u.id !== tempId)
            .slice(0, 10);

          // revert optimistic stats if we have removed an item
          if (removed && state.stats) {
            state.stats.totalUrges = Math.max(0, state.stats.totalUrges - 1);
            if (removed.outcome === 'resisted')
              state.stats.totalResisted = Math.max(
                0,
                state.stats.totalResisted - 1
              );
            else if (removed.outcome === 'gave_in')
              state.stats.totalGaveIn = Math.max(
                0,
                state.stats.totalGaveIn - 1
              );
            else if (removed.outcome === 'delayed')
              state.stats.totalDelayed = Math.max(
                0,
                state.stats.totalDelayed - 1
              );
          }

          delete state.optimisticMap[reqId];
        }
      });

    // Fetch Urges
    builder
      .addCase(fetchUrges.pending, (state) => {
        state.loading.fetchingUrges = true;
        state.error = null;
      })
      .addCase(fetchUrges.fulfilled, (state, action) => {
        state.loading.fetchingUrges = false;
        state.urges = action.payload.urges;
        state.recentUrges = action.payload.urges.slice(0, 10);
      })
      .addCase(fetchUrges.rejected, (state, action) => {
        state.loading.fetchingUrges = false;
        state.error = action.payload as string;
      });

    // Fetch Stats
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading.fetchingStats = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading.fetchingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading.fetchingStats = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearUrges } = urgesSlice.actions;

export default urgesSlice.reducer;
