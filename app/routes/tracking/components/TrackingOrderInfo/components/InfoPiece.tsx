import type { ReactNode } from 'react';

type InfoPieceProps = {
  title: ReactNode;
  info: ReactNode;
}

function InfoPiece({ title, info }: InfoPieceProps) {
  return (
    <div className="mb-4">
      <h4 className="font-medium text-base text-[rgb(130,129,131)]">{title}</h4>
      <p className="mb-0">
        {info}
      </p>
    </div>

  );
}

export default InfoPiece;