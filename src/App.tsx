import { useMemo, useState } from "react";
import GlowBackground from "./components/GlowBackground";
import LessonSelect from "./quiz/LessonSelect";
import QuizPage from "./quiz/QuizPage";
import { LESSONS, getLesson } from "./quiz/lessons";

export default function App() {
  const [lessonId, setLessonId] = useState<string | null>(null);
  const lesson = useMemo(() => (lessonId ? getLesson(lessonId) : null), [lessonId]);

  return (
    <div className="interactive-page relative">
      <GlowBackground />
      {lesson ? (
        <QuizPage lesson={lesson} onBack={() => setLessonId(null)} />
      ) : (
        <LessonSelect lessons={LESSONS} onPick={(id) => setLessonId(id)} />
      )}
    </div>
  );
}
