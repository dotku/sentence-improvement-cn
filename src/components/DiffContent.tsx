// import diff_match_patch from "diff-match-patch";
import "bootstrap/dist/css/bootstrap.min.css";
import * as DMP from "diff-match-patch";
import { ReactNode } from "react";
import Placeholder from "./Placeholder";

export default function DiffContent({
  text1,
  text2,
  placeholder,
}: {
  text1: string;
  text2: string;
  placeholder?: string;
}) {
  const dmp = new DMP.diff_match_patch();
  const result: ReactNode[] = [];
  const diffs = dmp.diff_main(text1, text2, true);

  diffs.forEach((diff, i) => {
    if (diff[0] === -1) {
      result.push(
        <span key={i} className="bg-danger text-light">
          {diff[1]}
        </span>
      );
    } else if (diff[0] === 1) {
      result.push(
        <span key={i} className="bg-success text-light">
          {diff[1]}
        </span>
      );
    } else {
      result.push(<span key={i}>{diff[1]}</span>);
    }
  });
  return (
    <div>
      {result.length ? (
        [...result]
      ) : (
        <Placeholder>{placeholder || ""}</Placeholder>
      )}
    </div>
  );
}
