import { message, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { MouseEventHandler } from "react";

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

interface DomainCellProps {
  domain?: string;
}

const DomainCell = ({ domain }: DomainCellProps) => {
  const handleCopyClick: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation();
    handleCopy(domain);
  };

  return (
    <td className="px-8 py-3 truncate flex items-center">
      <span className="flex-1 truncate">{domain || "–"}</span>
      {!!domain && (
        <Tooltip title="Копировать">
          <CopyOutlined
            className="ml-2 cursor-pointer text-gray-500 hover:text-blue-500"
            onClick={handleCopyClick}
          />
        </Tooltip>
      )}
    </td>
  );
};

export default DomainCell;
