import { Flag } from "lucide-react";

import { PanelCard, PanelTextButton } from "@/components/common/panel-card";
import { getMonthName, parseIsoDate } from "@/lib/agenda-dates";
import { mockAgendaMarkers, type AgendaCampaign } from "@/lib/mocks/agenda";

type CampaignsCardProps = {
  campaigns: AgendaCampaign[];
  monthIndex: number;
  onNewCampaign: () => void;
};

export function CampaignsCard({
  campaigns,
  monthIndex,
  onNewCampaign,
}: CampaignsCardProps) {
  const monthMarkers = Object.entries(mockAgendaMarkers)
    .filter(([isoDate]) => parseIsoDate(isoDate).getMonth() === monthIndex)
    .map(
      ([isoDate, marker]) =>
        `${parseIsoDate(isoDate).getDate()} ${getMonthName(monthIndex).slice(0, 3)} · ${marker}`,
    );

  return (
    <PanelCard
      titleId="camp-title"
      title="Campanhas e datas"
      action={
        <PanelTextButton aria-haspopup="dialog" onClick={onNewCampaign}>
          Nova
        </PanelTextButton>
      }
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {campaigns.map((campaign) => (
          <li
            key={campaign.name}
            className="tile flex flex-col gap-1.5 rounded-(--r-lg) px-3.5 py-3"
          >
            <span className="flex items-center gap-2">
              <Flag
                aria-hidden="true"
                className="size-4 shrink-0 text-primary"
              />
              <span className="min-w-0 flex-1 text-sm leading-[1.4] font-semibold">
                {campaign.name}
              </span>
            </span>
            <span className="text-xs leading-[1.4] text-muted">
              {campaign.period} · {campaign.note}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5">
        {monthMarkers.map((marker) => (
          <span
            key={marker}
            className="date-chip rounded-full px-2.5 py-0.75 text-xs leading-[1.4] font-semibold"
          >
            {marker}
          </span>
        ))}
      </div>
    </PanelCard>
  );
}
