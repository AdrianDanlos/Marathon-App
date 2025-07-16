import earlyBird from "@assets/images/badges/earlyBird.png";
import nightOwl from "@assets/images/badges/nightOwl.png";
import marathonMilestone from "@assets/images/badges/marathonMilestone.png";
import halfMarathonRace from "@assets/images/badges/halfMarathonRace.png";
import marathonRace from "@assets/images/badges/marathonRace.png";
import climber from "@assets/images/badges/climber.png";
import consistencyKing from "@assets/images/badges/consistencyKing.png";
import monthlyUltramaraton from "@assets/images/badges/monthlyUltramaraton.png";
import sunsetChaser from "@assets/images/badges/sunsetChaser.png";
import weekendWarrior from "@assets/images/badges/weekendWarrior.png";
import continentalCruiser from "@assets/images/badges/continentalCruiser.png";
import transcontinentalTitan from "@assets/images/badges/transcontinentalTitan.png";
import { Tooltip } from "react-tooltip";
import { badges as badgeMeta } from "../../utils/badges";

const badgeImageMap: Record<string, string> = {
  earlyBird,
  nightOwl,
  marathonMilestone,
  halfMarathonRace,
  marathonRace,
  climber,
  consistencyKing,
  monthlyUltramaraton,
  sunsetChaser,
  weekendWarrior,
  continentalCruiser,
  transcontinentalTitan,
};

export const RenderBadge = ({ badge }: { badge: string }) => {
  const meta = badgeMeta[badge as keyof typeof badgeMeta];
  return (
    <h1 key={badge} data-tooltip-id={`badge-tooltip-${badge}`}>
      <img src={badgeImageMap[badge]} alt={meta.name} />
      <Tooltip
        id={`badge-tooltip-${badge}`}
        place="bottom"
        variant="light"
        render={() => (
          <span>
            <span className="badgeTitle">{meta.name}:</span> {meta.description}
          </span>
        )}
      />
    </h1>
  );
};
