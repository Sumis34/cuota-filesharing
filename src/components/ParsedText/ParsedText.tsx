import React, { FC } from "react";

import replace from "react-string-replace";

interface ParsedTextProps {
  text: string;
}

const URL_PATTERN =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;

const ParsedText: FC<ParsedTextProps> = ({ text }) => (
  <div className="prose text-sm dark:text-neutral-50">
    {replace(text, URL_PATTERN, (match, i) => (
      <a
        key={match + i}
        href={match.startsWith("www") ? "http://" + match : match}
        target={"_blank"}
        rel={"noreferrer"}
        className="hover:text-indigo-500 dark:hover:text-indigo-500 dark:text-indigo-300 transition-all d"
      >
        {match}
      </a>
    ))}
  </div>
);

export default ParsedText;
