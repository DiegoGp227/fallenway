import { useState } from "react";
import { mutate } from "swr";
import { ContributionsUrl } from "@/src/shared/constants/urls";
import { HabitLog, LogHabitData, logHabit as logHabitService } from "../services/habits.services";

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
      await mutate(ContributionsUrl.toString());
      return true;
    } catch {
      setState({ log: null, loading: false, error: "Error logging habit" });
      return false;
    }
  };

  return { ...state, handleLogHabit };
}
