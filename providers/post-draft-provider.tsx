"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import type { Attachment } from "@/hooks/use-attachments";
import {
  parsePostDraft,
  POST_DRAFT_STORAGE_KEY,
  type StoredPostDraft,
} from "@/lib/post-draft";

export type PostDraft = StoredPostDraft & { attachments: Attachment[] };

type PostDraftContextValue = {
  draft: PostDraft | null;
  isHydrated: boolean;
  hasLostAttachments: boolean;
  startDraft: (draft: PostDraft) => void;
  updateDraft: (changes: Partial<PostDraft>) => void;
  clearDraft: () => void;
};

const PostDraftContext = createContext<PostDraftContextValue | null>(null);

const listeners = new Set<() => void>();
let storedDraftRaw: string | null | undefined;

const readStoredDraftRaw = () => {
  if (storedDraftRaw === undefined) {
    try {
      storedDraftRaw = window.sessionStorage.getItem(POST_DRAFT_STORAGE_KEY);
    } catch {
      storedDraftRaw = null;
    }
  }

  return storedDraftRaw;
};

const writeStoredDraftRaw = (nextRaw: string | null) => {
  storedDraftRaw = nextRaw;

  try {
    if (nextRaw === null) {
      window.sessionStorage.removeItem(POST_DRAFT_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(POST_DRAFT_STORAGE_KEY, nextRaw);
    }
  } catch {}

  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

const subscribeToNothing = () => () => {};

export function PostDraftProvider({ children }: { children: React.ReactNode }) {
  const draftRaw = useSyncExternalStore(
    subscribe,
    readStoredDraftRaw,
    () => null,
  );
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const storedDraft = useMemo(() => parsePostDraft(draftRaw), [draftRaw]);

  const draft = storedDraft ? { ...storedDraft, attachments } : null;
  const hasLostAttachments =
    (storedDraft?.attachmentCount ?? 0) > attachments.length;

  const saveDraft = (nextDraft: PostDraft) => {
    const { attachments: nextAttachments, ...nextStoredDraft } = nextDraft;

    setAttachments(nextAttachments);
    writeStoredDraftRaw(
      JSON.stringify({
        ...nextStoredDraft,
        attachmentCount: nextAttachments.length,
      }),
    );
  };

  const updateDraft = ({
    attachments: nextAttachments,
    ...changes
  }: Partial<PostDraft>) => {
    if (!storedDraft) {
      return;
    }

    if (nextAttachments) {
      saveDraft({ ...storedDraft, ...changes, attachments: nextAttachments });
      return;
    }

    writeStoredDraftRaw(JSON.stringify({ ...storedDraft, ...changes }));
  };

  const clearDraft = () => {
    setAttachments([]);
    writeStoredDraftRaw(null);
  };

  return (
    <PostDraftContext.Provider
      value={{
        draft,
        isHydrated,
        hasLostAttachments,
        startDraft: saveDraft,
        updateDraft,
        clearDraft,
      }}
    >
      {children}
    </PostDraftContext.Provider>
  );
}

export function usePostDraft() {
  const context = useContext(PostDraftContext);

  if (!context) {
    throw new Error("usePostDraft precisa estar dentro de PostDraftProvider");
  }

  return context;
}
