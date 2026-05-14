"use client"

import { useState } from "react";
import HeaderInfo from "../components/organism/HeaderInfo";
import BarGraphs from "./components/molecules/BarGraphs";
import ContributionGraph from "./components/molecules/ContributionGraph";
import ProgressForHabit from "./components/molecules/ProgressForHabit";
import TopHabitsList from "./components/molecules/TopHabitsList";
import DateFilter from "./components/organism/DateFilter";
import StatsOverview from "./components/organism/StatsOverview";

export default function StatsPage() {
    const [dateRange, setDateRange] = useState("week");

    return (
        <>
            <HeaderInfo title="Stats" subTitle="Track your progress over time">
                <DateFilter changeDate={setDateRange} dateRange={dateRange} />
            </HeaderInfo>
            <StatsOverview dateRange={dateRange} />
            <div className="grid grid-cols-[1fr_260px] gap-3.5 flex-1 min-h-0">
                <div className="flex flex-col gap-3.5 min-h-0">
                    <BarGraphs dateRange={dateRange} />
                    <ProgressForHabit dateRange={dateRange} />
                </div>
                <div className="flex flex-col gap-3.5 min-h-0">
                    <ContributionGraph dateRange={dateRange} />
                    <TopHabitsList dateRange={dateRange} />
                </div>
            </div>
        </>
    );
}
