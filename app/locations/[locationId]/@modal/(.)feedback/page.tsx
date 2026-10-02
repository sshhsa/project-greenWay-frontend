'use client';

import { useParams, useRouter } from 'next/navigation';

import { useAuthStore } from '@/lib/store/authStore';
import AddFeedbackModal from '@/components/AddFeedbackModal/AddFeedbackModal';
import AuthPromptModal from '@/components/AuthPromptModal/AuthPromptModal';

export default function FeedbackModal() {
  const router = useRouter();
  const { locationId } = useParams<{ locationId: string }>();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const handleClose = () => {
    router.back();
  };
  return isAuthenticated ? (
    <AddFeedbackModal locationId={locationId} onClose={handleClose} />
  ) : (
    <AuthPromptModal onClose={handleClose} />
  );
}
