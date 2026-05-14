import HeaderInfo from "../components/organism/HeaderInfo";
import DateFilter from "./components/organism/DateFilter";
import StatsOverview from "./components/organism/StatsOverview";

export default function stats() {
    return (
        <>
            <div>Hello</div>
            <HeaderInfo title="Habits" subTitle="Manage and organize your habits">
                <DateFilter />
            </HeaderInfo>
            <StatsOverview />
            <div></div>
            <div></div>
        </>
    )
}