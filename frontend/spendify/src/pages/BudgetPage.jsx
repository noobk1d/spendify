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
    <div className="flex flex-col sm:flex-row min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="mb-4 text-xl sm:text-2xl md:text-3xl font-bold">
            Budget Dashboard
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-lg sm:text-xl">
                    Budget Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[250px] sm:h-[300px] md:h-[350px] flex items-center justify-center">
                    <BudgetPieChart />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="lg:col-span-5 overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-lg sm:text-xl">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <CategoryList />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
