// useLearningPath — live view of one subject's learning path for the parent dashboard.
// Listens with the client SDK. Approve and reject go through API routes so this
// file never imports the Admin learning-path helpers.

'use client';

import { useCallback, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { subscribeToLearningPath } from '@/lib/firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import type {
  ApiResult,
  ApproveTopicRequest,
  ApproveTopicResponse,
  LearningPath,
  RejectTopicRequest,
  RejectTopicResponse,
  Subject,
} from '@/types';

interface UseLearningPathReturn {
  /** The subject's learning path, or null when this parent has not started it. */
  learningPath: LearningPath | null;
  /** Moves the path onto the suggested topic. Throws a plain-English error on failure. */
  approveTopic: () => Promise<void>;
  /** Clears the suggestion and leaves the current topic in place. */
  rejectTopic: () => Promise<void>;
  isLoading: boolean;
  /** Set when the live listener fails. Null while the path is simply missing. */
  error: string | null;
}

/** Sends an authenticated JSON post and unwraps ApiResult. */
async function postLearningPath<T>(
  path: string,
  body: ApproveTopicRequest | RejectTopicRequest,
): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  if (token === undefined || token === '') {
    throw new Error('Please sign in again, then try that button.');
  }

  let response: Response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('We could not save that choice. Please try again.');
  }

  let result: ApiResult<T>;
  try {
    result = (await response.json()) as ApiResult<T>;
  } catch {
    throw new Error('We could not save that choice. Please try again.');
  }

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

/** Live learning path for one subject, plus the parent approve and reject actions. */
export function useLearningPath(subject: Subject): UseLearningPathReturn {
  const parentUID = useAuthStore((s) => s.parentUID);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parentUID === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLearningPath(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToLearningPath(
      parentUID,
      subject,
      (path) => {
        setLearningPath(path);
        setIsLoading(false);
      },
      () => {
        setLearningPath(null);
        setError(
          subject === 'reading'
            ? 'We could not load the Reading learning path. Please refresh.'
            : 'We could not load the Math learning path. Please refresh.',
        );
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [parentUID, subject]);

  const approveTopic = useCallback(async () => {
    const nextTopic = learningPath?.suggestedNextTopic?.trim() ?? '';
    if (nextTopic.length === 0) {
      throw new Error('There is no suggested topic to approve.');
    }

    await postLearningPath<ApproveTopicResponse>('/api/learning-path/approve', {
      subject,
      approvedTopic: nextTopic,
    });
  }, [learningPath, subject]);

  const rejectTopic = useCallback(async () => {
    await postLearningPath<RejectTopicResponse>('/api/learning-path/reject', { subject });
  }, [subject]);

  return { learningPath, approveTopic, rejectTopic, isLoading, error };
}
