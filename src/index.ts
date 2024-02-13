import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

interface Player {
  name: string;
  team: string;
  usg_pct: number;
  ts_pct: number;
  playoff_mp: number;
  playoff_usg_pct: number;
  playoff_ts_pct: number;
  playoff_mpg: number;
}

interface Case {
  state: string;
  year: string;
  bot_type: string;
  toxin_type: string;
  count: string;
  region: string;
}

interface Pop {
  name: string;
  geography: string;
  year: string;
  population: string;
  percent_change: string;
  resident_pop: string;
  reps: string;
  rep_change: string;
  apportionment: string
}

async function main(): Promise<void> {
  // const res = await fetch("data/players_2023.json");
  // const data = (await res.json()) as Array<Player>;
  const data: Array<Case> = await d3.csv("data/Botulism_20240122.csv");
  const pop_data: Array<Pop> = await d3.csv("data/population.csv");
  const mod_data: Array<Pop> = await d3.csv("data/mod_data.csv");

  const barchart = Plot.plot({
    title: "National Botulism Rates (1899-2017)",
    caption: "Figure 1: The graph depicts the total number of botulism cases per year between 1899-2017. This is based on historical data from the CDC and is an aggregate of all states.",
    inset: 8,
    grid: true,
    color: {
      legend: true,
      label: "Number of Cases",
      // type: "categorical",
      scheme: "OrRd"
    },
    x: {
      ticks: ["1910", "1920", "1930", "1940", "1950", "1960", "1970", "1980", "1990", "2000", "2010"],
      tickFormat: "",
      // domain: [1900,1910,1920,1930,1940,1950,1960,1970,1980,1990, 2000]
    },
    y: {
      label: "Number of Cases"
    },
    marks: [
      // Plot.barY(data, {x: "Year", y: "Count", fill: "Count"})
      Plot.barY(data, Plot.groupX({y: "count", fill: "count"}, {x: "Year", tip: true})),
      //Plot.line(pop_data_US, {x: "Year", y: "Population"}),
      Plot.ruleY([0])
    ]
  })

  document.querySelector("#plot")?.append(barchart);

  const region_chart = Plot.plot({
    title: "Regional Botulism Cases (2010)",
    caption: "Figure 2: The regional chart above depicts the total number of botulism cases for each region per capita. Each bar is segmented into the categories of botulism.",
    inset: 8,
    grid: true,
    color: {
      legend: true,
      type: "categorical",
      scheme: "Viridis"
    },
    y: {
      label: "Total Cases Per Capita"
    },
    marks: [
      Plot.barY(mod_data,
                Plot.groupX({y: "count"},
                            {x: "Region", fill: "BotType", sort: {x: "-y"}, tip: true})),
      Plot.ruleY([0])
    ]
  });

  document.querySelector("#plot2")?.append(region_chart);

}

window.addEventListener("DOMContentLoaded", async (_evt) => {
  await main();
});

