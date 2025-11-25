import type { ReactNode } from 'react';

type InfoPieceProps = {
  title: ReactNode;
  info: ReactNode;
}

function InfoPiece({ title, info }: InfoPieceProps) {
  return (
    <div className="mb-4">
      <h4 className="font-poppins font-medium text-base text-[rgb(130,129,131)]">{title}</h4>
      <div className="font-poppins mb-0">
        {info}
      </div>
    </div>

  );
}

export default InfoPiece;