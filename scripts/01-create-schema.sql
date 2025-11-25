-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  age INTEGER,
  height DECIMAL(5,2),
  weight DECIMAL(6,2),
  goal_type TEXT,
  daily_calorie_target INTEGER DEFAULT 2000,
  daily_water_target INTEGER DEFAULT 2000,
  daily_steps_target INTEGER DEFAULT 10000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food intake logs
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fats DECIMAL(5,2),
  serving_size TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts/Activities
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_name TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT,
  body_parts TEXT[] DEFAULT ARRAY[]::TEXT[],
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  calories_burned INTEGER,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity log (when users do workouts)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  activity_name TEXT NOT NULL,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  distance_km DECIMAL(8,2),
  intensity_level TEXT CHECK (intensity_level IN ('low', 'medium', 'high')),
  notes TEXT,
  gps_route JSONB,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GPS tracking points for map-based activities
CREATE TABLE IF NOT EXISTS gps_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_log_id UUID NOT NULL REFERENCES activity_logs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  altitude DECIMAL(8,2),
  speed_kmh DECIMAL(5,2),
  recorded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for food_logs
CREATE POLICY "Users can view own food logs" ON food_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create food logs" ON food_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food logs" ON food_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all food logs" ON food_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for activity_logs
CREATE POLICY "Users can view own activity logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create activity logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity logs" ON activity_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all activity logs" ON activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for gps_tracks
CREATE POLICY "Users can view own gps tracks" ON gps_tracks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create gps tracks" ON gps_tracks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all gps tracks" ON gps_tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public activities table (no RLS needed, everyone can read)
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_food_logs_user_id ON food_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_food_logs_logged_at ON food_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_completed_at ON activity_logs(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_gps_tracks_activity_log_id ON gps_tracks(activity_log_id);
