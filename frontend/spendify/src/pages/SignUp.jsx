import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ColorModeSelect from "../components/signin/ColorModeSelect";
import { GoogleIcon } from "../components/signin/CustomIcons";
import { Client, Account, OAuthProvider } from "appwrite";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "400px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67cb42410000c1e48f09");

const account = new Account(client);

export default function SignUp(props) {
  const navigate = useNavigate();
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    if (nameError || emailError || passwordError) {
      event.preventDefault();
      return;
    }
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      await account.create(
        "unique()",
        data.get("email"),
        data.get("password"),
        data.get("name")
      );
      await account.createEmailSession(data.get("email"), data.get("password"));
      navigate("/wallet-setup");
    } catch (error) {
      console.error("Error signing up:", error);
      setEmailError(true);
      setEmailErrorMessage("Email already exists or invalid");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/wallet-setup`,
        `${window.location.origin}/signup`
      );
    } catch (error) {
      console.error("Error with Google sign up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!name.value || name.value.length < 2) {
      setNameError(true);
      setNameErrorMessage("Please enter your name (at least 2 characters).");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <Card variant="outlined">
        <div className="flex flex-col items-start mb-4">
          <img
            src="/Spendify-removebg-preview.png"
            alt="Spendify Logo"
            className="h-12 w-auto mb-2"
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontSize: "clamp(1.75rem, 8vw, 2rem)",
              color: "#000000",
            }}>
            Sign up
          </Typography>
        </div>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 1.5,
          }}>
          <FormControl>
            <FormLabel htmlFor="name" sx={{ color: "#000000" }}>
              Name
            </FormLabel>
            <TextField
              error={nameError}
              helperText={nameErrorMessage}
              id="name"
              type="text"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={nameError ? "error" : "primary"}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                },
                "& .MuiInputLabel-root": {
                  color: "#000000",
                },
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email" sx={{ color: "#000000" }}>
              Email
            </FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                },
                "& .MuiInputLabel-root": {
                  color: "#000000",
                },
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password" sx={{ color: "#000000" }}>
              Password
            </FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                },
                "& .MuiInputLabel-root": {
                  color: "#000000",
                },
              }}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
            disabled={isLoading}
            sx={{
              backgroundColor: "#000000",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#333333",
              },
              height: "40px",
              textTransform: "none",
              fontSize: "0.9rem",
            }}>
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>
        </Box>
        <Divider sx={{ my: 2 }}>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            startIcon={<GoogleIcon />}
            sx={{
              borderColor: "#000000",
              color: "#000000",
              "&:hover": {
                borderColor: "#333333",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              height: "40px",
              textTransform: "none",
              fontSize: "0.9rem",
            }}>
            {isLoading ? "Connecting..." : "Sign up with Google"}
          </Button>

          <Typography sx={{ textAlign: "center", color: "#000000" }}>
            Already have an account?{" "}
            <Link
              href="/signin"
              variant="body2"
              sx={{
                alignSelf: "center",
                color: "#000000",
                "&:hover": {
                  color: "#333333",
                },
              }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignUpContainer>
  );
}
