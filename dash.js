import React, { useState } from "react";

const sampleData = [
  {
    topic: "India-UK Free Trade Agreement (FTA)",
    notes:
      "The trade deal, once implemented, may make imports from the UK more affordable and improve access to auto and medical equipment...",
    company: "Bajaj Auto",
    sector: "Pharmaceuticals",
    analyst: "Person 1",
    date: "2025-05-25",
  },
  {
    topic: "JSW Infrastructure Expansion",
    notes: "JSW plans to invest in three new ports with a projected capacity of 200 MTPA by 2030.",
    company: "JSW Infrastructure",
    sector: "Logistics",
    analyst: "Person 2",
    date: "2025-05-25",
  },
  {
    topic: "Maruti Suzuki EV Plans",
    notes: "Maruti is set to launch its first EV model in 2026 targeting urban markets initially.",
    company: "Maruti Suzuki",
    sector: "Automobile",
    analyst: "Person 1",
    date: "2025-05-24",
  },
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
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>Daily Research Summary</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by company, sector, or keyword"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: "1 1 300px", padding: 8, fontSize: 16 }}
        />

        <select
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value)}
          style={{ padding: 8, fontSize: 16 }}
        >
          <option value="all">All Analysts</option>
          <option value="person1">Person 1</option>
          <option value="person2">Person 2</option>
        </select>

        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: 8, fontSize: 16 }}
        >
          <option value="all">All Dates</option>
          {uniqueDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>

        <button onClick={exportToJson} style={{ padding: "8px 12px", fontSize: 16 }}>
          Export Summary
        </button>
      </div>

      <div style={{ marginBottom: 20, textAlign: "right" }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer", fontSize: 16 }}
        >
          {expanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {Object.entries(groupedBySector).map(([sector, items]) => (
        <div key={sector} style={{ marginBottom: 30 }}>
          <h2 style={{ fontSize: 22, fontWeight: "600", borderBottom: "1px solid #ccc", paddingBottom: 6 }}>
            {sector}
          </h2>
          {expanded && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 16,
                marginTop: 12,
              }}
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 150,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>
                    Sector: {item.sector || "N/A"} | Date: {item.date}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>{item.topic}</h3>
                  <p style={{ fontSize: 14, flexGrow: 1 }}>{item.notes}</p>
                  <div style={{ fontSize: 11, textAlign: "right", color: "#888", marginTop: 12 }}>
                    Source: {item.analyst}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
