# Load environment files
if [[ -f .env ]]; then
    # Filter comments and blank lines, then export key=value pairs
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip blank lines and comments
        [[ "$line" =~ ^[[:space:]]*$ || "$line" =~ ^[[:space:]]*# ]] && continue

        # Export variables from key=value lines
        if [[ "$line" == *"="* ]]; then
            key="${line%%=*}"
            value="${line#*=}"

            # Trim whitespace around the key
            key="$(echo "$key" | xargs)"

            export "$key=$value"
        fi
    done < .env

    echo "Successfully loaded environment variables from .env file."
else
    echo "Warning: .env file not found." >&2
fi

npx supabase gen types typescript \
    --project-id "$SUPABASE_PROJ_ID" \
    > src/lib/database/gen-types.ts

echo "Reloaded database.types.ts"
