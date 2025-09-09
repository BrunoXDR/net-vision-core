import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  value: number;
  category?: string;
}

interface ChartCardProps {
  title: string;
  data: any[];
  categoryKey?: string;
  animationDelay?: string;
}

export default function ChartCard({ title, data, categoryKey, animationDelay = "0s" }: ChartCardProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Determine the value key and name key from the data structure
  const getDataKeys = () => {
    if (data.length === 0) return { nameKey: '', valueKey: '' };
    
    const firstItem = data[0];
    const keys = Object.keys(firstItem);
    
    // Find value key (usually 'Count' or numeric field)
    const valueKey = keys.find(key => typeof firstItem[key] === 'number') || keys[keys.length - 1];
    
    // Find name key (usually not the category key and not the value key)
    const nameKey = keys.find(key => key !== categoryKey && key !== valueKey) || keys[0];
    
    return { nameKey, valueKey };
  };

  const { nameKey, valueKey } = getDataKeys();

  // Get unique categories if categoryKey is provided
  const categories = categoryKey 
    ? Array.from(new Set(data.map(item => item[categoryKey])))
    : [];

  // Filter data based on category selection
  const categoryFilteredData = selectedCategory === "all" 
    ? data 
    : data.filter(item => item[categoryKey] === selectedCategory);

  // Further filter by selected items (if any are selected, show only those)
  const filteredData = selectedItems.size > 0 
    ? categoryFilteredData.filter(item => selectedItems.has(item[nameKey]))
    : categoryFilteredData;

  const handleItemToggle = (itemName: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === categoryFilteredData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(categoryFilteredData.map(item => item[nameKey])));
    }
  };

  return (
    <div className="w-full">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pb-4">
          <div className="flex flex-col gap-4">
            {/* Category Filter */}
            {categoryKey && categories.length > 0 && (
              <div className="flex items-center gap-2">
                <Label htmlFor="category-filter" className="text-sm font-medium">
                  Filter by {categoryKey}:
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]" id="category-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {categoryKey}s</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Item Selection Controls */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {selectedItems.size === categoryFilteredData.length ? "Deselect All" : "Select All"}
              </Button>
              {selectedItems.size > 0 && (
                <span className="text-xs text-muted-foreground">
                  {selectedItems.size} of {categoryFilteredData.length} items selected
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="flex gap-6">
            {/* Chart */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData}>
                  <XAxis 
                    dataKey={nameKey} 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar 
                    dataKey={valueKey} 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Item Selection Panel */}
            <div className="w-48 max-h-[400px] overflow-y-auto border-l pl-4">
              <h4 className="text-sm font-medium mb-2">Items</h4>
              <div className="space-y-2">
                {categoryFilteredData.map((item, index) => (
                  <div key={`${item[nameKey]}-${index}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${item[nameKey]}-${index}`}
                      checked={selectedItems.size === 0 || selectedItems.has(item[nameKey])}
                      onCheckedChange={() => handleItemToggle(item[nameKey])}
                    />
                    <Label
                      htmlFor={`${item[nameKey]}-${index}`}
                      className="text-xs cursor-pointer truncate"
                      title={item[nameKey]}
                    >
                      {item[nameKey]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}