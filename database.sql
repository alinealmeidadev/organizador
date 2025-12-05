-- Criar tabela de dados do usuário
CREATE TABLE user_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tasks JSONB DEFAULT '[]'::jsonb,
    routines JSONB DEFAULT '[]'::jsonb,
    reminders JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Habilitar Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own data"
    ON user_data FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
    ON user_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
    ON user_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
    ON user_data FOR DELETE
    USING (auth.uid() = user_id);