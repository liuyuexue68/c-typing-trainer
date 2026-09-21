import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { ProgressProvider } from "./context/ProgressContext";
import { CourseMapPage } from "./pages/CourseMapPage";
import { HomePage } from "./pages/HomePage";
import { PracticePage } from "./pages/PracticePage";
import { ResultPage } from "./pages/ResultPage";
import { StatsPage } from "./pages/StatsPage";
import { TrainerPage } from "./pages/TrainerPage";
import { WebMcpTools } from "./components/WebMcpTools";

export default function App() {
  return (
    <ProgressProvider>
      <WebMcpTools />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CourseMapPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="result" element={<ResultPage />} />
        </Route>
        <Route path="lesson/:lessonId" element={<TrainerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProgressProvider>
  );
}
