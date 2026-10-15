-- ============================================
-- DOJANG - Base de données Supabase
-- Système de gestion des compétitions de taekwondo
-- Version: 1.0
-- Date: 2026
-- ============================================

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TYPES ENUM
-- ============================================

-- Genre
CREATE TYPE gender_enum AS ENUM ('M', 'F');

-- Statut d'inscription
CREATE TYPE athlete_status_enum AS ENUM ('inscrit', 'pesé', 'forfait');

-- Statut de match
CREATE TYPE match_status_enum AS ENUM ('attente', 'pret', 'encours', 'termine');

-- Statut de catégorie
CREATE TYPE category_status_enum AS ENUM ('ouverte', 'tirée', 'terminée');

-- Type de compétition
CREATE TYPE competition_type_enum AS ENUM ('locale', 'nationale', 'internationale');

-- Statut de compétition
CREATE TYPE competition_status_enum AS ENUM ('brouillon', 'active', 'terminee', 'archivee');

-- Type de sponsor
CREATE TYPE sponsor_type_enum AS ENUM ('principal', 'officiel', 'partenaire', 'media', 'technique');

-- Niveau de sponsor
CREATE TYPE sponsor_level_enum AS ENUM ('or', 'argent', 'bronze');

-- Statut de sponsor
CREATE TYPE sponsor_status_enum AS ENUM ('actif', 'en_attente', 'expire');

-- Statut de réclamation
CREATE TYPE claim_status_enum AS ENUM ('soumise', 'en_examen', 'acceptee', 'rejetee');

-- Type de scan QR
CREATE TYPE qr_scan_type_enum AS ENUM ('presence', 'pesee');

-- Niveau de ceinture
CREATE TYPE belt_level_enum AS ENUM ('gup', 'dan');

-- Couleur de ceinture
CREATE TYPE belt_color_enum AS ENUM (
  'blanche', 'jaune', 'jaune-vert', 'vert', 'vert-bleu',
  'bleu', 'bleu-rouge', 'rouge', 'rouge-noire', 'noire'
);

-- Statut d'examen de grade
CREATE TYPE exam_status_enum AS ENUM (
  'planifie', 'inscrit', 'en_cours', 'evalue',
  'reussi', 'echoue', 'reporte', 'annule'
);

-- Résultat d'examen
CREATE TYPE exam_result_enum AS ENUM ('reussi', 'echoue', 'conditionnel');

-- Type de catégorie Poomsae
CREATE TYPE poomsae_category_enum AS ENUM (
  'individuel-reconnu', 'individuel-freestyle',
  'equipe-reconnu', 'equipe-freestyle'
);

-- Division Poomsae
CREATE TYPE poomsae_division_enum AS ENUM ('cadet', 'junior', 'senior', 'veteran');

-- Type de catégorie Casse
CREATE TYPE breaking_category_enum AS ENUM ('technique', 'puissance', 'special', 'freestyle');

-- Division Casse
CREATE TYPE breaking_division_enum AS ENUM ('debutant', 'intermediaire', 'avance', 'expert');

-- Résultat de tentative de casse
CREATE TYPE attempt_result_enum AS ENUM ('reussi', 'echoue', 'partiel', 'disqualifie');

-- Statut de performance
CREATE TYPE performance_status_enum AS ENUM ('attente', 'en_cours', 'terminee', 'abandonnee', 'disqualifiee');

-- ============================================
-- TABLES PRINCIPALES
-- ============================================

-- Organisateurs
CREATE TABLE organizers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  organization VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compétitions
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type competition_type_enum NOT NULL,
  status competition_status_enum NOT NULL DEFAULT 'brouillon',
  organizer_id UUID REFERENCES organizers(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  venue VARCHAR(255) NOT NULL,
  arenas INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clubs
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  president VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlètes
CREATE TABLE athletes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender gender_enum NOT NULL,
  birth_year INTEGER NOT NULL,
  club VARCHAR(255) NOT NULL,
  license VARCHAR(50) NOT NULL UNIQUE,
  weight DECIMAL(5,2),
  category VARCHAR(20),
  status athlete_status_enum NOT NULL DEFAULT 'inscrit',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Arbitres
CREATE TABLE referees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  license VARCHAR(50) NOT NULL UNIQUE,
  grade VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'actif',
  matches_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsors
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type sponsor_type_enum NOT NULL,
  level sponsor_level_enum NOT NULL,
  logo TEXT,
  logo_high_res TEXT,
  website TEXT,
  contact VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status sponsor_status_enum NOT NULL DEFAULT 'en_attente',
  amount DECIMAL(12,2),
  description TEXT,
  visibility TEXT[],
  benefits TEXT[],
  contract_file TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paiements des sponsors
CREATE TABLE sponsor_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  method VARCHAR(100),
  reference VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communications des sponsors
CREATE TABLE sponsor_communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  participants TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Réclamations
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID,
  category_id VARCHAR(50) NOT NULL,
  athlete_id UUID REFERENCES athletes(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  status claim_status_enum NOT NULL DEFAULT 'soumise',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scans QR
CREATE TABLE qr_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE SET NULL,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type qr_scan_type_enum NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLES KYORUGI
-- ============================================

-- Matchs Kyorugi
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id VARCHAR(50) NOT NULL,
  round INTEGER NOT NULL,
  index INTEGER NOT NULL,
  athlete_a UUID REFERENCES athletes(id) ON DELETE SET NULL,
  athlete_b UUID REFERENCES athletes(id) ON DELETE SET NULL,
  base_a INTEGER DEFAULT 0,
  base_b INTEGER DEFAULT 0,
  gam_a INTEGER DEFAULT 0,
  gam_b INTEGER DEFAULT 0,
  winner VARCHAR(1),
  bye BOOLEAN DEFAULT FALSE,
  status match_status_enum NOT NULL DEFAULT 'attente',
  next_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  next_slot VARCHAR(1),
  clock_time INTEGER,
  clock_round INTEGER,
  clock_phase VARCHAR(50),
  arena_id VARCHAR(50),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  called BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Résultats par catégorie
CREATE TABLE category_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id VARCHAR(50) NOT NULL UNIQUE,
  gold UUID REFERENCES athletes(id) ON DELETE SET NULL,
  silver UUID REFERENCES athletes(id) ON DELETE SET NULL,
  bronze_1 UUID REFERENCES athletes(id) ON DELETE SET NULL,
  bronze_2 UUID REFERENCES athletes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLES POOMSAE
-- ============================================

-- Catégories Poomsae
CREATE TABLE poomsae_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type poomsae_category_enum NOT NULL,
  division poomsae_division_enum NOT NULL,
  belt_level VARCHAR(50) NOT NULL,
  gender gender_enum NOT NULL,
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  required_form VARCHAR(100),
  team_size INTEGER,
  max_participants INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performances Poomsae
CREATE TABLE poomsae_performances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES poomsae_categories(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athletes(id) ON DELETE SET NULL,
  form VARCHAR(100) NOT NULL,
  order_number INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration DECIMAL(5,2),
  final_score DECIMAL(5,2),
  status performance_status_enum NOT NULL DEFAULT 'attente',
  arena_id VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notations des juges Poomsae
CREATE TABLE poomsae_judge_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  performance_id UUID REFERENCES poomsae_performances(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES referees(id) ON DELETE SET NULL,
  accuracy DECIMAL(3,2) NOT NULL,
  power DECIMAL(3,2) NOT NULL,
  balance DECIMAL(3,2) NOT NULL,
  rhythm DECIMAL(3,2) NOT NULL,
  expression DECIMAL(3,2) NOT NULL,
  presentation DECIMAL(3,2) NOT NULL,
  deductions DECIMAL(3,2) DEFAULT 0,
  comments TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLES CASSE (BREAKING)
-- ============================================

-- Catégories Casse
CREATE TABLE breaking_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category breaking_category_enum NOT NULL,
  division breaking_division_enum NOT NULL,
  gender gender_enum NOT NULL,
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  belt_level VARCHAR(50) NOT NULL,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  time_limit INTEGER NOT NULL DEFAULT 120,
  max_participants INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performances Casse
CREATE TABLE breaking_performances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES breaking_categories(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athletes(id) ON DELETE SET NULL,
  order_number INTEGER NOT NULL,
  total_score DECIMAL(5,2) DEFAULT 0,
  successful_breaks INTEGER DEFAULT 0,
  failed_breaks INTEGER DEFAULT 0,
  status performance_status_enum NOT NULL DEFAULT 'attente',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tentatives de casse
CREATE TABLE breaking_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  performance_id UUID REFERENCES breaking_performances(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  material_id VARCHAR(50) NOT NULL,
  technique_id VARCHAR(50) NOT NULL,
  result attempt_result_enum NOT NULL,
  score DECIMAL(3,2) NOT NULL,
  power_score DECIMAL(3,2) NOT NULL,
  technique_score DECIMAL(3,2) NOT NULL,
  form_score DECIMAL(3,2) NOT NULL,
  deductions DECIMAL(3,2) DEFAULT 0,
  comments TEXT,
  injuries TEXT[],
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLES PASSAGES DE GRADES
-- ============================================

-- Ceintures
CREATE TABLE belts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  color belt_color_enum NOT NULL,
  level belt_level_enum NOT NULL,
  grade INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  min_age INTEGER,
  min_time_in_previous INTEGER,
  requirements JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Examens de grade
CREATE TABLE grade_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  target_belt_id UUID REFERENCES belts(id) ON DELETE SET NULL,
  previous_belt_id UUID REFERENCES belts(id) ON DELETE SET NULL,
  status exam_status_enum NOT NULL DEFAULT 'planifie',
  organizer_id UUID REFERENCES organizers(id) ON DELETE SET NULL,
  max_participants INTEGER NOT NULL DEFAULT 50,
  registration_deadline DATE NOT NULL,
  registration_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  evaluation_criteria JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inscriptions aux examens
CREATE TABLE exam_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES grade_exams(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid BOOLEAN DEFAULT FALSE,
  eligible BOOLEAN DEFAULT FALSE,
  eligibility_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Évaluations d'examens
CREATE TABLE exam_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID REFERENCES exam_registrations(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athletes(id) ON DELETE SET NULL,
  exam_id UUID REFERENCES grade_exams(id) ON DELETE CASCADE,
  techniques_score DECIMAL(3,2) NOT NULL,
  poomsae_score DECIMAL(3,2) NOT NULL,
  sparring_score DECIMAL(3,2),
  theory_score DECIMAL(3,2),
  breaking_score DECIMAL(3,2),
  attitude_score DECIMAL(3,2) NOT NULL,
  final_score DECIMAL(5,2) NOT NULL,
  passed BOOLEAN NOT NULL,
  result exam_result_enum NOT NULL,
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT[],
  examiner_comments TEXT,
  evaluation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificats de grade
CREATE TABLE grade_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE SET NULL,
  belt_id UUID REFERENCES belts(id) ON DELETE SET NULL,
  exam_id UUID REFERENCES grade_exams(id) ON DELETE SET NULL,
  exam_date DATE NOT NULL,
  final_score DECIMAL(5,2) NOT NULL,
  certificate_number VARCHAR(100) NOT NULL UNIQUE,
  issue_date DATE NOT NULL,
  issued_by VARCHAR(255) NOT NULL,
  signed_by TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  verification_code VARCHAR(50) NOT NULL UNIQUE,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLES ACTIVITÉ ET NOTIFICATIONS
-- ============================================

-- Journal d'activité
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  kind VARCHAR(50) NOT NULL,
  label TEXT NOT NULL,
  user_id UUID,
  metadata JSONB
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEX POUR PERFORMANCE
-- ============================================

-- Index sur les clés étrangères
CREATE INDEX idx_competitions_organizer ON competitions(organizer_id);
CREATE INDEX idx_athletes_club ON athletes(club);
CREATE INDEX idx_athletes_license ON athletes(license);
CREATE INDEX idx_matches_category ON matches(category_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_claims_athlete ON claims(athlete_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_qr_scans_athlete ON qr_scans(athlete_id);
CREATE INDEX idx_sponsor_payments_sponsor ON sponsor_payments(sponsor_id);
CREATE INDEX idx_sponsor_communications_sponsor ON sponsor_communications(sponsor_id);

-- Index sur les dates
CREATE INDEX idx_competitions_dates ON competitions(start_date, end_date);
CREATE INDEX idx_matches_scheduled ON matches(scheduled_time);
CREATE INDEX idx_grade_exams_date ON grade_exams(date);
CREATE INDEX idx_activity_log_timestamp ON activity_log(timestamp DESC);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp DESC);

-- Index composites
CREATE INDEX idx_athletes_status_club ON athletes(status, club);
CREATE INDEX idx_matches_category_status ON matches(category_id, status);
CREATE INDEX idx_sponsors_status_level ON sponsors(status, level);

-- Index full-text pour recherche
CREATE INDEX idx_athletes_search ON athletes USING gin(
  to_tsvector('french', first_name || ' ' || last_name || ' ' || club || ' ' || license)
);

CREATE INDEX idx_clubs_search ON clubs USING gin(
  to_tsvector('french', name || ' ' || city || ' ' || region)
);

CREATE INDEX idx_sponsors_search ON sponsors USING gin(
  to_tsvector('french', name || ' ' || contact)
);

-- ============================================
-- TRIGGERS POUR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger à toutes les tables avec updated_at
CREATE TRIGGER update_organizers_updated_at BEFORE UPDATE ON organizers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referees_updated_at BEFORE UPDATE ON referees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_results_updated_at BEFORE UPDATE ON category_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poomsae_categories_updated_at BEFORE UPDATE ON poomsae_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poomsae_performances_updated_at BEFORE UPDATE ON poomsae_performances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_breaking_categories_updated_at BEFORE UPDATE ON breaking_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_breaking_performances_updated_at BEFORE UPDATE ON breaking_performances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_belts_updated_at BEFORE UPDATE ON belts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grade_exams_updated_at BEFORE UPDATE ON grade_exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VUES POUR RAPPORTS
-- ============================================

-- Vue des statistiques par compétition
CREATE VIEW competition_stats AS
SELECT
  c.id,
  c.name,
  c.type,
  c.status,
  c.start_date,
  c.end_date,
  c.venue,
  COUNT(DISTINCT a.id) AS total_athletes,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'pesé') AS weighed_athletes,
  COUNT(DISTINCT m.id) AS total_matches,
  COUNT(DISTINCT m.id) FILTER (WHERE m.status = 'termine') AS completed_matches
FROM competitions c
LEFT JOIN athletes a ON TRUE
LEFT JOIN matches m ON TRUE
GROUP BY c.id, c.name, c.type, c.status, c.start_date, c.end_date, c.venue;

-- Vue des classements de clubs
CREATE VIEW club_rankings AS
SELECT
  a.club,
  COUNT(*) AS total_athletes,
  COUNT(*) FILTER (WHERE a.status = 'pesé') AS weighed_athletes,
  COUNT(*) FILTER (WHERE a.status = 'forfait') AS forfeit_athletes
FROM athletes a
GROUP BY a.club
ORDER BY total_athletes DESC;

-- Vue des sponsors actifs
CREATE VIEW active_sponsors AS
SELECT
  s.id,
  s.name,
  s.type,
  s.level,
  s.amount,
  s.start_date,
  s.end_date,
  COALESCE(SUM(sp.amount), 0) AS total_paid,
  s.amount - COALESCE(SUM(sp.amount), 0) AS remaining_amount
FROM sponsors s
LEFT JOIN sponsor_payments sp ON s.id = sp.sponsor_id AND sp.status = 'paye'
WHERE s.status = 'actif'
GROUP BY s.id, s.name, s.type, s.level, s.amount, s.start_date, s.end_date;

-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour calculer le score final d'un examen
CREATE OR REPLACE FUNCTION calculate_exam_final_score(
  p_techniques DECIMAL,
  p_poomsae DECIMAL,
  p_sparring DECIMAL,
  p_theory DECIMAL,
  p_breaking DECIMAL,
  p_attitude DECIMAL,
  p_criteria JSONB
) RETURNS DECIMAL AS $$
DECLARE
  v_total DECIMAL := 0;
BEGIN
  v_total := v_total + (p_techniques * (p_criteria->>'techniques_weight')::DECIMAL / 100);
  v_total := v_total + (p_poomsae * (p_criteria->>'poomsae_weight')::DECIMAL / 100);
  
  IF p_sparring IS NOT NULL AND p_criteria ? 'sparring_weight' THEN
    v_total := v_total + (p_sparring * (p_criteria->>'sparring_weight')::DECIMAL / 100);
  END IF;
  
  IF p_theory IS NOT NULL AND p_criteria ? 'theory_weight' THEN
    v_total := v_total + (p_theory * (p_criteria->>'theory_weight')::DECIMAL / 100);
  END IF;
  
  IF p_breaking IS NOT NULL AND p_criteria ? 'breaking_weight' THEN
    v_total := v_total + (p_breaking * (p_criteria->>'breaking_weight')::DECIMAL / 100);
  END IF;
  
  v_total := v_total + (p_attitude * (p_criteria->>'attitude_weight')::DECIMAL / 100);
  
  RETURN ROUND(v_total * 100) / 100;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier l'éligibilité d'un athlète
CREATE OR REPLACE FUNCTION check_athlete_eligibility(
  p_athlete_id UUID,
  p_target_belt_id UUID
) RETURNS TABLE(eligible BOOLEAN, reasons TEXT[]) AS $$
DECLARE
  v_athlete RECORD;
  v_belt RECORD;
  v_reasons TEXT[] := ARRAY[]::TEXT[];
BEGIN
  SELECT * INTO v_athlete FROM athletes WHERE id = p_athlete_id;
  SELECT * INTO v_belt FROM belts WHERE id = p_target_belt_id;
  
  -- Vérifier l'âge
  IF v_belt.min_age IS NOT NULL THEN
    IF (EXTRACT(YEAR FROM NOW()) - v_athlete.birth_year) < v_belt.min_age THEN
      v_reasons := array_append(v_reasons, 'Âge minimum requis: ' || v_belt.min_age || ' ans');
    END IF;
  END IF;
  
  -- Retourner le résultat
  RETURN QUERY SELECT 
    CASE WHEN array_length(v_reasons, 1) IS NULL THEN TRUE ELSE FALSE END,
    v_reasons;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referees ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique pour certaines tables
CREATE POLICY "Public read access" ON athletes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON clubs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON competitions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sponsors FOR SELECT USING (true);

-- ============================================
-- DONNÉES INITIALES
-- ============================================

-- Insérer les ceintures par défaut (système WT)
INSERT INTO belts (color, level, grade, name, min_age, min_time_in_previous, requirements) VALUES
('blanche', 'gup', 10, '10ᵉ Gup', 6, 0, '{"techniques": [], "poomsae": []}'::jsonb),
('blanche', 'gup', 9, '9ᵉ Gup', 7, 3, '{"techniques": ["Position de base", "Blocage basique"], "poomsae": ["Taegeuk 1 Jang"]}'::jsonb),
('jaune', 'gup', 8, '8ᵉ Gup', 8, 4, '{"techniques": ["Coup de pied frontal", "Blocage moyen"], "poomsae": ["Taegeuk 2 Jang"]}'::jsonb),
('vert', 'gup', 6, '6ᵉ Gup', 10, 6, '{"techniques": ["Techniques intermédiaires"], "poomsae": ["Taegeuk 4 Jang"]}'::jsonb),
('bleu', 'gup', 4, '4ᵉ Gup', 12, 8, '{"techniques": ["Techniques avancées"], "poomsae": ["Taegeuk 6 Jang"]}'::jsonb),
('rouge', 'gup', 2, '2ᵉ Gup', 14, 10, '{"techniques": ["Techniques supérieures"], "poomsae": ["Taegeuk 8 Jang"]}'::jsonb),
('rouge-noire', 'gup', 1, '1ᵉʳ Gup', 15, 12, '{"techniques": ["Techniques maître"], "poomsae": ["Taegeuk 8 Jang"], "sparring": true, "theory": true, "breaking": true}'::jsonb),
('noire', 'dan', 1, '1ᵉʳ Dan', 16, 24, '{"techniques": ["Techniques expert"], "poomsae": ["Koryo"], "sparring": true, "theory": true, "breaking": true}'::jsonb),
('noire', 'dan', 2, '2ᵉ Dan', 18, 24, '{"techniques": ["Techniques maître"], "poomsae": ["Keumgang"], "sparring": true, "theory": true, "breaking": true}'::jsonb);

-- Insérer un organisateur par défaut
INSERT INTO organizers (name, email, organization, phone) VALUES
('Fédération Ivoirienne de Taekwondo', 'contact@fitkd.ci', 'FITKD', '+225 27 22 44 55 66');

-- ============================================
-- COMMENTAIRES
-- ============================================

COMMENT ON TABLE organizers IS 'Organisateurs de compétitions (fédérations, ligues, clubs)';
COMMENT ON TABLE competitions IS 'Compétitions de taekwondo';
COMMENT ON TABLE clubs IS 'Clubs de taekwondo';
COMMENT ON TABLE athletes IS 'Athlètes inscrits';
COMMENT ON TABLE referees IS 'Arbitres et officiels';
COMMENT ON TABLE sponsors IS 'Sponsors et partenaires';
COMMENT ON TABLE matches IS 'Matchs de Kyorugi';
COMMENT ON TABLE poomsae_performances IS 'Performances de Poomsae';
COMMENT ON TABLE breaking_performances IS 'Performances de Casse';
COMMENT ON TABLE grade_exams IS 'Examens de passage de grade';
COMMENT ON TABLE grade_certificates IS 'Certificats de grade délivrés';

-- ============================================
-- FIN DU SCHÉMA
-- ============================================
