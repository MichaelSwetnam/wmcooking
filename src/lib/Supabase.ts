import { createClient } from "@supabase/supabase-js";

const PROJECT_URL = "https://ysqrkscfqagmvjdglxcb.supabase.co";
const PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcXJrc2NmcWFnbXZqZGdseGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjM2ODUsImV4cCI6MjA3OTAzOTY4NX0.1BVCqXI-zNsdgOUKZfP53E8Z3AC0Z0vPLFjlqF4CJuo";

export const Supabase = createClient(PROJECT_URL, PUBLIC_API_KEY);
