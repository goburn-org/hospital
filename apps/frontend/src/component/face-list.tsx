import { Maybe } from '@hospital/shared';
import { FC } from 'react';

export const FaceList: FC<{ string: string; search: Maybe<string> }> = ({
  string,
  search,
}) => {
  if (!search) return <span>{string}</span>;
  const isSearchIncludes = string.toLowerCase().includes(search.toLowerCase());
  if (!isSearchIncludes) return <span>{string}</span>;
  const [before, ...rest] = string
    .toLocaleLowerCase()
    .split(search.toLocaleLowerCase());
  return (
    <span>
      {before}
      <span className="bg-yellow-500 py-1">{search}</span>
      {rest.join(search)}
    </span>
  );
};
