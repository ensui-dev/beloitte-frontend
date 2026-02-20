/**
 * OAuth callback handler — receives the JWT from the backend.
 *
 * Flow:
 *   1. Backend completes Discord OAuth2 exchange
 *   2. Backend redirects here: /auth/callback?token={jwt}
 *   3. We extract the token, pass it to AuthProvider
 *   4. AuthProvider validates it via GET /auth/me
 *   5. On success → redirect to dashboard
 *   6. On failure → redirect to login with error
 *
 * This page is transient — the user should only see it for a brief moment.
 */
import { useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router";
import { useAuth } from "@/components/providers/auth-provider";
import { usePageTitle } from "@/hooks/use-page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CallbackState = "processing" | "success" | "error";

export function AuthCallbackPage(): React.ReactElement {
  usePageTitle("Signing In");

  const [searchParams] = useSearchParams();
  const { handleLoginToken } = useAuth();
  const [callbackState, setCallbackState] = useState<CallbackState>("processing");
  const [errorMessage, setErrorMessage] = useState("");
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double-processing in StrictMode
    if (processedRef.current) return;
    processedRef.current = true;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      setErrorMessage(error);
      setCallbackState("error");
      return;
    }

    if (!token) {
      setErrorMessage("No authentication token received. Please try logging in again.");
      setCallbackState("error");
      return;
    }

    handleLoginToken(token)
      .then(() => {
        setCallbackState("success");
      })
      .catch(() => {
        setErrorMessage("Failed to validate your session. Please try logging in again.");
        setCallbackState("error");
      });
  }, [searchParams, handleLoginToken]);

  if (callbackState === "success") {
    return <Navigate to="/dashboard" replace />;
  }

  if (callbackState === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">Authentication Failed</CardTitle>
            <CardDescription>Something went wrong during sign-in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <a
              href="/login"
              className="block text-center text-sm text-primary underline-offset-4 hover:underline"
            >
              Back to login
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Processing state — brief loading spinner
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm border-border/50">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Completing sign-in...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
