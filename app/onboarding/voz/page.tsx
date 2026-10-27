import { redirect } from "next/navigation";
import { Suspense } from "react";

import { OnboardingStepIntro } from "@/components/onboarding/onboarding-step-intro";
import { OnboardingStepSkeleton } from "@/components/onboarding/onboarding-step-skeleton";
import { getVoiceStepData } from "@/lib/onboarding/get-step-data";
import { getCurrentUserId } from "@/lib/onboarding/store-access";
import { routes } from "@/lib/routes";

import { VoiceForm } from "@/components/brand/voice/voice-form";

async function VoiceStep() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(routes.login);
  }

  const voiceStepData = await getVoiceStepData(userId);

  if (!voiceStepData) {
    redirect(routes.onboardingBrand);
  }

  return <VoiceForm {...voiceStepData} />;
}

export default function OnboardingVoicePage() {
  return (
    <>
      <OnboardingStepIntro
        step={3}
        title="Como sua marca fala?"
        description="Ensine ao sistema como a marca fala e com quem ela fala. Você ajusta e confirma."
      />
      <Suspense fallback={<OnboardingStepSkeleton />}>
        <VoiceStep />
      </Suspense>
    </>
  );
}
