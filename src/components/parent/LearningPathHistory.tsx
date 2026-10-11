// LearningPathHistory — parent timeline of topic scores, grouped by Math and Reading.
// Sits below session history. Each subject listens through useLearningPath.

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningPathSubjectSection } from '@/components/parent/LearningPathSubjectSection';
import { useLearningPath } from '@/hooks/useLearningPath';

/** Parent timeline under session history. Math and Reading each listen on their own. */
export function LearningPathHistory() {
  const math = useLearningPath('math');
  const reading = useLearningPath('reading');
  const [mathOpen, setMathOpen] = useState(true);
  const [readingOpen, setReadingOpen] = useState(true);
  const [mathFull, setMathFull] = useState(false);
  const [readingFull, setReadingFull] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Learning path</CardTitle>
        <CardDescription className="text-base text-slate-600">
          Newest scores first. The topic your child is on now is marked In progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <LearningPathSubjectSection
          subject="math"
          learningPath={math.learningPath}
          isLoading={math.isLoading}
          error={math.error}
          open={mathOpen}
          onOpenChange={setMathOpen}
          fullHistoryOpen={mathFull}
          onFullHistoryChange={setMathFull}
        />
        <LearningPathSubjectSection
          subject="reading"
          learningPath={reading.learningPath}
          isLoading={reading.isLoading}
          error={reading.error}
          open={readingOpen}
          onOpenChange={setReadingOpen}
          fullHistoryOpen={readingFull}
          onFullHistoryChange={setReadingFull}
        />
      </CardContent>
    </Card>
  );
}
