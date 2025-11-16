import { GoogleIcon } from "@/src/shared/components/icons";
import { Button } from "@heroui/button";
import { authText } from "../../auth.text";

export default function SignInWithGoogle() {
  return (
    <Button
      variant="ghost"
      className="w-full"
      onClick={() => {
        // createClient().auth.signInWithOAuth({
        //   provider: "google",
        //   options: {
        //     redirectTo: `${window.location.origin}/auth/callback`,
        //   },
        // });
      }}
    >
      <GoogleIcon />
      {authText.signInWithGoogle}
    </Button>
  );
}
