"use client";

import { AtSign, Unplug } from "lucide-react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConnectInstagram } from "@/hooks/mutations/use-connect-instagram";
import { useDisconnectInstagram } from "@/hooks/mutations/use-disconnect-instagram";
import type { InstagramConnection } from "@/lib/instagram/accounts";
import type { InstagramConnectResult } from "@/lib/routes";
import { useToast } from "@/providers/toast-provider";

import { BrandCard, BrandSmallText } from "./brand-card";

const resultAlerts: Record<
  InstagramConnectResult,
  {
    variant: "success" | "warning" | "destructive";
    title: string;
    description: string;
  }
> = {
  conectado: {
    variant: "success",
    title: "Instagram conectado",
    description: "Os posts aprovados já podem ser publicados nesta conta.",
  },
  negado: {
    variant: "warning",
    title: "Conexão cancelada",
    description: "Você não autorizou o acesso no Facebook.",
  },
  erro: {
    variant: "destructive",
    title: "Não conseguimos conectar",
    description:
      "Confira se você autorizou todas as permissões pedidas e tente de novo.",
  },
  sem_conta: {
    variant: "warning",
    title: "Nenhum Instagram encontrado",
    description:
      "Seu Instagram precisa ser profissional (Empresa ou Criador de conteúdo) e estar vinculado a uma página do Facebook que você administra. Ao autorizar, selecione essa página.",
  },
};

type InstagramConnectionCardProps = {
  connection: InstagramConnection | null;
  result?: InstagramConnectResult;
};

export function InstagramConnectionCard({
  connection,
  result,
}: InstagramConnectionCardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const connectMutation = useConnectInstagram();
  const disconnectMutation = useDisconnectInstagram();
  const needsReconnect = connection?.status === "expirado";
  const resultAlert = result ? resultAlerts[result] : null;

  const handleConnect = async () => {
    const response = await connectMutation.mutateAsync({}).catch(() => null);

    if (!response?.isSuccess) {
      showToast(
        response?.errorMessage ??
          "Não conseguimos abrir o Instagram. Tente de novo.",
      );
      return;
    }

    window.location.assign(response.data.url);
  };

  const handleDisconnect = async () => {
    const response = await disconnectMutation.mutateAsync({}).catch(() => null);

    if (!response?.isSuccess) {
      showToast(
        response?.errorMessage ??
          "Não conseguimos desconectar agora. Tente de novo.",
      );
      return;
    }

    showToast("Instagram desconectado");
    router.refresh();
  };

  return (
    <BrandCard
      titleId="instagram-connection-title"
      title="Instagram"
      hint="Conecte a conta profissional da loja para o Mavik publicar os posts agendados."
    >
      {resultAlert ? (
        <Alert variant={resultAlert.variant}>
          <AlertTitle>{resultAlert.title}</AlertTitle>
          <AlertDescription>{resultAlert.description}</AlertDescription>
        </Alert>
      ) : null}

      {needsReconnect ? (
        <Alert variant="warning">
          <AlertTitle>Reconecte o Instagram</AlertTitle>
          <AlertDescription>
            {connection.lastError ??
              "O acesso expirou. Conecte de novo para continuar publicando."}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="brand-tile flex flex-wrap items-center justify-between gap-4 rounded-[18px] px-4.5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <AtSign aria-hidden="true" className="size-6 shrink-0" />
          {connection ? (
            <div className="flex min-w-0 flex-col gap-1">
              <b className="truncate text-sm font-semibold">
                @{connection.username}
              </b>
              <div>
                <Badge variant={needsReconnect ? "warning" : "success"}>
                  {needsReconnect ? "Reconectar" : "Conectado"}
                </Badge>
              </div>
            </div>
          ) : (
            <BrandSmallText>Nenhuma conta conectada.</BrandSmallText>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {!connection || needsReconnect ? (
            <Button onClick={handleConnect} loading={connectMutation.isPending}>
              {connectMutation.isPending ? null : (
                <AtSign aria-hidden="true" className="size-4.5" />
              )}
              {needsReconnect ? "Reconectar Instagram" : "Conectar Instagram"}
            </Button>
          ) : null}
          {connection ? (
            <Button
              variant="outline"
              onClick={handleDisconnect}
              loading={disconnectMutation.isPending}
            >
              {disconnectMutation.isPending ? null : (
                <Unplug aria-hidden="true" className="size-4.5" />
              )}
              Desconectar
            </Button>
          ) : null}
        </div>
      </div>

      <BrandSmallText>
        Ao desconectar, apagamos o acesso guardado no Mavik e revogamos as
        permissões do Mavik na sua conta do Facebook.
      </BrandSmallText>
    </BrandCard>
  );
}
