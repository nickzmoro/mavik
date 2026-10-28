import { PanelCard, PanelMeta } from "@/components/common/panel-card";
import { PostArtThumbnail } from "@/components/common/post-art-preview";
import { mockApprovedMaterials } from "@/lib/mocks/agent";

const previewMaterials = mockApprovedMaterials.slice(0, 3);

export function ApprovedMaterialsCard() {
  return (
    <PanelCard
      titleId="mat-title"
      title="Materiais aprovados"
      action={<PanelMeta>{mockApprovedMaterials.length} itens</PanelMeta>}
    >
      <div className="grid grid-cols-3 gap-2">
        {previewMaterials.map((material) => (
          <PostArtThumbnail
            key={material.id}
            art={material.art}
            label={`Post aprovado: ${material.title}`}
          />
        ))}
      </div>
    </PanelCard>
  );
}
