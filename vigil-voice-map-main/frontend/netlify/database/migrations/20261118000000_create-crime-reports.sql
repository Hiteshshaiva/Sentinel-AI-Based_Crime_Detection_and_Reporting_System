CREATE TABLE IF NOT EXISTS crime_reports (
  id SERIAL PRIMARY KEY,
  crime_type TEXT NOT NULL DEFAULT 'other',
  location TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS crime_reports_timestamp_idx ON crime_reports (timestamp DESC);
