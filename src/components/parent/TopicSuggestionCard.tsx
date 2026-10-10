// TopicSuggestionCard — asks the parent to approve or keep the current topic.
// The card is hidden unless a suggestion is waiting. It does not write to Firestore.

'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLearningPath } from '@/hooks/useLearningPath';
import type { LearningPath, Session, Subject } from '@/types';

interface TopicSuggestionCardProps {
  subject: Subject;
  /** Newest sessions first. Used only to find the evaluator's note for this suggestion. */
  sessions: Session[];
  sessionsLoading: boolean;
}

const SUBJECT_LABEL: Record<Subject, string> = {
  math: 'Math',
  reading: 'Reading',
};

/** Suggestion text when one is waiting and the parent has not approved it. */
function pendingSuggestion(path: LearningPath | null): string | null {
  if (path === null || path.parentApproved !== false) {
    return null;
  }

  if (typeof path.suggestedNextTopic !== 'string') {
    return null;
  }

  const topic = path.suggestedNextTopic.trim();
  return topic.length > 0 ? topic : null;
}

/**
 * The evaluator's note for this suggestion.
 * That note is saved on the session, not on the learning path document.
 */
function findEvaluatorReason(
  sessions: Session[],
  subject: Subject,
  currentTopic: string,
  suggestedNextTopic: string,
): string | null {
  for (const session of sessions) {
    if (session.subject !== subject) {
      continue;
    }

    const evaluations = session.evaluations ?? [];

    for (let index = evaluations.length - 1; index >= 0; index -= 1) {
      const evaluation = evaluations[index];
      if (evaluation === undefined) {
        continue;
      }

      if (
        evaluation.topic === currentTopic &&
        evaluation.suggestedNext === suggestedNextTopic &&
        evaluation.reasoning.trim().length > 0
      ) {
        return evaluation.reasoning.trim();
      }
    }
  }

  return null;
}

/** Parent prompt for one subject. Renders nothing when no suggestion is waiting. */
export function TopicSuggestionCard({
  subject,
  sessions,
  sessionsLoading,
}: TopicSuggestionCardProps) {
  const { learningPath, approveTopic, rejectTopic, isLoading, error } = useLearningPath(subject);
  const [hiddenFor, setHiddenFor] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const savingRef = useRef(false);

  const suggestion = pendingSuggestion(learningPath);
  const label = SUBJECT_LABEL[subject];

  // A cleared suggestion should be allowed to appear again later.
  if (suggestion === null && hiddenFor !== null) {
    setHiddenFor(null);
  }

  useEffect(() => {
    if (suggestion === null) {
      savingRef.current = false;
    }
  }, [suggestion]);

  if (isLoading) {
    return null;
  }

  if (error !== null) {
    return (
      <p className="text-base text-red-600" role="alert">
        {error}
      </p>
    );
  }

  if (learningPath === null || suggestion === null || hiddenFor === suggestion) {
    return null;
  }

  const foundReason = sessionsLoading
    ? null
    : findEvaluatorReason(sessions, subject, learningPath.currentTopic, suggestion);
  const reason = sessionsLoading
    ? "Loading the evaluator's note…"
    : (foundReason ?? 'The evaluator did not leave a note for this suggestion.');

  /** Hides the card immediately, then calls approve or reject. Shows it again if the save fails. */
  async function choose(action: () => Promise<void>) {
    if (savingRef.current) {
      return;
    }

    savingRef.current = true;
    setActionError(null);
    setHiddenFor(suggestion);
    try {
      await action();
    } catch (caught) {
      savingRef.current = false;
      setHiddenFor(null);
      setActionError(
        caught instanceof Error
          ? caught.message
          : 'We could not save that choice. Please try again.',
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next topic suggestion</CardTitle>
        <CardDescription>
          Your child finished a topic. You decide what they learn next.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4" aria-live="polite">
        <Badge
          variant={subject === 'reading' ? 'secondary' : 'default'}
          className="h-auto w-fit px-2.5 py-1 text-base"
        >
          {label}
        </Badge>
        <p className="text-base text-slate-700">
          Just finished:{' '}
          <span className="font-semibold text-slate-900">{learningPath.currentTopic}</span>
        </p>
        <p className="text-base text-slate-700">
          Suggested next: <span className="font-semibold text-slate-900">{suggestion}</span>
        </p>
        <p className="text-base text-slate-600">{reason}</p>
        {actionError !== null && (
          <p className="text-base text-red-600" role="alert">
            {actionError}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="h-auto min-h-11 px-4 text-base"
            onClick={() => {
              void choose(approveTopic);
            }}
          >
            Yes, start this next
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-auto min-h-11 px-4 text-base"
            onClick={() => {
              void choose(rejectTopic);
            }}
          >
            Keep practicing current topic
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
