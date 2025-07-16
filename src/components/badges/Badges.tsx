import "./Badges.css";
import { RenderBadge } from "./RenderBadge";

type BadgesProps = {
  badges: string[];
};

export const Badges = ({ badges }: BadgesProps) => {
  const firstRow = badges.slice(0, 6);
  const secondRow = badges.slice(6);

  return (
    <>
      <div className="badges">
        {firstRow.map((badge) => {
          return <RenderBadge badge={badge} />;
        })}
      </div>
      {Boolean(secondRow.length) && (
        <div className="badges">
          {secondRow.map((badge) => {
            return <RenderBadge badge={badge} />;
          })}
        </div>
      )}
    </>
  );
};
