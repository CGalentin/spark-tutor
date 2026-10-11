// One subject inside the learning-path timeline.
// Opens and closes that subject's scores, and keeps anything past the newest five folded.

'use client';

import {
  LearningPathScoreList,
  type LearningPathTimelineEntry,
} from '@/components/parent/LearningPathScoreList';
import { buttonVariants } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { MASTERED_SCORE, type LearningPath, type Subject, type TopicMastery } from '@/types';

/** How many scores stay visible before the parent opens the rest. */
const RECENT_COUNT = 5;

interface LearningPathSubjectSectionProps {
  subject: Subject;
  learningPath: LearningPath | null;
  isLoading: boolean;
  error: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fullHistoryOpen: boolean;
  onFullHistoryChange: (open: boolean) => void;
}

const TRIGGER_CLASS = cn(buttonVariants({ variant: 'outline' }), 'h-auto min-h-11 px-4 text-base');

/** Turns a Firestore timestamp into a Date. A missing stamp stays null. */
function toDate(value: TopicMastery['evaluatedAt'] | null | undefined): Date | null {
  if (value != null && typeof value.toDate === 'function') {
    return value.toDate();
  }
  return null;
}

/** Formats a score date as "Oct 10, 2026". */
function formatScoreDate(date: Date | null): string {
  if (date === null) return 'Not scored yet';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Newest scores first. The latest try at the current topic is marked in progress. */
function buildTimeline(path: LearningPath): LearningPathTimelineEntry[] {
  const history = Array.isArray(path.masteryHistory) ? path.masteryHistory : [];
  // Same timestamp: the score saved later in the list is the newer one.
  const ordered = history
    .map((entry, index) => ({ entry, index }))
    .sort((left, right) => {
      const leftTime = toDate(left.entry.evaluatedAt)?.getTime() ?? 0;
      const rightTime = toDate(right.entry.evaluatedAt)?.getTime() ?? 0;
      if (rightTime !== leftTime) return rightTime - leftTime;
      return right.index - left.index;
    });

  const entries: LearningPathTimelineEntry[] = ordered.map(({ entry }, index) => {
    const scoredAt = toDate(entry.evaluatedAt);
    const score = Number.isFinite(entry.score) ? Math.round(entry.score) : 0;
    return {
      key: `${entry.topic}-${scoredAt?.getTime() ?? 'none'}-${index}`,
      topic: entry.topic,
      grade: entry.grade,
      score,
      dateLabel: formatScoreDate(scoredAt),
      inProgress: false,
    };
  });

  const currentIndex = entries.findIndex((entry) => entry.topic === path.currentTopic);
  if (currentIndex === -1 && path.currentTopic.trim().length > 0) {
    entries.unshift({
      key: `current-${path.currentTopic}`,
      topic: path.currentTopic,
      grade: path.currentGrade,
      score: 0,
      dateLabel: 'Not scored yet',
      inProgress: true,
    });
    return entries;
  }

  if (currentIndex >= 0 && entries[currentIndex].score < MASTERED_SCORE) {
    entries[currentIndex] = { ...entries[currentIndex], inProgress: true };
  }

  return entries;
}

/** Math or Reading scores, with the newest five showing until the parent opens the rest. */
export function LearningPathSubjectSection({
  subject,
  learningPath,
  isLoading,
  error,
  open,
  onOpenChange,
  fullHistoryOpen,
  onFullHistoryChange,
}: LearningPathSubjectSectionProps) {
  const label = subject === 'math' ? 'Math' : 'Reading';
  const entries = learningPath === null ? [] : buildTimeline(learningPath);
  const recent = entries.slice(0, RECENT_COUNT);
  const earlier = entries.slice(RECENT_COUNT);

  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className={TRIGGER_CLASS} aria-label={`${label} learning path`}>
        {open ? `Hide ${label}` : `Show ${label}`}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        {isLoading && <p className="text-base text-slate-600">Loading {label}…</p>}
        {error !== null && <p className="text-base text-red-600">{error}</p>}
        {!isLoading && error === null && learningPath === null && (
          <p className="text-base text-slate-600">No {label.toLowerCase()} topics yet.</p>
        )}
        {!isLoading && error === null && entries.length > 0 && (
          <div className="flex flex-col gap-3">
            <LearningPathScoreList entries={recent} />
            {earlier.length > 0 && (
              <Collapsible open={fullHistoryOpen} onOpenChange={onFullHistoryChange}>
                <CollapsibleContent>
                  <LearningPathScoreList entries={earlier} />
                </CollapsibleContent>
                <CollapsibleTrigger className={cn(TRIGGER_CLASS, 'mt-3')}>
                  {fullHistoryOpen
                    ? 'Show recent scores'
                    : `Show full history (${earlier.length} earlier)`}
                </CollapsibleTrigger>
              </Collapsible>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
