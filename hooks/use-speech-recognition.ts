"use client";

import { useEffect, useRef, useState } from "react";

import { useToast } from "@/providers/toast-provider";

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const speechErrorMessages: Record<string, string> = {
  "not-allowed": "Permita o acesso ao microfone para usar o comando de voz.",
  "service-not-allowed":
    "Permita o acesso ao microfone para usar o comando de voz.",
  "audio-capture": "Não encontramos um microfone neste aparelho.",
  network: "Não foi possível transcrever agora. Verifique a sua conexão.",
};

const getSpeechRecognition = () => {
  const speechWindow = window as unknown as SpeechWindow;

  return (
    speechWindow.SpeechRecognition ??
    speechWindow.webkitSpeechRecognition ??
    null
  );
};

const formatElapsedTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export function useSpeechRecognition(onTranscribed: (text: string) => void) {
  const { showToast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const interimTranscriptRef = useRef("");
  const shouldKeepListeningRef = useRef(false);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const intervalId = window.setInterval(
      () => setElapsedSeconds((currentSeconds) => currentSeconds + 1),
      1000,
    );

    return () => window.clearInterval(intervalId);
  }, [isRecording]);

  useEffect(
    () => () => {
      shouldKeepListeningRef.current = false;
      recognitionRef.current?.abort();
    },
    [],
  );

  const stopListening = () => {
    shouldKeepListeningRef.current = false;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsRecording(false);
  };

  const startRecording = () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      showToast(
        "Seu navegador não tem comando de voz. Use o Chrome, o Edge ou o Safari.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index];

        if (result.isFinal) {
          finalTranscriptRef.current += `${result[0].transcript} `;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      interimTranscriptRef.current = interimTranscript;
    };

    recognition.onerror = ({ error }) => {
      const errorMessage = speechErrorMessages[error];

      if (errorMessage) {
        stopListening();
        showToast(errorMessage);
      }
    };

    recognition.onend = () => {
      if (!shouldKeepListeningRef.current || !recognitionRef.current) {
        return;
      }

      try {
        recognitionRef.current.start();
      } catch {
        stopListening();
      }
    };

    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    shouldKeepListeningRef.current = true;
    recognitionRef.current = recognition;
    setElapsedSeconds(0);
    setIsRecording(true);

    try {
      recognition.start();
    } catch {
      stopListening();
      showToast("Não foi possível ligar o microfone. Tente de novo.");
    }
  };

  const finishRecording = () => {
    const transcript =
      `${finalTranscriptRef.current} ${interimTranscriptRef.current}`
        .replace(/\s+/g, " ")
        .trim();

    stopListening();

    if (!transcript) {
      showToast("Não ouvi nada. Tente falar de novo.");
      return;
    }

    onTranscribed(transcript);
    showToast("Fala transcrita. Confira o texto.");
  };

  return {
    isRecording,
    elapsedLabel: formatElapsedTime(elapsedSeconds),
    startRecording,
    cancelRecording: stopListening,
    finishRecording,
  };
}

export type SpeechRecognitionState = ReturnType<typeof useSpeechRecognition>;
