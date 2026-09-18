import { QueryClient } from "@tanstack/react-query";

export default new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 10 * 60 * 1000 // 10 Minutes
        }
    }
});
