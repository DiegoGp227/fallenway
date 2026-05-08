import ProgressBadge from "../components/molecules/ProgressBadge";
import HeaderInfo from "../components/organism/HeaderInfo";
import TodayOverview from "../components/organism/TodayOverview";
import HabitOrganism from "./components/organism/HabitOrganism";

export default function HabitPage() {
    return (<>
        <HeaderInfo title="Habits" subTitle="Manage and organize your habits">
            <ProgressBadge completed={6} total={6} />
        </HeaderInfo>
        <TodayOverview />
        <HabitOrganism />
    </>
    )
}