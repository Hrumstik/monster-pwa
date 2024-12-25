import { message, Tooltip } from "antd";

import { MouseEventHandler } from "react";
import CopyIcon from "@icons/CopyIcon";

const handleCopy = (text?: string): void => {
  if (!text) return;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      message.success(`${text} скопирован!`);
    })
    .catch(() => {
      message.error("Не удалось скопировать текст.");
    });
};

const DomainCell = ({ domain }: { domain?: string }) => {
  const handleCopyClick: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation();
    handleCopy(domain);
  };

  return (
    <td className="px-8 py-3 truncate overflow-hidden whitespace-nowrap">
      <div className="flex justify-center gap-3">
        <div className="text-center truncate ...">{domain ?? "–"}</div>
        {!!domain && (
          <Tooltip title="Копировать">
            <div onClick={handleCopyClick} className="cursor-pointer">
              <CopyIcon />
            </div>
          </Tooltip>
        )}
      </div>
    </td>
  );
};

export default DomainCell;
