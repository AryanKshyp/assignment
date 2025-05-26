import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const sampleData = [
  {
    topic: "India-UK Free Trade Agreement (FTA)",
    notes: "The trade deal, once implemented, may make imports from the UK more affordable and improve access to auto and medical equipment...",
    company: "Bajaj Auto",
    sector: "Pharmaceuticals",
    analyst: "Person 1",
    date: "2025-05-25"
  },
  {
    topic: "JSW Infrastructure Expansion",
    notes: "JSW plans to invest in three new ports with a projected capacity of 200 MTPA by 2030.",
    company: "JSW Infrastructure",
    sector: "Logistics",
    analyst: "Person 2",
    date: "2025-05-25"
  },
  {
    topic: "Maruti Suzuki EV Plans",
    notes: "Maruti is set to launch its first EV model in 2026 targeting urban markets initially.",
    company: "Maruti Suzuki",
    sector: "Automobile",
    analyst: "Person 1",
    date: "2025-05-24"
  }
];

export default function ResearchDashboard() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [expanded, setExpanded] = useState(true);

  const uniqueDates = [...new Set(sampleData.map((item) => item.date))];

  const filteredData = sampleData.filter((item) => {
    const normalizedAnalyst = item.analyst.toLowerCase().replace(" ", "");
    const matchesTab = selectedTab === "all" || normalizedAnalyst === selectedTab;
    const matchesSearch =
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.sector && item.sector.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDate = selectedDate === "all" || item.date === selectedDate;
    return matchesTab && matchesSearch && matchesDate;
  });

  const exportToJson = () => {
    const dataStr = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "research-summary.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const groupedBySector = filteredData.reduce((groups, item) => {
    const sector = item.sector || "Other";
    if (!groups[sector]) groups[sector] = [];
    groups[sector].push(item);
    return groups;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Daily Research Summary</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Input
          placeholder="Search by company, sector, or keyword"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="person1">Person 1</TabsTrigger>
            <TabsTrigger value="person2">Person 2</TabsTrigger>
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {selectedDate === "all" ? "All Dates" : selectedDate}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedDate("all")}>All Dates</DropdownMenuItem>
            {uniqueDates.map((date, index) => (
              <DropdownMenuItem key={index} onClick={() => setSelectedDate(date)}>
                {date}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={exportToJson} className="w-full">Export Summary</Button>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Collapse All" : "Expand All"}
        </Button>
      </div>

      {Object.entries(groupedBySector).map(([sector, items]) => (
        <div key={sector} className="space-y-4">
          <h2 className="text-2xl font-semibold mt-6">{sector}</h2>
          {expanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <Card key={index} className="rounded-2xl shadow-md">
                  <CardContent className="p-4 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Sector: {item.sector || "N/A"} | Date: {item.date}
                    </div>
                    <h3 className="text-xl font-semibold">{item.topic}</h3>
                    <p className="text-sm">{item.notes}</p>
                    <div className="text-xs text-right text-muted-foreground">
                      Source: {item.analyst}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
