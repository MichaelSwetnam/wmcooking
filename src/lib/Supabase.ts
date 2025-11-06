import { createClient } from "@supabase/supabase-js";

const PROJECT_URL = "https://okoywtixurlcfnkraeob.supabase.co";
const PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rb3l3dGl4dXJsY2Zua3JhZW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDExNjcsImV4cCI6MjA3Nzc3NzE2N30.Vtyh85w1_WYOjLeGbXNo35JwEMOG7E0Bo1tdFFr4vYw";

export const Supabase = createClient(PROJECT_URL, PUBLIC_API_KEY);
