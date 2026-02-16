// Setup type definitions for built-in Supabase Runtime APIs
import "edge-runtime";
import { createClient, PostgrestError, SupabaseClient } from "supabase";

type EventRecord = {
	accessability: "AllStudents" | "ClubMembers";
    description: string;
    id: number;
    location: string;
    name: string;
    background_image: string;
    requires_signup: boolean;
    capacity: number;
	start_timestamp: string,
	end_timestamp: string
};

type SignupRecord = {
    id: number,
    event_id: string,
    user_id: string,
    user_name: string
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "PUT, DELETE, OPTIONS",
};

function json(body: unknown, status = 200): Response { 
	return new Response(
		JSON.stringify(body), 
		{ status, headers: { "Content-Type": "application/json", ...corsHeaders }, 
	}); 
}

function handleError(err: unknown): Response {
	let message: string;

	// I am unsure of whether PostgrestError is a child of Error, it probably is.
	if (err instanceof PostgrestError) {
		message = (err as PostgrestError).message;
	} if (err instanceof Error) {
		message = err.message;	
	}else {
		message = "Unknown error occured.";
	}
	
	console.error(`Signup request failed: ${message}`);

	return new Response(JSON.stringify({ message }), {
		headers: { 'Content-Type': 'application/json', ...corsHeaders },
		status: 400 
	});
}

async function putSignup(sb: SupabaseClient, userId: string, event: EventRecord, signup: SignupRecord | null): Promise<Response> {
	try {
		throw new Error("Feature Disabled.");
		
		// Make sure they are not already signed up
		if (signup)
			throw new Error("You are already signed up for this event.");

		// Make sure the event window is still open (certain amount of time before the event).
		const now = new Date();
		const eventStart = new Date(event.start_timestamp);

		console.log(`now: ${now}`);
		console.log(`event_start: ${eventStart}`);

		if (eventStart.getTime() <= now.getTime())
			throw new Error("You cannot sign up for an event that has already started.");
	
		const diffMs = eventStart.getTime() - now.getTime();
		const twoHoursMs = 2 * 60 * 60 * 1000;

		if (diffMs < twoHoursMs) {
			throw new Error("Signup closes two hours before the start of an event.");
		}

		// Check event capacity
		const capacityResult = await sb
			.from("EventSignup")
			.select("id")
			.eq('event_id', event.id);

		if (capacityResult.error || capacityResult.data === null)
			return json({ message: "Could not determine whether capacity exists in the selected event."}, 500);

		const signupCount = capacityResult.data.length
		if (signupCount >= event.capacity)
			throw new Error("There are no available slots for this event.");

		// Sign up user for event.
		const { data, error } = await sb
			.from("EventSignup")
			.insert({ user_id: userId, event_id: event.id })
			.select("*")
			.single();
			

		if (error || !data)
			throw new Error("Could not add your signup.");

		return json({ payload: data });
	} catch (e) {
		return handleError(e);
	}
}

async function deleteSignup(sb: SupabaseClient, userId: string, signup: SignupRecord | null): Promise<Response> {
	try {
		if (!signup)
			throw new Error("You are not signed up for this event, so cannot remove your signup.");
		
		if (!userId) 
			throw new Error("Cannot remove your signup, since you are not signed in.");

		// Delete signup for user.
		const { data, error } = await sb
			.from("EventSignup")
			.delete()
			.eq('id', signup.id)
			.select()
			.single();
		
		if (!data || error)
			throw new Error("Could not remove your signup.");

		return json({ payload: data });	
	} catch (e) {
		return handleError(e);
	}
}


Deno.serve(async (req) => {
	// Handle CORS preflight 
	if (req.method === "OPTIONS")
		return new Response("ok", { headers: corsHeaders });
	
	// Edge function logic
	try {
		const body = req.json() as Promise<{ eventId: string }>; // I'm starting this call early to ensure the await is finished by the time I use it later.

		// Require authorization headers.
		const authHeader = req.headers.get("Authorization");
		if (!authHeader) {
			return json({ error: "Missing Authorization header" }, 401);
		}

		// Attempt to create supabase client.
		const Supabase = createClient(
			// Supabase API URL - env var exported by default.
			Deno.env.get('SUPABASE_URL') ?? '',
			// Supabase API ANON KEY - env var exported by default.
			Deno.env.get('SUPABASE_ANON_KEY') ?? '',
			// Create client with Auth context of the user that called the function.
      		// This way your row-level-security (RLS) policies are applied.
			{ global: { headers: { Authorization: req.headers.get('Authorization')! } } }
		);

		// Ensure only PUT requests are allowed. Hopefully the CORS header enforces this, but I am unsure about it.
		if (req.method !== "PUT" && req.method !== "DELETE") {
			throw new Error("This function only accepts PUT requests.");
		} 

		// Get user
		const { data: { user }, error: userError, } = await Supabase.auth.getUser();
		if (userError || !user)
			return json({ error: "Invalid or expired token" }, 401);
		const userId = user.id;

		// Get event
		const eventId = (await body).eventId;
		if (!eventId)
			return json({ error: "Invalid request format. Expected eventId in body"}, 400);

		const event: Promise<EventRecord> = (async () => {
			const { data, error } = await Supabase
				.from("Events")
				.select("*")
				.eq('id', eventId)
				.single();
		
			if (error)
				throw error;
			if (!data)
				throw new Error("Could not find an event with id " + eventId);

			return data as EventRecord;
		})();

		const signup: Promise<SignupRecord | null> = (async () => {
			const { data, error } = await Supabase
				.from("EventSignup")
				.select("*")
				.eq('event_id', eventId)
				.eq('user_id', userId)
				.maybeSingle()
			
			if (error) throw new Error("Could not query database.");
			return data as SignupRecord | null;
		})();
		
		switch (req.method) {
			case "PUT":
				return putSignup(Supabase, userId, await event, await signup);

			case "DELETE":
				return deleteSignup(Supabase, userId, await signup);

			default:
				throw new Error("This function only accepts PUT or DELETE requests.");
		}
	} catch (err) {
		return handleError(err);
	}
});