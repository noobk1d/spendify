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
import { useNavigate } from "react-router-dom";
import { account } from "../lib/appwrite";
import { OAuthProvider } from "appwrite";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(1.5),
  gap: theme.spacing(1),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "350px",
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

export default function SignUp(props) {
  const navigate = useNavigate();
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);

    try {
      console.log("Attempting signup with:", {
        name: data.get("name"),
        email: data.get("email"),
        password: data.get("password"),
      });

      const response = await fetch(
        "http://127.0.0.1:3000/spendify/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify({
            name: data.get("name"),
            email: data.get("email"),
            password: data.get("password"),
            confirmPassword: data.get("confirmPassword"),
          }),
        }
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Signup failed");
      }

      const result = await response.json();
      console.log("Signup successful, response:", result);

      if (result.data && result.data.token) {
        localStorage.setItem("jwt", result.data.token);

        // Fetch profile data after successful signup
        const profileResponse = await fetch(
          "http://127.0.0.1:3000/spendify/api/profile/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.data.token}`,
              Accept: "application/json",
            },
            mode: "cors",
            credentials: "include",
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const profileData = await profileResponse.json();
        if (profileData.status === "success") {
          localStorage.setItem("userProfile", JSON.stringify(profileData.data));
        }

        navigate("/wallet");
      } else {
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      setEmailError(true);
      setEmailErrorMessage(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/wallet`,
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
    const confirmPassword = document.getElementById("confirmPassword");

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

    if (!confirmPassword.value || confirmPassword.value !== password.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <Card variant="outlined">
        <div className="flex flex-col items-start mb-2">
          <img
            src="/Spendify-removebg-preview.png"
            alt="Spendify Logo"
            className="h-10 w-auto mb-1"
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontSize: "clamp(1.5rem, 8vw, 1.75rem)",
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
            gap: 0.75,
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
              autoComplete="off"
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
            <FormLabel
              htmlFor="password"
              sx={{ color: "#000000", fontSize: "0.875rem" }}>
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
                  height: "36px",
                },
                "& .MuiInputLabel-root": {
                  color: "#000000",
                },
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel
              htmlFor="confirmPassword"
              sx={{ color: "#000000", fontSize: "0.875rem" }}>
              Confirm Password
            </FormLabel>
            <TextField
              error={confirmPasswordError}
              helperText={confirmPasswordErrorMessage}
              name="confirmPassword"
              placeholder="••••••"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              color={confirmPasswordError ? "error" : "primary"}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "36px",
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
              height: "36px",
              textTransform: "none",
              fontSize: "0.9rem",
              mt: 0.5,
            }}>
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>
        </Box>
        <Divider sx={{ my: 1 }}>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
              height: "36px",
              textTransform: "none",
              fontSize: "0.9rem",
            }}>
            {isLoading ? "Connecting..." : "Sign up with Google"}
          </Button>

          <Typography
            sx={{ textAlign: "center", color: "#000000", fontSize: "0.8rem" }}>
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
                fontSize: "0.8rem",
              }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignUpContainer>
  );
}
