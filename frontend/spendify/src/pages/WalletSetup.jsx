import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ColorModeSelect from "../components/signin/ColorModeSelect";
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

const WalletSetupContainer = styled(Stack)(({ theme }) => ({
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

export default function WalletSetup() {
  const navigate = useNavigate();
  const [cashAmountError, setCashAmountError] = React.useState(false);
  const [cashAmountErrorMessage, setCashAmountErrorMessage] =
    React.useState("");
  const [bankBalanceError, setBankBalanceError] = React.useState(false);
  const [bankBalanceErrorMessage, setBankBalanceErrorMessage] =
    React.useState("");

  const handleSubmit = async (event) => {
    if (cashAmountError || bankBalanceError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    const walletData = {
      cashAmount: data.get("cashAmount"),
      bankBalance: data.get("bankBalance"),
    };

    try {
      // Here you would typically make an API call to save the wallet details
      // For now, we'll just simulate a successful save
      console.log("Saving wallet data:", walletData);

      // Navigate to dashboard after successful save
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving wallet data:", error);
      // You might want to show an error message to the user here
    }
  };

  const validateInputs = () => {
    const cashAmount = document.getElementById("cashAmount");
    const bankBalance = document.getElementById("bankBalance");

    let isValid = true;

    if (
      !cashAmount.value ||
      isNaN(cashAmount.value) ||
      parseFloat(cashAmount.value) < 0
    ) {
      setCashAmountError(true);
      setCashAmountErrorMessage("Please enter a valid cash amount.");
      isValid = false;
    } else {
      setCashAmountError(false);
      setCashAmountErrorMessage("");
    }

    if (
      !bankBalance.value ||
      isNaN(bankBalance.value) ||
      parseFloat(bankBalance.value) < 0
    ) {
      setBankBalanceError(true);
      setBankBalanceErrorMessage("Please enter a valid bank balance.");
      isValid = false;
    } else {
      setBankBalanceError(false);
      setBankBalanceErrorMessage("");
    }

    return isValid;
  };

  return (
    <WalletSetupContainer direction="column" justifyContent="space-between">
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
            Set Up Your Wallet
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
            <FormLabel htmlFor="cashAmount" sx={{ color: "#000000" }}>
              Cash Amount
            </FormLabel>
            <TextField
              error={cashAmountError}
              helperText={cashAmountErrorMessage}
              id="cashAmount"
              type="number"
              name="cashAmount"
              placeholder="Enter your cash amount"
              autoComplete="off"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={cashAmountError ? "error" : "primary"}
              size="small"
              inputProps={{ min: "0", step: "0.01" }}
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
            <FormLabel htmlFor="bankBalance" sx={{ color: "#000000" }}>
              Bank Balance
            </FormLabel>
            <TextField
              error={bankBalanceError}
              helperText={bankBalanceErrorMessage}
              id="bankBalance"
              type="number"
              name="bankBalance"
              placeholder="Enter your bank balance"
              autoComplete="off"
              required
              fullWidth
              variant="outlined"
              color={bankBalanceError ? "error" : "primary"}
              size="small"
              inputProps={{ min: "0", step: "0.01" }}
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
            Set Up Wallet
          </Button>
        </Box>
      </Card>
    </WalletSetupContainer>
  );
}
