import ProgressBadge from "../components/molecules/ProgressBadge";
import HeaderInfo from "../components/organism/HeaderInfo";
import HabitOrganism from "./components/organism/HabitOrganism";
import HabitsOverview from "./components/organism/HabitsOverview";

export default function HabitPage() {
    return (<>
        <HeaderInfo title="Habits" subTitle="Manage and organize your habits">
            <ProgressBadge completed={6} total={6} />
        </HeaderInfo>
        <HabitsOverview />
        <HabitOrganism />
    </>
    )
}