import type { ReactNode } from 'react';

type InfoPieceProps = {
  title: ReactNode;
  info: ReactNode;
}

function InfoPiece({ title, info }: InfoPieceProps) {
  return (
    <div>
      <h4 className="mb-1 font-body text-xs text-rd-text-muted">{title}</h4>
      <div className="font-body text-sm font-medium text-black">
        {info}
      </div>
    </div>
  );
}

export default InfoPiece;
