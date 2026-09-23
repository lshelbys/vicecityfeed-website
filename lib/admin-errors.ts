type MaybeError = {
  message?: string;
  code?: string;
  status?: number;
  hint?: string;
};

function parts(err: unknown): MaybeError {
  if (err && typeof err === "object") return err as MaybeError;
  if (err instanceof Error) return { message: err.message };
  return { message: String(err) };
}

export function describeAdminError(err: unknown): string {
  const { message = "", code = "", status } = parts(err);
  const text = `${code} ${message}`.toLowerCase();

  if (
    text.includes("jwt") ||
    text.includes("not authenticated") ||
    text.includes("invalid claim") ||
    code === "PGRST301" ||
    status === 401
  ) {
    return "You are not signed in.";
  }
  if (
    text.includes("invalid login") ||
    text.includes("invalid credentials") ||
    text.includes("invalid email or password")
  ) {
    return "Email or password is wrong.";
  }
  if (
    text.includes("row-level security") ||
    text.includes("permission denied") ||
    code === "42501" ||
    status === 403
  ) {
    return "You do not have permission to write. Sign in as the desk editor.";
  }
  if (
    text.includes("does not exist") ||
    text.includes("schema cache") ||
    text.includes("could not find the table") ||
    code === "42P01" ||
    code === "PGRST205"
  ) {
    return "The articles table is missing. Run supabase/schema.sql in the SQL editor.";
  }
  if (
    text.includes("bucket") ||
    text.includes("covers") ||
    text.includes("storage") ||
    text.includes("payload too large")
  ) {
    return "Image upload failed. Check the covers bucket, or try a smaller image.";
  }
  if (text.includes("duplicate") || code === "23505") {
    return "A story with this slug already exists.";
  }
  if (text.includes("failed to fetch") || text.includes("network")) {
    return "Could not reach the desk. Check your connection.";
  }
  if (message && !/pgrst|postgrest|json object|hint:/i.test(message) && message.length < 140) {
    return message;
  }
  return "Save failed. Check the desk schema and try again.";
}
