"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Profile/card";
import { Button } from "../ui/Profile/button";
import { Input } from "../ui/Profile/input";
import { Label } from "../ui/Profile/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Profile/select";
import { ArrowRightLeft, Calculator, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Profile/tabs";

// Exchange rates (in a real app, these would come from an API)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 149.5,
  CAD: 1.35,
  AUD: 1.52,
  CNY: 7.2,
  INR: 83.12,
};

function ToolsSection() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);

  const handleConvert = () => {
    if (amount && fromCurrency && toCurrency) {
      // Convert to USD first (if not already USD)
      const amountInUSD =
        fromCurrency === "USD" ? amount : amount / EXCHANGE_RATES[fromCurrency];

      // Then convert from USD to target currency
      const result =
        toCurrency === "USD"
          ? amountInUSD
          : amountInUSD * EXCHANGE_RATES[toCurrency];

      setConvertedAmount(result);

      // Add to history
      setConversionHistory([
        {
          from: fromCurrency,
          to: toCurrency,
          amount,
          result,
          date: new Date(),
        },
        ...conversionHistory.slice(0, 4), // Keep only the last 5 conversions
      ]);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Financial Tools</CardTitle>
        <CardDescription>Helpful tools for your finances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount || ""}
                  onChange={(e) => {
                    setAmount(Number.parseFloat(e.target.value) || 0);
                    setConvertedAmount(null);
                  }}
                  min="0"
                  step="0.01"
                  className="text-lg"
                />
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                <div className="space-y-2">
                  <Label htmlFor="from-currency">From</Label>
                  <Select
                    value={fromCurrency}
                    onValueChange={(value) => {
                      setFromCurrency(value);
                      setConvertedAmount(null);
                    }}>
                    <SelectTrigger id="from-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(EXCHANGE_RATES).map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwapCurrencies}
                  className="mb-0.5">
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="to-currency">To</Label>
                  <Select
                    value={toCurrency}
                    onValueChange={(value) => {
                      setToCurrency(value);
                      setConvertedAmount(null);
                    }}>
                    <SelectTrigger id="to-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(EXCHANGE_RATES).map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleConvert} className="w-full">
                Convert
              </Button>

              {convertedAmount !== null && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Result:</p>
                  <p className="text-2xl font-semibold">
                    {amount.toFixed(2)} {fromCurrency} ={" "}
                    {convertedAmount.toFixed(2)} {toCurrency}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Exchange rate: 1 {fromCurrency} ={" "}
                    {(
                      EXCHANGE_RATES[toCurrency] / EXCHANGE_RATES[fromCurrency]
                    ).toFixed(4)}{" "}
                    {toCurrency}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Recent Conversions</h3>
                {conversionHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConversionHistory([])}
                    className="h-8 px-2 text-xs">
                    Clear History
                  </Button>
                )}
              </div>

              {conversionHistory.length > 0 ? (
                <div className="space-y-2">
                  {conversionHistory.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {item.amount.toFixed(2)} {item.from} →{" "}
                          {item.result.toFixed(2)} {item.to}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.date.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setAmount(item.amount);
                          setFromCurrency(item.from);
                          setToCurrency(item.to);
                          setConvertedAmount(item.result);
                        }}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground">No recent conversions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ToolsSection;
