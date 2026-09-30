"use client";

import { useState } from "react";

import AddReviewModal from "@/components/Modal/AddReviewModal/AddReviewModal";
import AuthPromptModal from "@/components/Modal/AuthPromptModal/AuthPromptModal";
import ConfirmationModal from "@/components/Modal/ConfirmationModal/ConfirmationModal";

import ButtonTest from "@/components/UI/Button/ButtonTest";

import InputTest from "@/components/UI/Input/InputTest";

export default function Home() {
  const [activeModal, setActiveModal] = useState<
    "review" | "confirmation" | "auth" | null
  >(null);

  return (
    <main>
      <ButtonTest />
      <InputTest />
      <button
        type="button"
        onClick={() => setActiveModal("review")}
      >
        Відкрити AddReviewModal
      </button>

      <button
        type="button"
        onClick={() => setActiveModal("confirmation")}
      >
        Відкрити ConfirmationModal
      </button>

      <button
        type="button"
        onClick={() => setActiveModal("auth")}
      >
        Відкрити AuthPromptModal
      </button>

      {activeModal === "review" && (
        <AddReviewModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "confirmation" && (
        <ConfirmationModal
          title="Ви точно хочете вийти?"
          description="Ми будемо сумувати за вами!"
          confirmButtonText="Вийти"
          cancelButtonText="Відмінити"
          onConfirm={async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }}
          onCancel={() => setActiveModal(null)}
        />
      )}

      {activeModal === "auth" && (
        <AuthPromptModal
          onClose={() => setActiveModal(null)}
        />
      )}
    </main>
  );
}