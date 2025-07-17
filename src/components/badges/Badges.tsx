import "./Badges.css";
import { RenderBadge } from "./RenderBadge";

type BadgesProps = {
  badges: string[];
};

const renderBadgeRow = (badges: string[]) => (
  badges.length > 0 && (
    <div className="badges">
      {badges.map((badge) => (
        <RenderBadge key={badge} badge={badge} />
      ))}
    </div>
  )
);

export const Badges = ({ badges }: BadgesProps) => {
  const firstRow = badges.slice(0, 6);
  const secondRow = badges.slice(6);

  return (
    <>
    {renderBadgeRow(firstRow)}
    {renderBadgeRow(secondRow)}
  </>
  );
};
