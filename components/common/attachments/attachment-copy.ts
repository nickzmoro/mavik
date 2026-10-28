import { mockApprovedMaterials } from "@/lib/mocks/agent";

export type AttachmentTarget = "agent" | "art";

export type AttachmentCopy = {
  menuLabel: string;
  fileDescription: string;
  materialsDescription: string;
  linkDescription: string;
  materialsDialogDescription: string;
  linkDialogDescription: string;
};

const materialsDescription = `Escolher entre os ${mockApprovedMaterials.length} itens`;

export const attachmentCopies: Record<AttachmentTarget, AttachmentCopy> = {
  agent: {
    menuLabel: "Anexar à conversa",
    fileDescription: "PDF, planilha ou documento",
    materialsDescription,
    linkDescription: "Para o agente usar de referência",
    materialsDialogDescription:
      "Escolha as artes que o agente deve usar como referência.",
    linkDialogDescription:
      "Cole o link de um post que você gostou. O agente usa como referência de formato e linguagem.",
  },
  art: {
    menuLabel: "Anexar à arte",
    fileDescription: "PDF, cardápio ou documento",
    materialsDescription,
    linkDescription: "Para a IA usar de referência",
    materialsDialogDescription:
      "Escolha as artes que a IA deve usar como referência.",
    linkDialogDescription:
      "Cole o link de um post que você gostou. A IA usa como referência de formato e estilo.",
  },
};
