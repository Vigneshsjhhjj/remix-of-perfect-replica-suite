import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { operationsFeatures } from "@/data/mockData";
import { Cpu, Smartphone, Satellite, BarChart3, ShieldCheck } from "lucide-react";

const icons = [Smartphone, Satellite, BarChart3, ShieldCheck];

const OperationsPanel = () => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Cpu className="h-5 w-5 text-blue-600" />
          Operations Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {operationsFeatures.map((feature, i) => {
          const Icon = icons[i];
          return (
            <div key={feature.title} className="flex gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default OperationsPanel;
