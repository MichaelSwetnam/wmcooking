export const QueryKeys = {
     events: {
	 single: (id: number) => ["event", id] as const,
	 next: () => ["events", "next"] as const,
	 month: (month: number, year: number) => ["events", "cal", year, month ] as const,
     },
     allergens: {
	  event: (id: number) => ["event", id, "allergens"] as const,
	  map: () => ["allergens", "map"] as const,
	  labels: () => ["allergens", "labels"] as const,
     },
     images: {
	  self: () => ["databaseImages"] as const
     },
     signups: {
	  event: (eventId: number) => ["signups", "event", eventId],
	  single: (signupId: number) => ["signup", signupId]
     },
     profile: {
	  single: (id: string) => ["profile", id] as const
     }
};
