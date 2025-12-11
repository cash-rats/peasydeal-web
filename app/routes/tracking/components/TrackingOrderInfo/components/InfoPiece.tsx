import type { ReactNode } from 'react';

type InfoPieceProps = {
  title: ReactNode;
  info: ReactNode;
}

function InfoPiece({ title, info }: InfoPieceProps) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h4>
      <div className="mt-1 text-base font-medium text-gray-900">
        {info}
      </div>
    </div>

  );
}

export default InfoPiece;
