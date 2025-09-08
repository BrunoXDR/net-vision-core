import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, Filter } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  category?: string;
}

interface ChartCardProps {
  title: string;
  data: ChartData[];
  filterKey?: string;
  animationDelay?: string;
}

export default function ChartCard({ title, data, filterKey, animationDelay = "0s" }: ChartCardProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    data.map(item => item.name)
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = filterKey ? 
    [...new Set(data.map(item => item.category).filter(Boolean))] : [];

  const filteredData = data.filter(item => {
    const isSelected = selectedItems.includes(item.name);
    const categoryMatch = categoryFilter === "all" || item.category === categoryFilter;
    return isSelected && categoryMatch;
  });

  const handleItemToggle = (itemName: string) => {
    setSelectedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(data.map(item => item.name));
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  return (
    <Card className="cyber-glow animate-fade-in-up" style={{ animationDelay }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyber-glow">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
        
        <div className="flex flex-col gap-4 mt-4">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category!}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Item Selection Controls */}
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs px-2 py-1 rounded bg-cyber-glow/20 text-cyber-glow hover:bg-cyber-glow/30 transition-colors"
            >
              Selecionar Todos
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
            >
              Remover Todos
            </button>
          </div>

          {/* Item Checkboxes */}
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {data.map(item => (
              <div key={item.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`${title}-${item.name}`}
                  checked={selectedItems.includes(item.name)}
                  onCheckedChange={() => handleItemToggle(item.name)}
                />
                <label
                  htmlFor={`${title}-${item.name}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {item.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--grid-lines))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: 'hsl(var(--foreground))' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--cyber-glow))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Bar dataKey="value" fill="hsl(var(--cyber-glow))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}