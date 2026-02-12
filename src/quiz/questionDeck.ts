import type { Lesson, Place } from "../types";
import type { QuizQuestion } from "./types";

function summarySnippet(place: Place) {
  return place.details?.[0] ?? place.summary;
}

function buildLocationQuestion(lessonId: QuizQuestion["lessonId"], place: Place): QuizQuestion {
  return {
    id: `${lessonId}-deck-where-${place.id}`,
    lessonId,
    difficulty: 1,
    prompt: `فين ${place.title}؟`,
    answer: {
      title: `${place.title} على الخريطة`,
      paragraphs: [
        place.summary,
        `الإحداثيات: ${place.lat.toFixed(3)}, ${place.lng.toFixed(3)}.`,
        ...((place.details ?? []).slice(0, 2)),
      ],
      quickFacts: [
        { k: "تصنيف", v: place.category },
        { k: "الطول/العرض", v: `${place.lat.toFixed(3)}, ${place.lng.toFixed(3)}` },
      ],
      nextSuggestions: [
        `عايز أتعرف على أهم حاجات ${place.title}.`,
        `إزاي نستخدم ${place.title} لصالح الناس؟`,
      ],
    },
    action: {
      flyToPlaceId: place.id,
      highlightPlaceIds: [place.id],
      setLayers: { showLabels: true, showHeat: true },
      draw: [
        {
          kind: "text",
          at: [place.lat, place.lng],
          text: "هنا السؤال",
        },
      ],
    },
  };
}

function buildStoryQuestion(lessonId: QuizQuestion["lessonId"], place: Place): QuizQuestion {
  const detailLines = place.details ?? [];
  return {
    id: `${lessonId}-deck-why-${place.id}`,
    lessonId,
    difficulty: 2,
    prompt: `إيه أهم حاجة بتميز ${place.title}؟`,
    answer: {
      title: `${place.title} في سطور`,
      paragraphs: [
        summarySnippet(place),
        ...detailLines.slice(1, 3),
      ].filter(Boolean),
      quickFacts: [
        { k: "تقييم", v: `${place.metrics?.score ?? 70} / 100` },
        { k: "الإحداثيات", v: `${place.lat.toFixed(3)}, ${place.lng.toFixed(3)}` },
      ],
      nextSuggestions: [
        "عايز أسمع قصة المكان دا",
        "إيه اللي يخليني أتعامل مع المكان دا؟",
      ],
    },
    action: {
      flyToPlaceId: place.id,
      highlightPlaceIds: [place.id],
      setLayers: { showLabels: true, showHeat: false },
      draw: [
        {
          kind: "circle",
          center: [place.lat, place.lng],
          radiusM: 85000,
          label: "محور سؤالنا",
        },
        {
          kind: "text",
          at: [place.lat + 0.1, place.lng - 0.12],
          text: "نركّز هنا",
        },
      ],
    },
  };
}

export function buildLessonDeck(lesson: Lesson): QuizQuestion[] {
  const sortedPlaces = [...lesson.places].sort(
    (a, b) => (b.metrics?.importance ?? 60) - (a.metrics?.importance ?? 60),
  );
  const deck: QuizQuestion[] = [];
  const lessonId = lesson.id as QuizQuestion["lessonId"];

  // 1. Generate questions for all places
  for (const place of sortedPlaces) {
    deck.push(buildLocationQuestion(lessonId, place));
    deck.push(buildStoryQuestion(lessonId, place));
  }

  // 2. Add static questions from activities
  lesson.activities.forEach((act) => {
    if (act.type === "quiz") {
      act.questions.forEach((q) => {
        deck.push({
          id: `${lessonId}-static-${q.id}`,
          lessonId,
          difficulty: 2,
          prompt: q.q,
          answer: {
            title: "إجابة الاختبار",
            paragraphs: [
              `الإجابة الصحيحة هي: ${q.choices[q.answerIndex]}`,
              q.explain
            ],
            quickFacts: [
              { k: "نوع السؤال", v: "اختبار سريع" }
            ]
          }
        });
      });
    }
  });

  return deck;
}
