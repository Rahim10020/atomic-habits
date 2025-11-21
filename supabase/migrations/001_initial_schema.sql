-- Atomic Habits App - Initial Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Identities table (user identity)
CREATE TABLE identities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    who_you_want_to_be TEXT NOT NULL,
    core_values TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Scorecard items (current habits evaluation)
CREATE TABLE scorecard_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    habit_name TEXT NOT NULL,
    rating TEXT CHECK (rating IN ('positive', 'negative', 'neutral')) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habits table (good habits to build)
CREATE TABLE habits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Basic info
    name TEXT NOT NULL,
    identity_reason TEXT NOT NULL, -- "Because I am someone who..."
    
    -- Implementation intention
    action TEXT NOT NULL,
    time_of_day TEXT NOT NULL,
    location TEXT NOT NULL,
    
    -- Two minute version
    two_minute_version TEXT NOT NULL,
    
    -- Law 1: Make it Obvious
    cue TEXT NOT NULL,
    context TEXT,
    habit_stacking TEXT, -- "After [existing habit], I will [new habit]"
    
    -- Law 2: Make it Attractive
    temptation_bundling TEXT,
    emotional_why TEXT,
    anticipated_reward TEXT,
    
    -- Law 3: Make it Easy
    friction_reducers TEXT[],
    friction_adders_for_bad TEXT[],
    
    -- Law 4: Make it Satisfying
    immediate_reward TEXT,
    
    -- Tracking
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'custom')) DEFAULT 'daily',
    target_days JSONB DEFAULT '[]', -- For weekly/custom: [0,1,2,3,4,5,6] (0=Sunday)
    
    -- Routine category
    routine_type TEXT CHECK (routine_type IN ('morning', 'evening', 'anytime')) DEFAULT 'anytime',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bad habits table (habits to break)
CREATE TABLE bad_habits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    name TEXT NOT NULL,
    
    -- Breaking down the habit loop
    cue TEXT NOT NULL,
    craving TEXT NOT NULL,
    response TEXT NOT NULL,
    reward TEXT NOT NULL,
    
    -- Inversion of 4 laws
    make_invisible TEXT, -- How to hide the cue
    make_unattractive TEXT, -- How to make it unattractive
    make_difficult TEXT, -- How to increase friction
    make_unsatisfying TEXT, -- How to remove satisfaction
    
    -- Tracking
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habit logs (daily tracking)
CREATE TABLE habit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    completed BOOLEAN DEFAULT false,
    log_date DATE NOT NULL,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(habit_id, log_date)
);

-- Accountability partners (optional feature)
CREATE TABLE accountability_partners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    partner_email TEXT NOT NULL,
    partner_name TEXT,
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_active ON habits(is_active) WHERE is_active = true;
CREATE INDEX idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX idx_habit_logs_date ON habit_logs(log_date);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, log_date);
CREATE INDEX idx_scorecard_user_id ON scorecard_items(user_id);
CREATE INDEX idx_bad_habits_user_id ON bad_habits(user_id);

-- Row Level Security (RLS)
ALTER TABLE identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecard_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bad_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Identities
CREATE POLICY "Users can view own identity" ON identities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own identity" ON identities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own identity" ON identities FOR UPDATE USING (auth.uid() = user_id);

-- Scorecard items
CREATE POLICY "Users can view own scorecard" ON scorecard_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scorecard" ON scorecard_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scorecard" ON scorecard_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scorecard" ON scorecard_items FOR DELETE USING (auth.uid() = user_id);

-- Habits
CREATE POLICY "Users can view own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- Bad habits
CREATE POLICY "Users can view own bad habits" ON bad_habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bad habits" ON bad_habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bad habits" ON bad_habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bad habits" ON bad_habits FOR DELETE USING (auth.uid() = user_id);

-- Habit logs
CREATE POLICY "Users can view own logs" ON habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own logs" ON habit_logs FOR DELETE USING (auth.uid() = user_id);

-- Accountability partners
CREATE POLICY "Users can view own partners" ON accountability_partners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own partners" ON accountability_partners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own partners" ON accountability_partners FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own partners" ON accountability_partners FOR DELETE USING (auth.uid() = user_id);

-- Functions
-- Update streak function (called when habit is completed)
CREATE OR REPLACE FUNCTION update_habit_streak(p_habit_id UUID, p_log_date DATE, p_completed BOOLEAN)
RETURNS void AS $$
DECLARE
    v_current_streak INTEGER := 0;
    v_longest_streak INTEGER := 0;
    v_last_log_date DATE;
BEGIN
    IF p_completed THEN
        -- Get the last completed log before this one
        SELECT log_date INTO v_last_log_date
        FROM habit_logs
        WHERE habit_id = p_habit_id AND completed = true AND log_date < p_log_date
        ORDER BY log_date DESC
        LIMIT 1;
        
        -- Calculate current streak
        IF v_last_log_date IS NULL THEN
            v_current_streak := 1;
        ELSIF p_log_date - v_last_log_date = 1 THEN
            -- Consecutive day
            SELECT current_streak + 1 INTO v_current_streak FROM habits WHERE id = p_habit_id;
        ELSE
            -- Streak broken, start new
            v_current_streak := 1;
        END IF;
        
        -- Update longest streak if needed
        SELECT GREATEST(longest_streak, v_current_streak) INTO v_longest_streak FROM habits WHERE id = p_habit_id;
        
        -- Update habit
        UPDATE habits 
        SET current_streak = v_current_streak,
            longest_streak = v_longest_streak,
            updated_at = NOW()
        WHERE id = p_habit_id;
    ELSE
        -- Habit not completed, reset current streak to 0
        UPDATE habits 
        SET current_streak = 0,
            updated_at = NOW()
        WHERE id = p_habit_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update streak automatically
CREATE OR REPLACE FUNCTION trigger_update_streak()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_habit_streak(NEW.habit_id, NEW.log_date, NEW.completed);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER habit_log_streak_update
    AFTER INSERT OR UPDATE OF completed ON habit_logs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_streak();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_identities_updated_at BEFORE UPDATE ON identities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scorecard_updated_at BEFORE UPDATE ON scorecard_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bad_habits_updated_at BEFORE UPDATE ON bad_habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_habit_logs_updated_at BEFORE UPDATE ON habit_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();