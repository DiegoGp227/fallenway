import { useState } from "react";
import { mutate } from "swr";
import { ContributionsUrl, StatsTodayURL } from "@/src/shared/constants/urls";
import { HABITS_TODAY_KEY } from "./useTodayHabits";
import { HabitLog, LogHabitData, deleteHabitLog as deleteHabitLogService, logHabit as logHabitService } from "../services/habits.services";

interface LogHabitState {
  log: HabitLog | null;
  loading: boolean;
  error: string | null;
}

export default function useLogHabit() {
  const [state, setState] = useState<LogHabitState>({
    log: null,
    loading: false,
    error: null,
  });

  const handleLogHabit = async (
    habitId: string,
    data: LogHabitData,
  ): Promise<boolean> => {
    setState({ log: null, loading: true, error: null });
    try {
      const { log } = await logHabitService(habitId, data);
      setState({ log, loading: false, error: null });
      await Promise.all([
        mutate(ContributionsUrl.toString()),
        mutate(StatsTodayURL.toString()),
        mutate(HABITS_TODAY_KEY),
      ]);
      return true;
    } catch {
      setState({ log: null, loading: false, error: "Error logging habit" });
      return false;
    }
  };

  const handleDeleteLog = async (habitId: string): Promise<boolean> => {
    setState({ log: null, loading: true, error: null });
    try {
      await deleteHabitLogService(habitId);
      setState({ log: null, loading: false, error: null });
      await Promise.all([
        mutate(ContributionsUrl.toString()),
        mutate(StatsTodayURL.toString()),
        mutate(HABITS_TODAY_KEY),
      ]);
      return true;
    } catch {
      setState({ log: null, loading: false, error: "Error removing log" });
      return false;
    }
  };

  return { ...state, handleLogHabit, handleDeleteLog };
}
