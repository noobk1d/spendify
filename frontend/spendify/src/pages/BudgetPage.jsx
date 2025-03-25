import Sidebar from "./Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Profile/card";
import { BudgetPieChart } from "../components/budget/BudgetPieChart";
import { CategoryList } from "../components/budget/CategoryList";

export default function BudgetPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="mb-4 text-2xl sm:text-3xl font-bold">
            Budget Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 space-y-4">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-3">
                  <CardTitle>Budget Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px] flex items-center justify-center">
                    <BudgetPieChart />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="md:col-span-5 overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-4">
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CategoryList />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
